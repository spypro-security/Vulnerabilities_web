"""
API URL Configuration
File: backend/api/urls.py
"""

from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/login/', views.login),
    path('auth/register/', views.register),
    
    # Courses
    path('courses/', views.get_courses),
    path('courses/<int:course_id>/', views.get_course),
    path('courses/<int:course_id>/manage/', views.manage_course),
    path('courses/search/', views.search_courses),
    
    # Users (IDOR)
    path('users/', views.get_users),
    path('users/<int:user_id>/', views.get_user_profile),
    path('users/export/', views.export_users),
    path('users/delete/', views.delete_account),
    
    # Assignments (File upload)
    path('assignments/upload/', views.upload_assignment),
    
    # Comments (XSS)
    path('comments/<int:course_id>/', views.get_comments),
    path('comments/add/', views.add_comment),
    
    # SSRF
    path('fetch/', views.fetch_resource),
    
    # Database Query Interface (Duplicate DB - Safe to test)
    path('db/vulnerable-query/', views.execute_query_vulnerable),
]


"""
Main URL Configuration
File: backend/edulearn/urls.py
"""

# from django.contrib import admin
# from django.urls import path, include
# from django.conf import settings
# from django.conf.urls.static import static

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', include('api.urls')),
# ]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)