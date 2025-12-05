/**
 * Authorization Module
 *
 * Comprehensive role-based access control (RBAC) system for the
 * Georgia Biology Progress Tool.
 *
 * @module lib/auth
 */

// Re-export everything from roles module
export {
  type Role,
  type Capability,
  type AccessLevel,
  roleHierarchy,
  roleParents,
  permissionsMatrix,
  canAccess,
  hasCapability,
  hasFullCapability,
  getAccessLevel,
  canAccessResource,
  getRoleCapabilities,
  canManageRole,
} from "./roles";

// Re-export everything from middleware module
export {
  type AuthenticatedUser,
  type AuthorizationContext,
  getCurrentUser,
  requireAuth,
  requireRole,
  requireCapability,
  requireAnyCapability,
  requireAllCapabilities,
  requireResourceAccess,
  UnauthorizedError,
  ForbiddenError,
  withAuth,
  createRoleGuard,
  createCapabilityGuard,
} from "./middleware";

// Re-export everything from helpers module
export {
  getUserDataFilter,
  getStudentAccessFilter,
  getClassroomAccessFilter,
  getUserCapabilitySummary,
  getRoleDescription,
  getCapabilityDescription,
  canPerformOperation,
  isInSameHierarchy,
} from "./helpers";
