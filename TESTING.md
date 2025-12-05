# Testing Guide

This guide provides instructions for testing the Georgia Biology Progress Tool application.

## Prerequisites

Before testing, ensure you have:
1. Node.js 18+ and npm installed
2. PostgreSQL database running (or use a cloud provider)
3. Environment variables configured (see `.env.example`)
4. Dependencies installed (`npm install`)
5. Prisma client generated (`npx prisma generate`)
6. Database schema created (`npx prisma db push`)

## Running the Application Locally

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Test Scenarios

### 1. Authentication Testing

#### Test User Registration
1. Navigate to `http://localhost:3000`
2. Click "Get Started" or "Register"
3. Fill in the registration form:
   - Name: Test Teacher
   - Email: teacher@test.com
   - Password: password123
   - Confirm Password: password123
4. Click "Create account"
5. **Expected**: Redirect to dashboard after successful registration

#### Test User Login
1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - Email: teacher@test.com
   - Password: password123
3. Click "Sign in"
4. **Expected**: Redirect to dashboard

#### Test Invalid Login
1. Try logging in with incorrect credentials
2. **Expected**: See error message "Invalid email or password"

#### Test Protected Routes
1. Log out
2. Try to access `http://localhost:3000/dashboard` directly
3. **Expected**: Redirect to login page

### 2. Class Management Testing

#### Create a New Class
1. Log in to the dashboard
2. Click "Classes" in the navigation
3. Click "Add New Class"
4. Fill in the form:
   - Class Name: Biology 101
   - Period: 1
   - Description: Introduction to Biology
5. Click "Create Class"
6. **Expected**: Redirect to classes list, new class appears

#### Edit a Class
1. From the classes list, click "Edit" on a class
2. Modify the class name to "Biology 101 - Updated"
3. Click "Save Changes"
4. **Expected**: Redirect back to class details, changes saved

#### View Class Details
1. Click on a class name from the classes list
2. **Expected**: See class details with enrolled students

#### Delete a Class
1. From the classes list, click "Delete" on a class
2. Confirm the deletion
3. **Expected**: Class removed from list, enrollments also deleted

### 3. Student Management Testing

#### Add a New Student
1. Click "Students" in the navigation
2. Click "Add New Student"
3. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Student ID: STU001
   - Grade: 10
   - Email: john.doe@student.edu (optional)
4. Click "Add Student"
5. **Expected**: Redirect to students list, new student appears

#### Test Duplicate Student ID
1. Try to add another student with the same Student ID (STU001)
2. **Expected**: See error message "Student ID already exists"

#### Edit a Student
1. From the students list, click "Edit" on a student
2. Change the grade to 11
3. Click "Save Changes"
4. **Expected**: Redirect to students list, changes saved

#### Delete a Student
1. From the students list, click "Delete" on a student
2. Confirm the deletion
3. **Expected**: Student removed from list, all enrollments also deleted

### 4. Enrollment Management Testing

#### Enroll a Student in a Class
1. Navigate to a class detail page
2. Select a student from the dropdown in the "Enroll a Student" section
3. Click "Enroll"
4. **Expected**: Student appears in the enrolled students table

#### Test Duplicate Enrollment
1. Try to enroll the same student in the same class again
2. **Expected**: See error message "Student is already enrolled in this class"

#### Remove a Student from a Class
1. From the class detail page, find an enrolled student
2. Click "Remove" next to the student
3. Confirm the action
4. **Expected**: Student removed from the enrolled students list

#### View All Enrollments
1. From the dashboard, check the "Total Enrollments" count
2. Navigate between classes to verify enrollment counts
3. **Expected**: Counts are accurate across all pages

### 5. UI/UX Testing

#### Test Responsive Design
1. Resize the browser window to mobile size (375px width)
2. Navigate through all pages
3. **Expected**: UI remains functional and readable

#### Test Navigation
1. Use the navigation menu to switch between Dashboard, Classes, and Students
2. Use breadcrumb links (e.g., "← Back to Classes")
3. **Expected**: All navigation works correctly

#### Test Form Validation
1. Try to submit empty forms
2. Try to submit forms with invalid data (e.g., invalid email)
3. **Expected**: See appropriate validation errors

### 6. Data Integrity Testing

#### Test Cascading Deletes
1. Create a class with enrolled students
2. Delete the class
3. Check the students list
4. **Expected**: Students still exist, but enrollments are removed

#### Test Student Deletion
1. Create a student and enroll them in multiple classes
2. Delete the student
3. Check the class enrollment lists
4. **Expected**: Student is removed from all classes

### 7. Security Testing

#### Test SQL Injection Prevention
1. Try to submit SQL injection strings in forms:
   - `' OR '1'='1`
   - `admin'--`
2. **Expected**: Input is safely escaped, no SQL errors

#### Test XSS Prevention
1. Try to submit JavaScript in text fields:
   - `<script>alert('XSS')</script>`
2. **Expected**: Script is escaped and displayed as text

#### Test Password Security
1. Check the database
2. **Expected**: Passwords are hashed (bcrypt), not stored in plain text

#### Test Session Security
1. Log in
2. Clear cookies
3. Try to access protected routes
4. **Expected**: Redirect to login page

## Performance Testing

### Test Page Load Times
1. Use browser DevTools Network tab
2. Check page load times for:
   - Home page
   - Dashboard
   - Classes list
   - Students list
3. **Expected**: Pages load in under 2 seconds on local development

### Test Database Query Performance
1. Add 50+ students
2. Add 10+ classes
3. Create many enrollments
4. Check dashboard load time
5. **Expected**: Dashboard still loads quickly with pagination

## Browser Compatibility Testing

Test the application in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome)

## Automated Testing (Future Enhancement)

Currently, the MVP does not include automated tests. Future enhancements should include:

```bash
# Unit tests with Jest
npm test

# E2E tests with Playwright
npm run test:e2e

# Coverage report
npm run test:coverage
```

## Known Issues and Limitations

1. No email verification for user registration
2. No password reset functionality
3. No bulk import for students
4. No data export functionality
5. No advanced search/filtering
6. No role-based access control (all users are teachers)

## Reporting Issues

If you find bugs during testing:
1. Note the exact steps to reproduce
2. Include screenshots if applicable
3. Note the browser and OS
4. Create an issue in the GitHub repository

## Test Checklist

Use this checklist for comprehensive testing:

### Authentication
- [ ] User registration works
- [ ] User login works
- [ ] Protected routes redirect to login
- [ ] Logout works
- [ ] Session persists across page refreshes

### Classes
- [ ] Create new class
- [ ] Edit existing class
- [ ] View class details
- [ ] Delete class
- [ ] Class list displays correctly

### Students
- [ ] Add new student
- [ ] Edit student information
- [ ] Delete student
- [ ] Student ID uniqueness enforced
- [ ] Student list displays correctly

### Enrollments
- [ ] Enroll student in class
- [ ] Remove student from class
- [ ] Duplicate enrollment prevented
- [ ] Enrollment counts accurate
- [ ] Available students list updates after enrollment

### UI/UX
- [ ] Navigation works correctly
- [ ] Responsive design works on mobile
- [ ] Forms validate input
- [ ] Error messages display clearly
- [ ] Success messages display after actions
- [ ] Loading states work

### Security
- [ ] Passwords are hashed
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] Authentication required for protected routes
- [ ] CSRF protection (NextAuth handles this)

### Data Integrity
- [ ] Cascading deletes work correctly
- [ ] Data persists after page refresh
- [ ] No orphaned records in database
