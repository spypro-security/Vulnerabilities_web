from django.contrib import admin
from .models import User, Course, Enrollment, Assignment, Comment


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'date_joined')
    list_filter = ('role', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    readonly_fields = ('date_joined', 'last_login')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'price', 'rating', 'students_count', 'created_at')
    list_filter = ('rating', 'created_at', 'price')
    search_fields = ('title', 'description', 'instructor')
    readonly_fields = ('created_at',)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'enrolled_at', 'progress')
    list_filter = ('enrolled_at', 'progress')
    search_fields = ('user__username', 'course__title')
    readonly_fields = ('enrolled_at',)


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'student', 'submitted_at')
    list_filter = ('course', 'submitted_at')
    search_fields = ('title', 'student__username', 'course__title')
    readonly_fields = ('submitted_at',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('course', 'user', 'created_at')
    list_filter = ('course', 'created_at')
    search_fields = ('user__username', 'course__title', 'content')
    readonly_fields = ('created_at',)
