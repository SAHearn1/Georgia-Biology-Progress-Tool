/**
 * Role Hierarchy and Permissions System
 *
 * This module implements the comprehensive role-based access control (RBAC)
 * system for the Georgia Biology Progress Tool.
 */

// =============================================================================
// Role Definitions
// =============================================================================

export type Role =
  | "SUPER_ADMIN"
  | "DISTRICT_ADMIN"
  | "DATA_STEWARD"
  | "TECH_ADMIN"
  | "SCHOOL_ADMIN"
  | "DEPT_CHAIR"
  | "TEACHER"
  | "STUDENT"
  | "PARENT";

// =============================================================================
// Capability Definitions
// =============================================================================

export type Capability =
  // Analytics and data access
  | "MULTI_SITE_ANALYTICS"
  | "SCHOOL_WIDE_DATA"
  | "DEPARTMENT_DATA"
  | "CLASS_LEVEL_DATA"
  | "INDIVIDUAL_STUDENT_DATA"
  // Educational operations
  | "CREATE_ASSESSMENTS"
  | "VIEW_PREDICTIONS"
  // System administration
  | "SYSTEM_CONFIGURATION"
  | "MANAGE_USERS"
  | "MANAGE_INTEGRATIONS"
  | "PRIVACY_COMPLIANCE";

export type AccessLevel = "FULL" | "LIMITED" | "NONE";

// =============================================================================
// Role Hierarchy
// =============================================================================

/**
 * Role hierarchy levels (higher number = more privileges)
 * Used for hierarchical permission checking
 */
export const roleHierarchy: Record<Role, number> = {
  SUPER_ADMIN: 9,      // Top level: system-wide access
  DISTRICT_ADMIN: 8,   // Multi-school access
  DATA_STEWARD: 7,     // Privacy and compliance
  TECH_ADMIN: 7,       // Technical administration (same level as DATA_STEWARD)
  SCHOOL_ADMIN: 6,     // School-wide access
  DEPT_CHAIR: 5,       // Department-level access
  TEACHER: 4,          // Class and student access
  STUDENT: 2,          // Own data only
  PARENT: 1,           // Limited child data access
};

/**
 * Role parent relationships (organizational hierarchy)
 * Defines which roles report to which
 */
export const roleParents: Record<Role, Role | null> = {
  SUPER_ADMIN: null,                    // Top of hierarchy
  DISTRICT_ADMIN: "SUPER_ADMIN",
  DATA_STEWARD: "SUPER_ADMIN",
  TECH_ADMIN: "SUPER_ADMIN",
  SCHOOL_ADMIN: "DISTRICT_ADMIN",
  DEPT_CHAIR: "SCHOOL_ADMIN",
  TEACHER: "DEPT_CHAIR",
  STUDENT: null,                        // Not part of admin hierarchy
  PARENT: null,                         // Not part of admin hierarchy
};

// =============================================================================
// Permissions Matrix
// =============================================================================

/**
 * Comprehensive permissions matrix matching the diagram provided
 * Maps each role to their capabilities and access levels
 */
export const permissionsMatrix: Record<Role, Record<Capability, AccessLevel>> = {
  SUPER_ADMIN: {
    MULTI_SITE_ANALYTICS: "FULL",
    SCHOOL_WIDE_DATA: "FULL",
    DEPARTMENT_DATA: "FULL",
    CLASS_LEVEL_DATA: "FULL",
    INDIVIDUAL_STUDENT_DATA: "FULL",
    CREATE_ASSESSMENTS: "FULL",
    VIEW_PREDICTIONS: "FULL",
    SYSTEM_CONFIGURATION: "FULL",
    MANAGE_USERS: "FULL",
    MANAGE_INTEGRATIONS: "FULL",
    PRIVACY_COMPLIANCE: "FULL",
  },

  DISTRICT_ADMIN: {
    MULTI_SITE_ANALYTICS: "FULL",       // Can see across schools
    SCHOOL_WIDE_DATA: "FULL",
    DEPARTMENT_DATA: "FULL",
    CLASS_LEVEL_DATA: "FULL",
    INDIVIDUAL_STUDENT_DATA: "FULL",
    CREATE_ASSESSMENTS: "FULL",
    VIEW_PREDICTIONS: "FULL",
    SYSTEM_CONFIGURATION: "LIMITED",    // Limited to district settings
    MANAGE_USERS: "LIMITED",            // Can manage users in their district
    MANAGE_INTEGRATIONS: "NONE",
    PRIVACY_COMPLIANCE: "LIMITED",
  },

  DATA_STEWARD: {
    MULTI_SITE_ANALYTICS: "FULL",
    SCHOOL_WIDE_DATA: "FULL",
    DEPARTMENT_DATA: "FULL",
    CLASS_LEVEL_DATA: "FULL",
    INDIVIDUAL_STUDENT_DATA: "FULL",    // Full access for compliance
    CREATE_ASSESSMENTS: "NONE",
    VIEW_PREDICTIONS: "FULL",
    SYSTEM_CONFIGURATION: "NONE",
    MANAGE_USERS: "NONE",
    MANAGE_INTEGRATIONS: "NONE",
    PRIVACY_COMPLIANCE: "FULL",         // Primary responsibility
  },

  TECH_ADMIN: {
    MULTI_SITE_ANALYTICS: "LIMITED",
    SCHOOL_WIDE_DATA: "LIMITED",
    DEPARTMENT_DATA: "LIMITED",
    CLASS_LEVEL_DATA: "LIMITED",
    INDIVIDUAL_STUDENT_DATA: "NONE",    // No student data access
    CREATE_ASSESSMENTS: "NONE",
    VIEW_PREDICTIONS: "NONE",
    SYSTEM_CONFIGURATION: "FULL",       // Primary responsibility
    MANAGE_USERS: "LIMITED",            // Can manage technical accounts
    MANAGE_INTEGRATIONS: "FULL",        // Primary responsibility
    PRIVACY_COMPLIANCE: "NONE",
  },

  SCHOOL_ADMIN: {
    MULTI_SITE_ANALYTICS: "NONE",       // Only their school
    SCHOOL_WIDE_DATA: "FULL",
    DEPARTMENT_DATA: "FULL",
    CLASS_LEVEL_DATA: "FULL",
    INDIVIDUAL_STUDENT_DATA: "FULL",
    CREATE_ASSESSMENTS: "FULL",
    VIEW_PREDICTIONS: "FULL",
    SYSTEM_CONFIGURATION: "LIMITED",    // School-level settings only
    MANAGE_USERS: "LIMITED",            // Can manage users in their school
    MANAGE_INTEGRATIONS: "NONE",
    PRIVACY_COMPLIANCE: "LIMITED",
  },

  DEPT_CHAIR: {
    MULTI_SITE_ANALYTICS: "NONE",
    SCHOOL_WIDE_DATA: "LIMITED",        // Can see school context
    DEPARTMENT_DATA: "FULL",            // Primary responsibility
    CLASS_LEVEL_DATA: "FULL",
    INDIVIDUAL_STUDENT_DATA: "FULL",
    CREATE_ASSESSMENTS: "FULL",
    VIEW_PREDICTIONS: "FULL",
    SYSTEM_CONFIGURATION: "NONE",
    MANAGE_USERS: "NONE",
    MANAGE_INTEGRATIONS: "NONE",
    PRIVACY_COMPLIANCE: "NONE",
  },

  TEACHER: {
    MULTI_SITE_ANALYTICS: "NONE",
    SCHOOL_WIDE_DATA: "NONE",
    DEPARTMENT_DATA: "LIMITED",         // Can see dept context
    CLASS_LEVEL_DATA: "FULL",           // Own classes only
    INDIVIDUAL_STUDENT_DATA: "FULL",    // Own students only
    CREATE_ASSESSMENTS: "FULL",         // For own classes
    VIEW_PREDICTIONS: "FULL",           // For own students
    SYSTEM_CONFIGURATION: "NONE",
    MANAGE_USERS: "NONE",
    MANAGE_INTEGRATIONS: "NONE",
    PRIVACY_COMPLIANCE: "NONE",
  },

  STUDENT: {
    MULTI_SITE_ANALYTICS: "NONE",
    SCHOOL_WIDE_DATA: "NONE",
    DEPARTMENT_DATA: "NONE",
    CLASS_LEVEL_DATA: "NONE",
    INDIVIDUAL_STUDENT_DATA: "LIMITED", // Own data only
    CREATE_ASSESSMENTS: "NONE",
    VIEW_PREDICTIONS: "NONE",
    SYSTEM_CONFIGURATION: "NONE",
    MANAGE_USERS: "NONE",
    MANAGE_INTEGRATIONS: "NONE",
    PRIVACY_COMPLIANCE: "NONE",
  },

  PARENT: {
    MULTI_SITE_ANALYTICS: "NONE",
    SCHOOL_WIDE_DATA: "NONE",
    DEPARTMENT_DATA: "NONE",
    CLASS_LEVEL_DATA: "NONE",
    INDIVIDUAL_STUDENT_DATA: "LIMITED", // Child's data only
    CREATE_ASSESSMENTS: "NONE",
    VIEW_PREDICTIONS: "NONE",
    SYSTEM_CONFIGURATION: "NONE",
    MANAGE_USERS: "NONE",
    MANAGE_INTEGRATIONS: "NONE",
    PRIVACY_COMPLIANCE: "NONE",
  },
};

// =============================================================================
// Permission Checking Functions
// =============================================================================

/**
 * Check if a user role has at least the privileges of the required role
 * Uses hierarchical level comparison
 */
export function canAccess(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Check if a role has a specific capability at any level
 */
export function hasCapability(role: Role, capability: Capability): boolean {
  const accessLevel = permissionsMatrix[role][capability];
  return accessLevel !== "NONE";
}

/**
 * Check if a role has FULL access to a capability
 */
export function hasFullCapability(role: Role, capability: Capability): boolean {
  return permissionsMatrix[role][capability] === "FULL";
}

/**
 * Get the access level for a role and capability
 */
export function getAccessLevel(role: Role, capability: Capability): AccessLevel {
  return permissionsMatrix[role][capability];
}

/**
 * Check if a role can access a specific resource scope
 * @param role - User's role
 * @param scope - Resource scope (district/school/department/class/student)
 * @param resourceContext - Context of the resource being accessed
 * @param userContext - Context of the user (their district/school/department)
 */
export function canAccessResource(
  role: Role,
  scope: "district" | "school" | "department" | "class" | "student",
  resourceContext: {
    districtId?: string;
    schoolId?: string;
    departmentId?: string;
    classId?: string;
    studentId?: string;
  },
  userContext: {
    districtId?: string;
    schoolId?: string;
    departmentId?: string;
    classIds?: string[];
    studentIds?: string[];
  }
): boolean {
  // SUPER_ADMIN can access everything
  if (role === "SUPER_ADMIN") return true;

  switch (scope) {
    case "district":
      if (role === "DISTRICT_ADMIN") {
        return resourceContext.districtId === userContext.districtId;
      }
      return false;

    case "school":
      if (role === "DISTRICT_ADMIN") {
        return resourceContext.districtId === userContext.districtId;
      }
      if (role === "SCHOOL_ADMIN" || role === "DATA_STEWARD") {
        return resourceContext.schoolId === userContext.schoolId;
      }
      return false;

    case "department":
      if (role === "DISTRICT_ADMIN") {
        return resourceContext.districtId === userContext.districtId;
      }
      if (role === "SCHOOL_ADMIN") {
        return resourceContext.schoolId === userContext.schoolId;
      }
      if (role === "DEPT_CHAIR") {
        return resourceContext.departmentId === userContext.departmentId;
      }
      return false;

    case "class":
      if (role === "DISTRICT_ADMIN") {
        return resourceContext.districtId === userContext.districtId;
      }
      if (role === "SCHOOL_ADMIN") {
        return resourceContext.schoolId === userContext.schoolId;
      }
      if (role === "DEPT_CHAIR") {
        return resourceContext.departmentId === userContext.departmentId;
      }
      if (role === "TEACHER") {
        return userContext.classIds?.includes(resourceContext.classId || "");
      }
      return false;

    case "student":
      if (role === "DISTRICT_ADMIN") {
        return resourceContext.districtId === userContext.districtId;
      }
      if (role === "SCHOOL_ADMIN") {
        return resourceContext.schoolId === userContext.schoolId;
      }
      if (role === "DEPT_CHAIR") {
        return resourceContext.departmentId === userContext.departmentId;
      }
      if (role === "TEACHER") {
        return userContext.studentIds?.includes(resourceContext.studentId || "");
      }
      if (role === "STUDENT") {
        return resourceContext.studentId === userContext.studentIds?.[0];
      }
      if (role === "PARENT") {
        return userContext.studentIds?.includes(resourceContext.studentId || "");
      }
      return false;

    default:
      return false;
  }
}

/**
 * Get all capabilities for a role
 */
export function getRoleCapabilities(role: Role): Record<Capability, AccessLevel> {
  return permissionsMatrix[role];
}

/**
 * Check if role A can manage role B
 * Based on hierarchical levels
 */
export function canManageRole(managerRole: Role, targetRole: Role): boolean {
  // Can only manage roles lower in hierarchy
  return roleHierarchy[managerRole] > roleHierarchy[targetRole];
}
