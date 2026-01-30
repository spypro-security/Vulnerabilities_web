# CSRF Vulnerability Demonstration - Implementation Guide

## Overview
This implementation adds a CSRF (Cross-Site Request Forgery) vulnerability demonstration to the EduLearn application. The feature includes an "Add User" button in the navbar that misleadingly appears to add users but actually performs DELETE operations on users.

## Files Modified/Created

### Frontend Changes

#### 1. **Users Page Component** - `src/pages/Users.js` (NEW)
- Main component for user management
- Features:
  - Display all users in a table (ID, username, email, role, phone, SSN, credit card)
  - "+ Add User" button that triggers CSRF attack
  - Delete individual users
  - Delete selected users
  - Delete all users
  - CSRF modal showing available users to attack

**Key Vulnerability**: The "Add User" button creates a hidden form that submits a POST request to `/api/users/delete/` - demonstrating how attackers can trick users into performing unintended actions.

#### 2. **Users Stylesheet** - `src/styles/Users.css` (NEW)
- Professional styling for the Users management page
- Responsive design for mobile and desktop
- Vulnerability info box explaining the CSRF attack
- Modal styling for CSRF attack selection
- Table styling with role badges

#### 3. **Navbar Component Update** - `src/components/Navbar.js`
```javascript
// Added Users link when logged in
<Link to="/users" className="nav-link users-link">
  👥 Users
</Link>
```
- Added Users button with distinctive purple gradient styling
- Only visible when user is logged in
- Requires authentication to access

#### 4. **App.js Route Addition** - `src/App.js`
```javascript
import Users from './pages/Users';

// New route (requires login)
<Route 
  path="/users" 
  element={isLoggedIn ? <Users user={user} /> : <Navigate to="/login" />} 
/>
```

#### 5. **API Service Methods** - `src/services/api.js`
Added new methods:
```javascript
export const getUsers = () => {
  return api.get('/users/');
};

export const deleteUser = (userId) => {
  return api.post('/users/delete/', { user_id: userId });
};
```

#### 6. **Navbar Styling** - `src/App.css`
```css
.nav-link.users-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.4rem;
  font-weight: 600;
}
```

### Backend Changes

#### 1. **New Endpoint** - `api/views.py`
Added `get_users()` endpoint:
```python
@api_view(['GET'])
@permission_classes([AllowAny])
def get_users(request):
    """
    Get all users data - vulnerable to unauthorized access
    Returns all sensitive information without authentication
    """
    users = User.objects.all()
    
    user_list = []
    for user in users:
        user_list.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'phone': user.phone,
            'ssn': user.ssn,  # SSN exposed!
            'credit_card': user.credit_card,  # Credit card exposed!
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'date_joined': user.date_joined.isoformat() if user.date_joined else None,
        })
    
    return Response({'count': len(user_list), 'users': user_list})
```

**Vulnerabilities Demonstrated:**
- No authentication required (AllowAny permission)
- Exposes sensitive PII (SSN, credit card)
- Shows all users to unauthenticated users

#### 2. **URL Route Update** - `api/urls.py`
```python
path('users/', views.get_users),  # New endpoint for listing users
path('users/<int:user_id>/', views.get_user_profile),
path('users/export/', views.export_users),
path('users/delete/', views.delete_account),
```

## How the CSRF Attack Works

### Step-by-Step Flow:

1. **User logs in** → sees "👥 Users" button in navbar
2. **Click "👥 Users"** → navigates to `/users` page
3. **Page displays all users** from the database with sensitive info
4. **Click "+ Add User"** button → Shows CSRF modal with list of users
5. **Select a user** from modal → Hidden form submits POST request
6. **Hidden Form Submission**:
   ```html
   <form method="POST" action="http://localhost:8000/api/users/delete/">
     <input type="hidden" name="user_id" value="[USER_ID]"/>
   </form>
   <!-- Form auto-submits -->
   ```
7. **Backend receives request** → `delete_account()` endpoint
8. **User is deleted** → Flag captured: `HQX{CSRF flag captured}`

## The Vulnerability Chain

### CSRF + IDOR + Sensitive Data Exposure:

1. **CSRF** - The attack is triggered without proper CSRF tokens
2. **IDOR** - Users can access/delete any user ID
3. **Sensitive Data Exposure** - SSN, credit cards, phone numbers visible
4. **Broken Access Control** - No authentication check on delete endpoint

## Testing Instructions

### Prerequisites:
1. Backend running on `http://localhost:8000`
2. Frontend running on `http://localhost:3000`
3. Database populated with users (from `setup_data.py` or vulnerable_db)

### Test Steps:

1. **Start the application**:
   ```bash
   # Backend
   python manage.py runserver
   
   # Frontend
   npm start
   ```

2. **Login with test credentials**:
   - Username: `admin`
   - Password: `admin123`

3. **Navigate to Users**:
   - Click "👥 Users" in navbar
   - See all users listed with sensitive data

4. **Trigger CSRF Attack**:
   - Click "+ Add User" button
   - Select any user from modal
   - Watch user get deleted
   - See flag notification: `HQX{CSRF flag captured}`

5. **Test variations**:
   - Delete individual users via "Delete" button
   - Delete multiple selected users
   - Delete all users
   - Check browser Network tab to see POST requests

## Security Implications

### Real-World CSRF Attack Scenario:
```html
<!-- Attacker's malicious website -->
<img src="http://localhost:8000/api/users/delete/?user_id=1" />
```
Or more realistically with POST:
```html
<form id="csrf" action="http://localhost:8000/api/users/delete/" method="POST">
  <input type="hidden" name="user_id" value="1"/>
</form>
<script>document.getElementById('csrf').submit();</script>
```

When a logged-in user visits this page, the action is performed in their session.

## How to Fix This Vulnerability

### 1. **Implement CSRF Tokens**:
```python
# Django: Enable CSRF middleware
MIDDLEWARE = [
    'django.middleware.csrf.CsrfViewMiddleware',
]

# Require CSRF token in forms
@api_view(['POST'])
def delete_account(request):
    csrf_token = request.POST.get('csrfmiddlewaretoken')
    # Validate token
```

### 2. **Use Safe HTTP Methods**:
- GET requests should be idempotent (not modify data)
- Use DELETE HTTP method with proper verification
- Use POST with CSRF tokens

### 3. **Implement Authentication**:
```python
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Not AllowAny
def delete_account(request):
    # Only authenticated users
    pass
```

### 4. **Add Authorization Checks**:
```python
def delete_account(request):
    user_id = request.data.get('user_id')
    # Users can only delete their own account
    if request.user.id != user_id and not request.user.is_superuser:
        return Response({'error': 'Unauthorized'}, status=403)
```

### 5. **Use SameSite Cookie Flag**:
```python
SESSION_COOKIE_SAMESITE = 'Strict'  # or 'Lax'
```

## Database Note

Users are loaded from the database. The vulnerable database (`vulnerable_db.sqlite3`) is separate from the main database to prevent accidentally deleting important data. You can safely test all deletion features.

## Related Vulnerabilities

This implementation also demonstrates:
- **IDOR (Insecure Direct Object References)** - Access any user ID
- **Broken Access Control** - No permission checks
- **Sensitive Data Exposure** - PII in API responses
- **Missing CSRF Protection** - No token validation
- **Broken Authentication** - AllowAny permission on protected endpoints

## Educational Purpose

This is an intentionally vulnerable application created for educational purposes to demonstrate real-world web security vulnerabilities. It should **NEVER** be deployed in production.
