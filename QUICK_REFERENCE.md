# 🎯 CSRF Vulnerability Demo - Quick Reference

## What Was Added

### Button Location
- **Navbar** → "👥 Users" button (purple gradient)
- **Only visible when logged in**
- **Routes to**: `/users` page

### User Management Features
1. **View All Users** - Display table with sensitive data (SSN, CC, Phone)
2. **Add User Button** - Misleading button that triggers CSRF attack
3. **Delete Individual** - Remove single users
4. **Delete Selected** - Remove multiple users at once
5. **Delete All** - Remove all users

## How the CSRF Works

```
User clicks "+ Add User" 
    ↓
Modal appears with list of users
    ↓
User selects a user
    ↓
HIDDEN FORM submits POST request to /api/users/delete/
    ↓
No CSRF token = No protection!
    ↓
User gets deleted silently
    ↓
Flag appears: "HQX{CSRF flag captured}"
```

## API Endpoints

### New Endpoint
```
GET /api/users/
├─ Returns: All users with sensitive data
├─ Auth: None (AllowAny) ← VULNERABILITY
└─ Shows: SSN, credit card, phone
```

### Existing (Vulnerable) Endpoint
```
POST /api/users/delete/
├─ Parameter: user_id
├─ Auth: None (AllowAny) ← VULNERABILITY
├─ CSRF Token: None ← VULNERABILITY
└─ Action: Deletes user
```

## Test Credentials

```
Username: admin
Password: admin123
```

## Step-by-Step Test

1. **Login** with credentials above
2. **Click** "👥 Users" in navbar
3. **See** all users with SSN, credit card visible
4. **Click** "+ Add User" button
5. **Select** any user from modal
6. **Watch** user get deleted (CSRF attack executed)
7. **See** flag notification popup

## Why It Works (Vulnerabilities)

| Vulnerability | Impact | Example |
|---|---|---|
| **No CSRF Token** | Attacker can trigger action from external site | `<img src="delete-api">` |
| **No Authentication** | Unauthenticated users can access/delete | Anonymous access to /api/users/ |
| **IDOR** | Can access/modify any user ID | Delete user 5, then user 10, then user 1 |
| **Sensitive Data** | PII exposed in API response | SSN: 123-45-6789 visible |
| **No Authorization** | No ownership/role checks | Student can delete admin |

## What Makes This Vulnerable

### ❌ Bad (Current Implementation)
```python
@api_view(['POST'])
@permission_classes([AllowAny])  # No auth required!
def delete_account(request):
    user_id = request.data.get('user_id')
    # No CSRF token check!
    # No permission check!
    user = User.objects.get(id=user_id)
    user.delete()  # Anyone can delete anyone!
```

### ✅ Good (Secure Implementation)
```python
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_protect

@api_view(['DELETE'])  # Use DELETE not POST
@permission_classes([IsAuthenticated])  # Auth required
@csrf_protect  # CSRF protection
def delete_account(request):
    user_id = request.data.get('user_id')
    # Check user can only delete their own account
    if request.user.id != int(user_id):
        return Response({'error': 'Unauthorized'}, status=403)
    request.user.delete()
```

## Real-World CSRF Attack

### How Attacker Would Do It
```html
<!-- Attacker's website -->
<form id="csrf" action="http://localhost:8000/api/users/delete/" method="POST">
  <input type="hidden" name="user_id" value="1"/>
</form>
<script>
  // Auto-submit when victim visits this page
  document.getElementById('csrf').submit();
</script>
```

If logged-in user visits this page while authenticated to your site, user 1 gets deleted!

## Database Info

- **Database Used**: `vulnerable_db.sqlite3`
- **Not From**: `setup_data.py`
- **Reason**: Separate isolated database for safe testing
- **Safety**: Won't affect main application database

## Vulnerabilities Triggered

When you use the "Add User" button:

1. ✅ **CSRF Flag**: `HQX{CSRF flag captured}`
   - Triggered by POST without CSRF token

2. ✅ **IDOR Access**: Can access any user ID
   - Triggered by accessing /api/users/

3. ✅ **Sensitive Data**: SSN, CC numbers exposed
   - Triggered by accessing /api/users/

4. ✅ **Broken Access Control**: No permission checks
   - Triggered by deleting any user

5. ✅ **Broken Authentication**: AllowAny permission
   - Triggered by accessing without login

## File Structure

```
edulearn-frontend/
├── src/
│   ├── components/
│   │   └── Navbar.js ← Added Users link
│   ├── pages/
│   │   ├── Users.js ← NEW COMPONENT
│   │   └── [other pages]
│   ├── services/
│   │   └── api.js ← Added getUsers, deleteUser
│   ├── styles/
│   │   └── Users.css ← NEW STYLES
│   ├── App.js ← Added /users route
│   └── App.css ← Added navbar styling

edulearn-backend/
└── api/
    ├── views.py ← Added get_users endpoint
    ├── urls.py ← Added /users/ route
    └── [models, etc.]
```

## Tips for Testing

### Test CSRF Attack
1. Open DevTools → Network tab
2. Click "+ Add User"
3. Select a user
4. Watch POST request to `/api/users/delete/`
5. Check Network → Headers → Form Data shows `user_id`

### Test Multiple Ways to Delete
1. **Individual**: Click "Delete" button on user row
2. **Selected**: Check multiple users, click "Delete Selected"
3. **All**: Click "Delete All Users" (scary!)

### Verify Vulnerability
1. Try accessing `/api/users/` without login (should work)
2. Try accessing `/api/users/` from different user (shows all data)
3. Try POST to `/api/users/delete/` without CSRF token (works!)

## Key Learning Points

1. **CSRF Tokens prevent POST forgery** - Need CSRF middleware
2. **Authentication != Authorization** - Need both
3. **Use safe HTTP methods** - GET for retrieve, DELETE for delete, not POST
4. **Validate requests** - Check ownership, permissions, tokens
5. **Protect sensitive data** - Don't expose SSN/CC in API responses
6. **Use SameSite cookies** - Prevent cross-site cookie sending

## Status

✅ All features implemented  
✅ CSRF attack working  
✅ Multiple deletion methods working  
✅ Vulnerability flags triggering  
✅ Documentation complete  

**Ready for security testing!**
