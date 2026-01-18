"""
API Views with intentional vulnerabilities
File: backend/api/views.py
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
import logging
import requests
from .models import User, Course, Assignment, Comment
from .serializers import UserSerializer, CourseSerializer

logger = logging.getLogger(__name__)


# VULNERABILITY 1: SQL Injection
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username', '')
    password = request.data.get('password', '')
    
    # VULNERABLE: Raw SQL with string concatenation
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    logger.debug(f"SQL: {query}")
    
    try:
        with connection.cursor() as cursor:
            cursor.execute(query)
            columns = [col[0] for col in cursor.description]
            user_data = cursor.fetchone()
            
            if user_data:
                user_dict = dict(zip(columns, user_data))
                return Response({
                    'success': True,
                    'token': f'token-{username}',
                    'user': {
                        'id': user_dict['id'],
                        'username': user_dict['username'],
                        'email': user_dict['email'],
                        'role': user_dict['role'],
                        'ssn': user_dict.get('ssn'),
                        'credit_card': user_dict.get('credit_card'),
                    }
                })
    except Exception as e:
        logger.error(f"SQL Error: {str(e)}")
        return Response({'error': str(e)}, status=400)
    
    return Response({'error': 'Invalid credentials'}, status=401)


# VULNERABILITY 2: Broken Authentication
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username exists'}, status=400)
    
    user = User.objects.create_user(username=username, password=password, email=email)
    logger.info(f"New user: {username} with password: {password}")
    
    return Response({'message': 'User created', 'user': UserSerializer(user).data}, status=201)


# VULNERABILITY 3: XSS - Reflected
@api_view(['GET'])
@permission_classes([AllowAny])
def search_courses(request):
    query = request.GET.get('q', '')
    courses = Course.objects.filter(title__icontains=query) | Course.objects.filter(description__icontains=query)
    
    return Response({
        'query': query,  # Unsanitized reflection
        'results': CourseSerializer(courses, many=True).data
    })


# VULNERABILITY 4: IDOR
@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'ssn': user.ssn,
            'credit_card': user.credit_card,
            'phone': user.phone,
        })
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


# VULNERABILITY 5: Broken Access Control
@api_view(['PUT', 'DELETE'])
@permission_classes([AllowAny])
def manage_course(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
        
        if request.method == 'PUT':
            course.title = request.data.get('title', course.title)
            course.price = request.data.get('price', course.price)
            course.save()
            return Response({'message': 'Course updated'})
        
        elif request.method == 'DELETE':
            course.delete()
            return Response({'message': 'Course deleted'})
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=404)


# VULNERABILITY 6: File Upload
@api_view(['POST'])
@permission_classes([AllowAny])
def upload_assignment(request):
    file = request.FILES.get('file')
    if not file:
        return Response({'error': 'No file'}, status=400)
    
    # NO VALIDATION!
    assignment = Assignment.objects.create(
        title=request.data.get('title', 'Assignment'),
        file=file,
        course_id=request.data.get('course_id', 1),
        student_id=request.data.get('user_id', 1)
    )
    
    return Response({
        'message': 'Uploaded',
        'filename': file.name,
        'url': assignment.file.url
    }, status=201)


# VULNERABILITY 7: CSRF
@api_view(['POST'])
@permission_classes([AllowAny])
def delete_account(request):
    user_id = request.data.get('user_id')
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({'message': 'User deleted'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


# VULNERABILITY 8: SSRF
@api_view(['POST'])
@permission_classes([AllowAny])
def fetch_resource(request):
    url = request.data.get('url', '')
    
    try:
        response = requests.get(url, timeout=5)
        return Response({
            'url': url,
            'status': response.status_code,
            'content': response.text[:2000]
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)


# VULNERABILITY 9: Sensitive Data Exposure
@api_view(['GET'])
@permission_classes([AllowAny])
def export_users(request):
    users = User.objects.all()
    user_data = [{
        'id': u.id,
        'username': u.username,
        'email': u.email,
        'password': u.password,
        'ssn': u.ssn,
        'credit_card': u.credit_card,
    } for u in users]
    
    logger.info(f"Exported {len(user_data)} users")
    return Response({'users': user_data})


# VULNERABILITY 10: XSS - Stored
@api_view(['POST'])
@permission_classes([AllowAny])
def add_comment(request):
    comment = Comment.objects.create(
        course_id=request.data.get('course_id'),
        user_id=request.data.get('user_id', 1),
        content=request.data.get('content', '')  # No sanitization
    )
    return Response({'id': comment.id, 'content': comment.content}, status=201)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_comments(request, course_id):
    comments = Comment.objects.filter(course_id=course_id).select_related('user')
    return Response({
        'comments': [{
            'id': c.id,
            'user': c.user.username,
            'content': c.content,  # XSS payload
        } for c in comments]
    })


# Regular endpoints
@api_view(['GET'])
@permission_classes([AllowAny])
def get_courses(request):
    courses = Course.objects.all()
    return Response(CourseSerializer(courses, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_course(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
        return Response(CourseSerializer(course).data)
    except Course.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)