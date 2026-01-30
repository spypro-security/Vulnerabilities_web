"""
Sync Databases Script
File: backend/sync_databases.py
Copies all data from original database to duplicate database
Run: python sync_databases.py
"""

import os
import django
import shutil

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edulearn.settings')
django.setup()

from django.core.management import call_command
from django.db import connections

def sync_databases():
    """Sync original database to duplicate database"""
    print("🔄 Syncing databases...")
    
    # Get database paths
    original_db = 'db.sqlite3'
    duplicate_db = 'vulnerable_db.sqlite3'
    
    # Delete duplicate database to reset it
    if os.path.exists(duplicate_db):
        os.remove(duplicate_db)
        print(f"✓ Deleted old {duplicate_db}")
    
    # Run migrations on duplicate database to create fresh schema
    print("Running migrations on duplicate database...")
    call_command('migrate', database='duplicate', verbosity=0)
    print("✓ Migrations complete")
    
    # Copy all data from original to duplicate using Django ORM
    from api.models import User, Course, Enrollment, Assignment, Comment
    
    # Copy Users
    for user in User.objects.using('default').all():
        User.objects.using('duplicate').get_or_create(
            id=user.id,
            defaults={
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'password': user.password,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'is_active': user.is_active,
                'date_joined': user.date_joined,
                'last_login': user.last_login,
                'ssn': user.ssn,
                'credit_card': user.credit_card,
                'phone': user.phone,
                'role': user.role,
            }
        )
    print(f"✓ Synced {User.objects.using('default').count()} users")
    
    # Copy Courses
    for course in Course.objects.using('default').all():
        Course.objects.using('duplicate').get_or_create(
            id=course.id,
            defaults={
                'title': course.title,
                'description': course.description,
                'instructor': course.instructor,
                'price': course.price,
                'rating': course.rating,
                'students_count': course.students_count,
                'duration': course.duration,
                'image_url': course.image_url,
                'owner_id': course.owner_id,
                'created_at': course.created_at,
            }
        )
    print(f"✓ Synced {Course.objects.using('default').count()} courses")
    
    # Copy Enrollments
    for enrollment in Enrollment.objects.using('default').all():
        Enrollment.objects.using('duplicate').get_or_create(
            id=enrollment.id,
            defaults={
                'user_id': enrollment.user_id,
                'course_id': enrollment.course_id,
                'enrolled_at': enrollment.enrolled_at,
                'progress': enrollment.progress,
            }
        )
    print(f"✓ Synced {Enrollment.objects.using('default').count()} enrollments")
    
    # Copy Assignments
    for assignment in Assignment.objects.using('default').all():
        Assignment.objects.using('duplicate').get_or_create(
            id=assignment.id,
            defaults={
                'course_id': assignment.course_id,
                'student_id': assignment.student_id,
                'title': assignment.title,
                'file': assignment.file,
                'submitted_at': assignment.submitted_at,
            }
        )
    print(f"✓ Synced {Assignment.objects.using('default').count()} assignments")
    
    # Copy Comments
    for comment in Comment.objects.using('default').all():
        Comment.objects.using('duplicate').get_or_create(
            id=comment.id,
            defaults={
                'course_id': comment.course_id,
                'user_id': comment.user_id,
                'content': comment.content,
                'created_at': comment.created_at,
            }
        )
    print(f"✓ Synced {Comment.objects.using('default').count()} comments")
    
    print("\n✅ Database sync complete!")
    print("The duplicate database now has all original data from the main database.")


if __name__ == '__main__':
    sync_databases()
