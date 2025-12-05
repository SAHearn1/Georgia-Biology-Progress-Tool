# Role Hierarchy and Permissions System

This document describes the comprehensive role-based access control (RBAC) system implemented in the Georgia Biology Progress Tool.

## Overview

The system implements a hierarchical role structure with granular capability-based permissions, ensuring that users can only access and modify data appropriate to their role and organizational context.

## Role Hierarchy

```
                              ┌───────────────────┐
                              │    SUPER_ADMIN    │
                              │  (System-wide)    │
                              └─────────┬─────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
          ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
          │  DISTRICT_ADMIN │ │   DATA_STEWARD  │ │   TECH_ADMIN    │
          │                 │ │                 │ │                 │
          │ • Multi-school  │ │ • Privacy       │ │ • Integrations  │
          │ • Analytics     │ │ • Compliance    │ │ • Configuration │
          └────────┬────────┘ └─────────────────┘ └─────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│   SCHOOL_ADMIN   │  │    DEPT_CHAIR    │
│                  │  │                  │
│ • School-wide    │  │ • Department     │
│ • All teachers   │  │   analytics      │
│ • Interventions  │  │ • Collaboration  │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         └──────────┬──────────┘
                    ▼
           ┌──────────────────┐
           │     TEACHER      │
           │                  │
           │ • Own classes    │
           │ • Own students   │
           │ • Assessments    │
           └──────────────────┘
```

## Roles

### Administrative Roles

#### SUPER_ADMIN
- **Level**: 9 (Highest)
- **Scope**: System-wide
- **Description**: Full system access across all districts, schools, and data
- **Primary Responsibilities**:
  - System configuration and maintenance
  - User management across all levels
  - All data access and analytics
  - Integration management

#### DISTRICT_ADMIN
- **Level**: 8
- **Scope**: District-wide (multi-school)
- **Description**: Manages multiple schools within a district
- **Primary Responsibilities**:
  - Multi-site analytics and reporting
  - District-level user management
  - Cross-school data analysis
  - District-wide interventions

#### DATA_STEWARD
- **Level**: 7
- **Scope**: System/District-wide
- **Description**: Focuses on privacy, compliance, and data governance
- **Primary Responsibilities**:
  - Privacy compliance management
  - Data audit and review
  - Compliance reporting
  - Data quality oversight

#### TECH_ADMIN
- **Level**: 7
- **Scope**: System-wide (technical)
- **Description**: Manages technical infrastructure and integrations
- **Primary Responsibilities**:
  - System configuration
  - External integrations (SIS, LMS, etc.)
  - Technical troubleshooting
  - API management

### Educational Leadership Roles

#### SCHOOL_ADMIN
- **Level**: 6
- **Scope**: Single school
- **Description**: Manages all aspects of a single school
- **Primary Responsibilities**:
  - School-wide data access and analytics
  - Teacher and staff management
  - Intervention programs
  - School-level reporting

#### DEPT_CHAIR
- **Level**: 5
- **Scope**: Department within a school
- **Description**: Leads a department (e.g., Science, Biology)
- **Primary Responsibilities**:
  - Department-level analytics
  - Teacher collaboration and support
  - Curriculum alignment
  - Department-wide assessments

### Educational Delivery Roles

#### TEACHER
- **Level**: 4
- **Scope**: Own classes and students
- **Description**: Manages their own classes and students
- **Primary Responsibilities**:
  - Class management
  - Student assessment
  - Individual student progress tracking
  - Assessment creation

### End User Roles

#### STUDENT
- **Level**: 2
- **Scope**: Own data only
- **Description**: Can view their own academic progress
- **Primary Responsibilities**:
  - View own grades and progress
  - Access own assessments
  - Track personal goals

#### PARENT
- **Level**: 1
- **Scope**: Own children's data only
- **Description**: Limited view of their children's academic data
- **Primary Responsibilities**:
  - Monitor child's progress
  - View child's grades and assessments
  - Communication with teachers

## Capabilities

### Analytics and Data Access

| Capability | Description |
|-----------|-------------|
| **MULTI_SITE_ANALYTICS** | Access analytics across multiple schools/sites |
| **SCHOOL_WIDE_DATA** | Access all data within a school |
| **DEPARTMENT_DATA** | Access department-level aggregated data |
| **CLASS_LEVEL_DATA** | Access class-level data and analytics |
| **INDIVIDUAL_STUDENT_DATA** | Access individual student records |

### Educational Operations

| Capability | Description |
|-----------|-------------|
| **CREATE_ASSESSMENTS** | Create and manage assessments |
| **VIEW_PREDICTIONS** | View predictive analytics and ML models |

### System Administration

| Capability | Description |
|-----------|-------------|
| **SYSTEM_CONFIGURATION** | Modify system settings and configuration |
| **MANAGE_USERS** | Create, update, and delete user accounts |
| **MANAGE_INTEGRATIONS** | Configure external system integrations |
| **PRIVACY_COMPLIANCE** | Access privacy and compliance tools |

## Permissions Matrix

| Capability | DISTRICT | SCHOOL | DEPT | TEACHER | STUDENT | PARENT |
|-----------|----------|--------|------|---------|---------|--------|
| Multi-Site Analytics | ● | ○ | ○ | ○ | ○ | ○ |
| School-Wide Data | ● | ● | ◐ | ○ | ○ | ○ |
| Department Data | ● | ● | ● | ◐ | ○ | ○ |
| Class-Level Data | ● | ● | ● | ● | ○ | ○ |
| Individual Student | ● | ● | ● | ● | ◐ | ◐ |
| Create Assessments | ● | ● | ● | ● | ○ | ○ |
| View Predictions | ● | ● | ● | ● | ○ | ○ |
| System Configuration | ◐ | ◐ | ○ | ○ | ○ | ○ |

**Legend**: ● Full Access | ◐ Limited Access | ○ No Access

## Usage Examples

### Check if user can access a capability

```typescript
import { hasCapability, hasFullCapability } from "@/lib/auth";

// Check if user has any level of access
if (hasCapability(user.role, "CLASS_LEVEL_DATA")) {
  // User can access class data (either FULL or LIMITED)
}

// Check if user has FULL access
if (hasFullCapability(user.role, "CLASS_LEVEL_DATA")) {
  // User has full access to class data
}
```

### Require authentication and authorization

```typescript
import { requireAuth, requireCapability } from "@/lib/auth";

// In an API route
export async function GET(req: Request) {
  // Require authentication
  const user = await requireAuth();

  // Require specific capability
  await requireCapability("SCHOOL_WIDE_DATA");

  // User is authenticated and has the required capability
  // ... proceed with request
}
```

### Filter data based on user role

```typescript
import { getStudentAccessFilter } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get students the user can access
const user = await requireAuth();
const students = await prisma.student.findMany({
  where: getStudentAccessFilter(user),
});
```

### Check resource access

```typescript
import { canAccessResource } from "@/lib/auth";

const canAccess = canAccessResource(
  user.role,
  "student",
  { studentId: "student-123", schoolId: "school-1" },
  {
    schoolId: user.schoolId,
    studentIds: userStudentIds,
  }
);
```

## Database Schema

The role hierarchy is integrated with an organizational structure:

- **District** - Top-level organization (e.g., "Metro School District")
- **School** - Individual schools within a district
- **Department** - Academic departments within a school (e.g., "Science")
- **Classroom** - Individual classes taught by teachers
- **Student** - Individual students enrolled in classrooms

Users are assigned to appropriate levels in this hierarchy based on their role:
- `DISTRICT_ADMIN` → associated with a `District`
- `SCHOOL_ADMIN` → associated with a `School`
- `DEPT_CHAIR` → associated with a `Department`
- `TEACHER` → owns multiple `Classroom` records

## Implementation Files

- **`lib/auth/roles.ts`** - Role definitions, hierarchy, and permissions matrix
- **`lib/auth/middleware.ts`** - Authentication and authorization middleware
- **`lib/auth/helpers.ts`** - Helper functions for common authorization patterns
- **`lib/auth/index.ts`** - Main export file for the auth module
- **`prisma/schema.prisma`** - Database schema with roles and organizational hierarchy

## Testing

Comprehensive unit tests are provided in `lib/auth/roles.test.ts` covering:
- Role hierarchy validation
- Permissions matrix verification
- Capability checking
- Resource access control
- Role management capabilities

Run tests with:
```bash
npm test lib/auth/roles.test.ts
```
