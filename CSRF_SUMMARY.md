# CSRF Vulnerability Implementation - Summary

## ✅ What Was Implemented

### Frontend Components Created:

1. **Users Management Page** (`src/pages/Users.js`)
   - Display all users in a table with sensitive data (SSN, credit card, phone)
   - "👥 Add User" button in navbar (misleadingly acts as CSRF attack)
   - Delete individual users option
   - Delete selected users option
   - Delete all users option
   - CSRF attack modal showing users to "add"

2. **Users Styling** (`src/styles/Users.css`)
   - Professional table layout
   - Modal for CSRF attack selection
   - Responsive design
   - Vulnerability info box

3. **Navbar Enhancement** (`src/components/Navbar.js`)
   - Added "👥 Users" button with purple gradient
   - Only visible when logged in

4. **App Routing** (`src/App.js`)
   - Added `/users` route (requires authentication)

5. **API Services** (`src/services/api.js`)
   - `getUsers()` - Fetch all users
   - `deleteUser(userId)` - Delete a user (triggers CSRF)

### Backend Endpoints Created:

1. **GET /api/users/** 
   - Returns all users with sensitive data
   - No authentication required (intentional vulnerability)
   - Shows SSN, credit card, phone numbers

2. **Enhanced DELETE /api/users/delete/**
   - Already existed
   - Now used by CSRF attack
   - No CSRF token validation
   - No permission checks

## 🎯 How It Works

### The CSRF Attack Flow:

```
User clicks "👥 Users" in Navbar
    ↓
Routes to /users page
    ↓
GET /api/users/ - Fetches all users with sensitive data
    ↓
Displays table of users
    ↓
User clicks "+ Add User" button
    ↓
Modal shows user selection
    ↓
User selects a user to "add"
    ↓
Hidden form submits POST /api/users/delete/ with user_id
    ↓
Backend deletes user (no CSRF validation!)
    ↓
Flag captured: "HQX{CSRF flag captured}"
```

## 🔒 Vulnerabilities Demonstrated

1. **CSRF (Cross-Site Request Forgery)**
   - No CSRF token validation
   - Can be triggered from external websites
   - Uses hidden form submission

2. **IDOR (Insecure Direct Object References)**
   - Can access/delete any user ID
   - No ownership verification

3. **Sensitive Data Exposure**
   - SSN displayed in plaintext
   - Credit card numbers exposed
   - Phone numbers visible to all

4. **Broken Access Control**
   - AllowAny permission on protected endpoints
   - No authentication checks
   - No authorization checks

5. **Broken Authentication**
   - Users endpoint requires no login
   - Delete operation requires no authentication

## 📋 Testing Checklist

- [x] Users page displays all users
- [x] Sensitive data (SSN, CC) is visible
- [x] "Add User" button opens CSRF modal
- [x] Selecting user triggers CSRF attack
- [x] POST request sent to /api/users/delete/
- [x] User deleted successfully
- [x] Flag notification appears
- [x] Works for admin, instructors, and students
- [x] Multiple deletion methods work (individual, selected, all)
- [x] Uses vulnerable_db.sqlite3 (not setup_data.py)

## 🚀 Quick Start

1. **Login with test credentials:**
   ```
   Username: admin
   Password: admin123
   ```

2. **Click "👥 Users" in navbar**

3. **Click "+ Add User" button**

4. **Select a user to trigger CSRF attack**

5. **Watch user get deleted** ❌

6. **See vulnerability flag** 🎉

## 📊 Database Information

- Uses: `vulnerable_db.sqlite3` (separate from main database)
- Contains test users with sensitive data
- Safe to test deletion features
- Data not from `setup_data.py` (isolated for testing)

## 🔍 Key Code Examples

### Hidden Form CSRF Attack:
```javascript
const performCSRFAttack = async (userId) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'http://localhost:8000/api/users/delete/';
  form.style.display = 'none';

  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'user_id';
  input.value = userId;

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();  // ← Triggers CSRF
  document.body.removeChild(form);
};
```

### Backend Vulnerability:
```python
@api_view(['POST'])
@permission_classes([AllowAny])  # ← No authentication
def delete_account(request):
    user_id = request.data.get('user_id')
    # ← No CSRF token validation
    # ← No permission checks
    user = User.objects.get(id=user_id)
    user.delete()  # User deleted!
```

## 📚 Educational Value

This implementation teaches:
- How CSRF attacks work
- Why CSRF tokens are important
- How to misuse HTTP methods
- Importance of authentication
- Sensitive data handling
- Combined vulnerability exploitation

## ⚠️ Important Notes

- This is **INTENTIONALLY VULNERABLE** for educational purposes
- Uses separate `vulnerable_db.sqlite3` for safe testing
- All vulnerabilities are documented with comments
- NOT suitable for production use
- For security training and vulnerability research only

## 📝 Files Modified

### Created:
- `edulearn-frontend/src/pages/Users.js`
- `edulearn-frontend/src/styles/Users.css`
- `CSRF_IMPLEMENTATION.md` (detailed guide)

### Modified:
- `edulearn-frontend/src/components/Navbar.js` (added Users link)
- `edulearn-frontend/src/App.js` (added route)
- `edulearn-frontend/src/services/api.js` (added API methods)
- `edulearn-frontend/src/App.css` (navbar styling)
- `edulearn-backend/api/views.py` (added get_users endpoint)
- `edulearn-backend/api/urls.py` (added users route)

---

**Status**: ✅ Implementation Complete and Tested
