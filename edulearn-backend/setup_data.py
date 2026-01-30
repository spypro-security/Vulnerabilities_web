"""
Database Setup Script
File: backend/setup_data.py
Run: python setup_data.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edulearn.settings')
django.setup()

from api.models import User, Course
from django.db import connections


def setup_database(db_name='default'):
    print(f"Setting up {db_name} database...")
    
    # Create users
    admin, _ = User.objects.using(db_name).get_or_create(
        username='admin',
        defaults={
            'email': 'admin@edulearn.com',
            'role': 'admin',
            'ssn': '123-45-6789',
            'credit_card': '4532-1111-2222-3333',
            'phone': '+1-555-0001',
            'is_staff': True,
            'is_superuser': True
        }
    )
    admin.set_password('admin123')
    admin.save(using=db_name)
    print("✓ Admin user created (admin/admin123)")
    
    student, _ = User.objects.using(db_name).get_or_create(
        username='john.doe',
        defaults={
            'email': 'john@example.com',
            'role': 'student',
            'ssn': '987-65-4321',
            'credit_card': '5425-4444-5555-6666',
            'phone': '+1-555-0002'
        }
    )
    student.set_password('john123')
    student.save(using=db_name)
    print("✓ Student user created (john.doe/john123)")
    
    instructor, _ = User.objects.using(db_name).get_or_create(
        username='jane.smith',
        defaults={
            'email': 'jane@example.com',
            'role': 'instructor',
            'ssn': '555-12-3456',
            'credit_card': '3782-8224-6310-005',
            'phone': '+1-555-0003'
        }
    )
    instructor.set_password('jane456')
    instructor.save(using=db_name)
    print("✓ Instructor user created (jane.smith/jane456)")
    
    # Create courses
    courses_data = [
        {
            'title': 'Complete Web Development Bootcamp',
            'description': 'Master HTML, CSS, JavaScript, React, Node.js',
            'instructor': 'Dr. Sarah Johnson',
            'price': 89.99,
            'rating': 4.8,
            'students_count': 15420,
            'duration': '42 hours',
            'image_url': '🌐',
            'owner': instructor
        },
        {
            'title': 'Data Science with Python',
            'description': 'Learn Python, Pandas, NumPy, Machine Learning',
            'instructor': 'Prof. Michael Chen',
            'price': 79.99,
            'rating': 4.9,
            'students_count': 12300,
            'duration': '38 hours',
            'image_url': '📊',
            'owner': instructor
        },
        {
            'title': 'Cybersecurity Fundamentals',
            'description': 'Network Security, Encryption, Ethical Hacking',
            'instructor': 'Dr. James Miller',
            'price': 94.99,
            'rating': 4.9,
            'students_count': 8500,
            'duration': '35 hours',
            'image_url': '🔒',
            'owner': admin
        },
        {
            'title': 'Digital Marketing Masterclass',
            'description': 'SEO, Social Media, Content Marketing, Analytics',
            'instructor': 'Emma Williams',
            'price': 69.99,
            'rating': 4.7,
            'students_count': 9800,
            'duration': '28 hours',
            'image_url': '📱',
            'owner': admin
        }
    ]
    
    for course_data in courses_data:
        Course.objects.using(db_name).get_or_create(
            title=course_data['title'],
            defaults=course_data
        )
    
    print(f"✓ {len(courses_data)} courses created")


if __name__ == '__main__':
    # Setup both databases with original data
    setup_database('default')
    print()
    setup_database('duplicate')
    
    print("\n✅ Setup complete!")
    print("\nDatabases:")
    print("  Original: db.sqlite3 (default)")
    print("  Duplicate: vulnerable_db.sqlite3 (for testing)")
    print("\nTest Accounts:")
    print("  Admin: admin / admin123")
    print("  Student: john.doe / john123")
    print("  Instructor: jane.smith / jane456")