"""
Database models for EduLearn
File: backend/api/models.py
"""

from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Custom User model with sensitive data (VULNERABLE)"""
    # VULNERABILITY: Storing sensitive PII without encryption
    ssn = models.CharField(max_length=11, blank=True, null=True)
    credit_card = models.CharField(max_length=19, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    role = models.CharField(max_length=20, default='student')
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return self.username


class Course(models.Model):
    """Course model"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    instructor = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.FloatField(default=4.5)
    students_count = models.IntegerField(default=0)
    duration = models.CharField(max_length=50, default="30 hours")
    image_url = models.CharField(max_length=500, default='📚')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_courses')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title


class Enrollment(models.Model):
    """Student course enrollments"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    progress = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ('user', 'course')


class Assignment(models.Model):
    """Student assignment uploads"""
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    # VULNERABILITY: No file validation
    file = models.FileField(upload_to='assignments/')
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} by {self.student.username}"


class Comment(models.Model):
    """Course comments/reviews"""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # VULNERABILITY: Storing unsanitized HTML/JavaScript
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Comment by {self.user.username}"