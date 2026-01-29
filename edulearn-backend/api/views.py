"""
API Views with intentional vulnerabilities
File: backend/api/views.py
COMPLETE VERSION - Copy this entire file
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
import logging
import requests
import sqlite3
import os
from .models import User, Course, Assignment, Comment
from .serializers import UserSerializer, CourseSerializer

logger = logging.getLogger(__name__)


# ============================================
# VULNERABILITY 1: SQL Injection
# ============================================
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login endpoint vulnerable to SQL Injection
    Test: username: admin' OR '1'='1 -- 
    """
    username = request.data.get('username', '')
    password = request.data.get('password', '')
    
    # VULNERABLE: Raw SQL with string concatenation
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    
    # VULNERABILITY: Logging sensitive queries
    logger.debug(f"Executing SQL Query: {query}")
    
    try:
        with connection.cursor() as cursor:
            cursor.execute(query)
            columns = [col[0] for col in cursor.description]
            user_data = cursor.fetchone()
            
            if user_data:
                user_dict = dict(zip(columns, user_data))
                
                response_data = {
                    'success': True,
                    'token': f'fake-jwt-token-{username}',
                    'user': {
                        'id': user_dict['id'],
                        'username': user_dict['username'],
                        'email': user_dict['email'],
                        'role': user_dict['role'],
                        'ssn': user_dict.get('ssn'),  # Exposing SSN!
                        'credit_card': user_dict.get('credit_card'),  # Exposing CC!
                    }
                }
                
                # Add flag only if SQL injection was used (demonstrates vulnerability)
                if any(inject in username.lower() for inject in ["' or '", "' or 1=1", "--", "union select"]):
                    response_data['flag'] = 'HQX{SQL_Injection flag captured}'
                
                return Response(response_data, status=status.HTTP_200_OK)
                
    except Exception as e:
        # VULNERABILITY: Detailed error messages
        logger.error(f"SQL Error: {str(e)}")
        return Response({
            'error': str(e),
            'query': query  # Exposing query in error
        }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({
        'error': 'Invalid credentials'
    }, status=status.HTTP_401_UNAUTHORIZED)


# ============================================
# VULNERABILITY 2 & 8: Broken Authentication
# ============================================
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Registration with no rate limiting or password validation
    """
    username = request.data.get('username')
    password = request.data.get('password')  # No strength requirements
    email = request.data.get('email')
    
    if User.objects.filter(username=username).exists():
        return Response({
            'error': 'Username already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # VULNERABILITY: Accepting weak passwords
    user = User.objects.create_user(
        username=username,
        password=password,
        email=email
    )
    
    logger.info(f"New user registered: {username} with password: {password}")  # Logging password!
    
    response_data = {
        'message': 'User created successfully',
        'user': UserSerializer(user).data
    }
    
    # Add flag only if password is weak (demonstrates vulnerability)
    if len(password) < 6:
        response_data['flag'] = 'HQX{Broken_Authentication flag captured}'
    
    return Response(response_data, status=status.HTTP_201_CREATED)


# ============================================
# VULNERABILITY 3: XSS - Reflected
# ============================================
@api_view(['GET'])
@permission_classes([AllowAny])
def search_courses(request):
    """
    Search endpoint vulnerable to reflected XSS
    Test: ?q=<script>alert('XSS')</script>
    """
    query = request.GET.get('q', '')
    
    # VULNERABILITY: No input sanitization
    courses = Course.objects.filter(
        title__icontains=query
    ) | Course.objects.filter(
        description__icontains=query
    )
    
    response_data = {
        'query': query,  # Reflecting unsanitized input
        'count': courses.count(),
        'results': CourseSerializer(courses, many=True).data
    }
    
    # Add flag only if XSS payload is detected (demonstrates vulnerability)
    if any(xss in query.lower() for xss in ["<script>", "javascript:", "onerror", "onclick"]):
        response_data['flag'] = 'HQX{XSS_Reflected flag captured}'
    
    return Response(response_data)


# ============================================
# VULNERABILITY 6: IDOR
# ============================================
@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_profile(request, user_id):
    """
    View any user's profile without authorization
    Test: /api/users/1/, /api/users/2/, etc.
    """
    # VULNERABILITY: No authorization check
    try:
        user = User.objects.get(id=user_id)
        
        # VULNERABILITY: Exposing ALL sensitive data
        return Response({
            'flag': 'HQX{IDOR flag captured}',  # Flag for IDOR vulnerability
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'ssn': user.ssn,  # SSN exposed!
            'credit_card': user.credit_card,  # Credit card exposed!
            'phone': user.phone,
            'date_joined': user.date_joined,
            'last_login': user.last_login,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser
        })
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)


# ============================================
# VULNERABILITY 2: Broken Access Control
# ============================================
@api_view(['PUT', 'DELETE'])
@permission_classes([AllowAny])
def manage_course(request, course_id):
    """
    Edit/delete any course without ownership check
    """
    try:
        course = Course.objects.get(id=course_id)
        
        # VULNERABILITY: No ownership or permission verification
        if request.method == 'PUT':
            course.title = request.data.get('title', course.title)
            course.description = request.data.get('description', course.description)
            course.price = request.data.get('price', course.price)
            course.save()
            
            logger.info(f"Course {course_id} updated by anonymous user")
            
            return Response({
                'message': 'Course updated successfully',
                'flag': 'HQX{Broken_Access_Control flag captured}',  # Flag for unauthorized course management
                'course': CourseSerializer(course).data
            })
        
        elif request.method == 'DELETE':
            course_title = course.title
            course.delete()
            
            logger.info(f"Course '{course_title}' deleted by anonymous user")
            
            return Response({
                'message': f'Course "{course_title}" deleted successfully',
                'flag': 'HQX{Broken_Access_Control flag captured}',  # Flag for unauthorized course deletion
            })
            
    except Course.DoesNotExist:
        return Response({
            'error': 'Course not found'
        }, status=status.HTTP_404_NOT_FOUND)


# ============================================
# VULNERABILITY 5: File Upload
# ============================================
@api_view(['POST'])
@permission_classes([AllowAny])
def upload_assignment(request):
    """
    File upload with NO validation
    Test: Upload .exe, .php, .sh files
    """
    file = request.FILES.get('file')
    title = request.data.get('title', 'Untitled Assignment')
    course_id = request.data.get('course_id', 1)
    user_id = request.data.get('user_id', 1)
    
    if not file:
        return Response({
            'error': 'No file provided'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # VULNERABILITY: No file type validation
    # VULNERABILITY: No file size limit
    # VULNERABILITY: No malware scanning
    # VULNERABILITY: No filename sanitization
    
    logger.debug(f"File upload: {file.name}, size: {file.size}, type: {file.content_type}")
    
    assignment = Assignment.objects.create(
        title=title,
        file=file,
        course_id=course_id,
        student_id=user_id
    )
    
    return Response({
        'message': 'File uploaded successfully',
        'flag': 'HQX{File_Upload flag captured}',  # Flag for insecure file upload
        'filename': file.name,
        'size': file.size,
        'content_type': file.content_type,
        'url': request.build_absolute_uri(assignment.file.url)
    }, status=status.HTTP_201_CREATED)


# ============================================
# VULNERABILITY 4: CSRF
# ============================================
@api_view(['POST'])
@permission_classes([AllowAny])
def delete_account(request):
    """
    Delete user account - vulnerable to CSRF
    No token validation
    """
    user_id = request.data.get('user_id')
    
    # VULNERABILITY: Can be triggered via CSRF attack
    try:
        user = User.objects.get(id=user_id)
        username = user.username
        user.delete()
        
        logger.warning(f"User {username} (ID: {user_id}) deleted via potential CSRF")
        
        return Response({
            'message': f'User "{username}" deleted successfully',
            'flag': 'HQX{CSRF flag captured}',  # Flag for CSRF vulnerability
        })
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)


# ============================================
# VULNERABILITY 10: SSRF
# ============================================
@api_view(['POST'])
@permission_classes([AllowAny])
def fetch_resource(request):
    """
    Fetch external resource - SSRF vulnerability
    Test: http://localhost:8000/admin
          http://169.254.169.254/latest/meta-data/
    """
    url = request.data.get('url', '')
    
    # VULNERABILITY: No URL validation or whitelist
    # Can access internal services, cloud metadata, etc.
    
    logger.debug(f"Fetching URL: {url}")
    
    try:
        # VULNERABILITY: Making requests to user-provided URLs
        response = requests.get(url, timeout=5, allow_redirects=True)
        
        return Response({
            'url': url,
            'flag': 'HQX{SSRF flag captured}',  # Flag for SSRF vulnerability
            'status_code': response.status_code,
            'headers': dict(response.headers),
            'content': response.text[:2000],  # First 2000 chars
            'content_length': len(response.text)
        })
    except requests.exceptions.RequestException as e:
        return Response({
            'error': str(e),
            'url': url
        }, status=status.HTTP_400_BAD_REQUEST)


# ============================================
# VULNERABILITY 9: Sensitive Data Exposure
# ============================================
@api_view(['GET'])
@permission_classes([AllowAny])
def export_users(request):
    """
    Export ALL user data including sensitive info
    No admin check
    """
    # VULNERABILITY: Anyone can export all user data
    users = User.objects.all()
    
    user_data = []
    for user in users:
        user_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'password': user.password,  # Password hash exposed!
            'ssn': user.ssn,  # SSN exposed!
            'credit_card': user.credit_card,  # CC exposed!
            'phone': user.phone,
            'role': user.role,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'date_joined': user.date_joined.isoformat() if user.date_joined else None,
            'last_login': user.last_login.isoformat() if user.last_login else None
        })
    
    # VULNERABILITY: Logging all sensitive data
    logger.info(f"User data export: {len(user_data)} users exported")
    logger.debug(f"Exported data: {user_data}")
    
    return Response({
        'count': len(user_data),
        'flag': 'HQX{Sensitive_Data_Exposure flag captured}',  # Flag for data exposure
        'users': user_data
    })


# ============================================
# VULNERABILITY 3: XSS - Stored
# ============================================
@api_view(['POST'])
@permission_classes([AllowAny])
def add_comment(request):
    """
    Add comment with stored XSS vulnerability
    Test: <img src=x onerror=alert('XSS')>
    """
    try:
        course_id = request.data.get('course_id')
        content = request.data.get('content', '')
        user_id = request.data.get('user_id', 1)
        
        # Validate course exists
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(
                {'error': 'Course not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Validate user exists
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # VULNERABILITY: Storing unsanitized HTML/JavaScript
        # No escaping, no sanitization - accepts everything
        comment = Comment.objects.create(
            course_id=course_id,
            user_id=user_id,
            content=content  # Raw content stored directly
        )
        
        logger.debug(f"Comment added: {content}")
        
        response_data = {
            'id': comment.id,
            'user': user.username,
            'content': content,  # Returning raw content
            'created_at': comment.created_at.isoformat() if comment.created_at else None
        }
        
        # Add flag only if XSS payload is detected (demonstrates vulnerability)
        if any(xss in content.lower() for xss in ["<script>", "javascript:", "onerror", "onclick", "<img"]):
            response_data['flag'] = 'HQX{XSS_Stored flag captured}'
        
        return Response(response_data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error adding comment: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def get_comments(request, course_id):
    """Get comments for a course - XSS vulnerability when displayed"""
    try:
        # Check if course exists
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({
                'course_id': course_id,
                'count': 0,
                'comments': []
            })
        
        # Get comments with related user
        comments = Comment.objects.filter(course_id=course_id).select_related('user')
        
        # VULNERABILITY: Returning unsanitized comments (Stored XSS)
        comment_list = []
        has_xss = False
        for c in comments:
            comment_list.append({
                'id': c.id,
                'user': c.user.username,
                'content': c.content,  # Raw HTML/JS returned without escaping
                'created_at': c.created_at.isoformat() if c.created_at else None
            })
            # Check if this comment contains XSS payload
            if any(xss in c.content.lower() for xss in ["<script>", "javascript:", "onerror", "onclick", "<img"]):
                has_xss = True
        
        response_data = {
            'course_id': course_id,
            'count': len(comment_list),
            'comments': comment_list
        }
        
        # Add flag only if XSS payload is found in comments (demonstrates vulnerability)
        if has_xss:
            response_data['flag'] = 'HQX{XSS_Stored flag captured}'
        
        return Response(response_data)
    except Exception as e:
        logger.error(f"Error getting comments: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ============================================
# Regular API Endpoints
# ============================================
@api_view(['GET'])
@permission_classes([AllowAny])
def get_courses(request):
    """Get all courses"""
    courses = Course.objects.all().order_by('-created_at')
    return Response(CourseSerializer(courses, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_course(request, course_id):
    """Get single course"""
    try:
        course = Course.objects.get(id=course_id)
        return Response(CourseSerializer(course).data)
    except Course.DoesNotExist:
        return Response({
            'error': 'Course not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """API health check"""
    return Response({
        'status': 'running',
        'message': 'EduLearn API - Deliberately Vulnerable for Training'
    })


# ============================================
# VULNERABILITY 11: Database Query Interface (Duplicate DB)
# ============================================
def get_vulnerable_db_connection():
    """Get connection to the duplicate vulnerable database"""
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'vulnerable_db.sqlite3')

    # Create database and tables if they don't exist
    if not os.path.exists(db_path):
        create_vulnerable_database(db_path)

    return sqlite3.connect(db_path)


def create_vulnerable_database(db_path):
    """Create and populate the duplicate vulnerable database"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create tables
    cursor.execute('''
        CREATE TABLE employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            salary REAL,
            ssn TEXT,
            credit_card TEXT,
            department TEXT,
            role TEXT DEFAULT 'employee'
        )
    ''')

    cursor.execute('''
        CREATE TABLE sensitive_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data_type TEXT,
            content TEXT,
            access_level TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE flags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            flag_name TEXT,
            flag_value TEXT,
            captured BOOLEAN DEFAULT FALSE
        )
    ''')

    # Insert sample data
    employees_data = [
        ('John Doe', 'john@company.com', 75000.00, '123-45-6789', '4111-1111-1111-1111', 'Engineering', 'employee'),
        ('Jane Smith', 'jane@company.com', 85000.00, '987-65-4321', '4222-2222-2222-2222', 'HR', 'manager'),
        ('Bob Johnson', 'bob@company.com', 65000.00, '456-78-9012', '4333-3333-3333-3333', 'Sales', 'employee'),
        ('Alice Brown', 'alice@company.com', 95000.00, '321-54-9876', '4444-4444-4444-4444', 'Executive', 'admin'),
        ('Charlie Wilson', 'charlie@company.com', 55000.00, '654-32-1987', '4555-5555-5555-5555', 'IT', 'employee'),
    ]

    cursor.executemany('INSERT INTO employees (name, email, salary, ssn, credit_card, department, role) VALUES (?, ?, ?, ?, ?, ?, ?)', employees_data)

    sensitive_data = [
        ('API Keys', 'sk-1234567890abcdef, pk-abcdef1234567890', 'confidential'),
        ('Database Passwords', 'admin:SuperSecret123!, user:Password456!', 'restricted'),
        ('Internal IPs', '192.168.1.100, 10.0.0.50, 172.16.0.25', 'internal'),
        ('Encryption Keys', 'AES_KEY_1234567890123456, RSA_PRIVATE_KEY_abcdef...', 'top_secret'),
    ]

    cursor.executemany('INSERT INTO sensitive_data (data_type, content, access_level) VALUES (?, ?, ?)', sensitive_data)

    flags_data = [
        ('Database_Access', 'HQX{Database_Query_Interface flag captured}', False),
        ('Data_Exfiltration', 'HQX{Sensitive_Data_Exposed flag captured}', False),
        ('Admin_Escalation', 'HQX{Privilege_Escalation flag captured}', False),
    ]

    cursor.executemany('INSERT INTO flags (flag_name, flag_value, captured) VALUES (?, ?, ?)', flags_data)

    conn.commit()
    conn.close()


@api_view(['POST'])
@permission_classes([AllowAny])
def execute_query_vulnerable(request):
    """
    Execute arbitrary SQL queries on DUPLICATE database - SEVERE VULNERABILITY
    Allows viewing tables, altering data, and complete database control
    This uses a separate vulnerable database for safe testing
    Test: {"query": "SELECT * FROM employees"}
    Test: {"query": "DROP TABLE employees"}
    """
    query = request.data.get('query', '')

    if not query:
        return Response({
            'error': 'Query parameter is required'
        }, status=status.HTTP_400_BAD_REQUEST)

    # VULNERABILITY: Execute ANY SQL query without validation
    # Can view all tables, modify data, drop tables, etc.

    logger.warning(f"Executing arbitrary SQL query on vulnerable DB: {query}")

    try:
        conn = get_vulnerable_db_connection()
        cursor = conn.cursor()

        cursor.execute(query)

        # Handle SELECT queries (return results)
        if query.strip().upper().startswith('SELECT') or query.strip().upper().startswith('SHOW'):
            columns = [desc[0] for desc in cursor.description] if cursor.description else []
            rows = cursor.fetchall()

            # Convert to list of dicts for JSON response
            results = []
            for row in rows:
                results.append(dict(zip(columns, row)))

            response_data = {
                'query': query,
                'columns': columns,
                'rows': results,
                'count': len(results),
                'database': 'vulnerable_db.sqlite3 (DUPLICATE - SAFE TO TEST)',
                'flag': 'HQX{Database_Query_Interface flag captured}'
            }

            # Special flag for sensitive data access
            if 'sensitive_data' in query.lower() or 'ssn' in query.lower() or 'credit_card' in query.lower():
                response_data['flag'] = 'HQX{Sensitive_Data_Exposed flag captured}'

            # Special flag for admin escalation
            if 'role' in query.lower() and ('admin' in query.lower() or 'update' in query.lower()):
                response_data['flag'] = 'HQX{Privilege_Escalation flag captured}'

        # Handle other queries (INSERT, UPDATE, DELETE, etc.)
        else:
            # Get affected rows count
            affected_rows = cursor.rowcount
            conn.commit()

            response_data = {
                'query': query,
                'message': f'Query executed successfully. Affected rows: {affected_rows}',
                'affected_rows': affected_rows,
                'database': 'vulnerable_db.sqlite3 (DUPLICATE - SAFE TO TEST)',
                'flag': 'HQX{Database_Query_Interface flag captured}'
            }

        conn.close()
        return Response(response_data)

    except Exception as e:
        logger.error(f"Vulnerable DB query error: {str(e)}")
        return Response({
            'error': str(e),
            'query': query,
            'database': 'vulnerable_db.sqlite3 (DUPLICATE - SAFE TO TEST)',
            'flag': 'HQX{Database_Query_Interface flag captured}'
        }, status=status.HTTP_400_BAD_REQUEST)