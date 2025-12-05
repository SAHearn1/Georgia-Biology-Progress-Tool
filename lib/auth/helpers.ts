/**
 * Authorization Helper Utilities
 *
 * Provides utility functions for common authorization patterns and
 * data filtering based on user roles and permissions.
 */

import { Role, Capability, permissionsMatrix, getAccessLevel } from "./roles";
import type { AuthenticatedUser } from "./middleware";

// =============================================================================
// Query Filter Helpers
// =============================================================================

/**
 * Generate Prisma where clause for filtering data based on user's role and context
 */
export function getUserDataFilter(user: AuthenticatedUser) {
  switch (user.role) {
    case "SUPER_ADMIN":
      // No filter - can see everything
      return {};

    case "DISTRICT_ADMIN":
    case "DATA_STEWARD":
      // Can see all data in their district
      if (user.districtId) {
        return {
          OR: [
            { districtId: user.districtId },
            {
              school: {
                districtId: user.districtId,
              },
            },
          ],
        };
      }
      return { id: "none" }; // No access if no district assigned

    case "SCHOOL_ADMIN":
      // Can see all data in their school
      if (user.schoolId) {
        return {
          OR: [
            { schoolId: user.schoolId },
            {
              classroom: {
                schoolId: user.schoolId,
              },
            },
          ],
        };
      }
      return { id: "none" };

    case "DEPT_CHAIR":
      // Can see data in their department
      if (user.departmentId) {
        return {
          OR: [
            { departmentId: user.departmentId },
            {
              classroom: {
                departmentId: user.departmentId,
              },
            },
          ],
        };
      }
      return { id: "none" };

    case "TEACHER":
      // Can only see their own classes/students
      return {
        ownerId: user.id,
      };

    case "STUDENT":
    case "PARENT":
      // Can only see their own data
      return {
        id: user.id,
      };

    default:
      return { id: "none" }; // No access by default
  }
}

/**
 * Get student filter based on user role and context
 */
export function getStudentAccessFilter(user: AuthenticatedUser) {
  switch (user.role) {
    case "SUPER_ADMIN":
      return {};

    case "DISTRICT_ADMIN":
    case "DATA_STEWARD":
      if (user.districtId) {
        return {
          enrollments: {
            some: {
              classroom: {
                school: {
                  districtId: user.districtId,
                },
              },
            },
          },
        };
      }
      return { id: "none" };

    case "SCHOOL_ADMIN":
      if (user.schoolId) {
        return {
          enrollments: {
            some: {
              classroom: {
                schoolId: user.schoolId,
              },
            },
          },
        };
      }
      return { id: "none" };

    case "DEPT_CHAIR":
      if (user.departmentId) {
        return {
          enrollments: {
            some: {
              classroom: {
                departmentId: user.departmentId,
              },
            },
          },
        };
      }
      return { id: "none" };

    case "TEACHER":
      return {
        enrollments: {
          some: {
            classroom: {
              ownerId: user.id,
            },
          },
        },
      };

    case "STUDENT":
      // Students can only access their own record
      return {
        userId: user.id,
      };

    case "PARENT":
      // Parents can access their children's records
      return {
        parents: {
          some: {
            parentId: user.id,
          },
        },
      };

    default:
      return { id: "none" };
  }
}

/**
 * Get classroom filter based on user role and context
 */
export function getClassroomAccessFilter(user: AuthenticatedUser) {
  switch (user.role) {
    case "SUPER_ADMIN":
      return {};

    case "DISTRICT_ADMIN":
    case "DATA_STEWARD":
      if (user.districtId) {
        return {
          school: {
            districtId: user.districtId,
          },
        };
      }
      return { id: "none" };

    case "SCHOOL_ADMIN":
      if (user.schoolId) {
        return {
          schoolId: user.schoolId,
        };
      }
      return { id: "none" };

    case "DEPT_CHAIR":
      if (user.departmentId) {
        return {
          departmentId: user.departmentId,
        };
      }
      return { id: "none" };

    case "TEACHER":
      return {
        ownerId: user.id,
      };

    case "STUDENT":
      // Students can see classrooms they're enrolled in
      return {
        enrollments: {
          some: {
            student: {
              userId: user.id,
            },
          },
        },
      };

    case "PARENT":
      // Parents can see classrooms their children are enrolled in
      return {
        enrollments: {
          some: {
            student: {
              parents: {
                some: {
                  parentId: user.id,
                },
              },
            },
          },
        },
      };

    default:
      return { id: "none" };
  }
}

// =============================================================================
// Permission Summary Helpers
// =============================================================================

/**
 * Get a summary of all capabilities for a user's role
 */
export function getUserCapabilitySummary(role: Role) {
  const capabilities = permissionsMatrix[role];

  return {
    role,
    capabilities: Object.entries(capabilities).reduce(
      (acc, [capability, level]) => {
        acc[capability as Capability] = {
          level,
          hasAccess: level !== "NONE",
          hasFullAccess: level === "FULL",
        };
        return acc;
      },
      {} as Record<
        Capability,
        { level: string; hasAccess: boolean; hasFullAccess: boolean }
      >
    ),
  };
}

/**
 * Get readable role description
 */
export function getRoleDescription(role: Role): string {
  const descriptions: Record<Role, string> = {
    SUPER_ADMIN: "System Administrator - Full system access",
    DISTRICT_ADMIN: "District Administrator - Multi-school analytics and management",
    DATA_STEWARD: "Data Steward - Privacy, compliance, and data governance",
    TECH_ADMIN: "Technical Administrator - Integrations and system configuration",
    SCHOOL_ADMIN: "School Administrator - School-wide access and management",
    DEPT_CHAIR: "Department Chair - Department analytics and collaboration",
    TEACHER: "Teacher - Own classes, students, and assessments",
    STUDENT: "Student - View own academic data",
    PARENT: "Parent - Limited view of child's academic data",
  };

  return descriptions[role];
}

/**
 * Get capability description
 */
export function getCapabilityDescription(capability: Capability): string {
  const descriptions: Record<Capability, string> = {
    MULTI_SITE_ANALYTICS: "Access analytics across multiple schools/sites",
    SCHOOL_WIDE_DATA: "Access all data within a school",
    DEPARTMENT_DATA: "Access department-level aggregated data",
    CLASS_LEVEL_DATA: "Access class-level data and analytics",
    INDIVIDUAL_STUDENT_DATA: "Access individual student records and details",
    CREATE_ASSESSMENTS: "Create and manage assessments",
    VIEW_PREDICTIONS: "View predictive analytics and ML models",
    SYSTEM_CONFIGURATION: "Modify system settings and configuration",
    MANAGE_USERS: "Create, update, and delete user accounts",
    MANAGE_INTEGRATIONS: "Configure external system integrations",
    PRIVACY_COMPLIANCE: "Access privacy and compliance management tools",
  };

  return descriptions[capability];
}

// =============================================================================
// Scope Validation Helpers
// =============================================================================

/**
 * Validate that a user can perform an operation on a resource
 */
export function canPerformOperation(
  user: AuthenticatedUser,
  operation: "create" | "read" | "update" | "delete",
  resourceType: "student" | "classroom" | "enrollment" | "user"
): boolean {
  // SUPER_ADMIN can do anything
  if (user.role === "SUPER_ADMIN") return true;

  // Define operation permissions by resource type
  const operationPermissions: Record<
    string,
    Record<string, Capability | null>
  > = {
    student: {
      create: "INDIVIDUAL_STUDENT_DATA",
      read: "INDIVIDUAL_STUDENT_DATA",
      update: "INDIVIDUAL_STUDENT_DATA",
      delete: "INDIVIDUAL_STUDENT_DATA",
    },
    classroom: {
      create: "CLASS_LEVEL_DATA",
      read: "CLASS_LEVEL_DATA",
      update: "CLASS_LEVEL_DATA",
      delete: "CLASS_LEVEL_DATA",
    },
    enrollment: {
      create: "CLASS_LEVEL_DATA",
      read: "CLASS_LEVEL_DATA",
      update: "CLASS_LEVEL_DATA",
      delete: "CLASS_LEVEL_DATA",
    },
    user: {
      create: "MANAGE_USERS",
      read: "MANAGE_USERS",
      update: "MANAGE_USERS",
      delete: "MANAGE_USERS",
    },
  };

  const requiredCapability = operationPermissions[resourceType]?.[operation];
  if (!requiredCapability) return false;

  const accessLevel = getAccessLevel(user.role, requiredCapability);

  // For write operations (create, update, delete), require FULL access
  if (["create", "update", "delete"].includes(operation)) {
    return accessLevel === "FULL";
  }

  // For read operations, any access level is sufficient
  return accessLevel !== "NONE";
}

/**
 * Check if user is in the same organizational hierarchy as a resource
 */
export function isInSameHierarchy(
  user: AuthenticatedUser,
  resource: {
    districtId?: string;
    schoolId?: string;
    departmentId?: string;
  }
): boolean {
  // Check district match
  if (resource.districtId && user.districtId !== resource.districtId) {
    return false;
  }

  // Check school match
  if (resource.schoolId && user.schoolId !== resource.schoolId) {
    return false;
  }

  // Check department match
  if (resource.departmentId && user.departmentId !== resource.departmentId) {
    return false;
  }

  return true;
}
