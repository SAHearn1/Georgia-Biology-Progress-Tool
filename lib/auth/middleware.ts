/**
 * Authorization Middleware
 *
 * Provides middleware functions for protecting routes and API endpoints
 * based on role hierarchy and capability requirements.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import {
  Role,
  Capability,
  canAccess,
  hasCapability,
  hasFullCapability,
  canAccessResource,
  getAccessLevel,
} from "./roles";

// =============================================================================
// Types
// =============================================================================

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  name?: string;
  districtId?: string;
  schoolId?: string;
  departmentId?: string;
}

export interface AuthorizationContext {
  user: AuthenticatedUser;
  classIds?: string[];
  studentIds?: string[];
}

// =============================================================================
// Session Helpers
// =============================================================================

/**
 * Get the current authenticated user from the session
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const session = await getServerSession();

  if (!session || !session.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role as Role,
    name: session.user.name,
    // These would be added to the session via NextAuth callbacks
    districtId: (session.user as any).districtId,
    schoolId: (session.user as any).schoolId,
    departmentId: (session.user as any).departmentId,
  };
}

/**
 * Require an authenticated user, throw if not authenticated
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError("Authentication required");
  }

  return user;
}

// =============================================================================
// Authorization Guards
// =============================================================================

/**
 * Require a minimum role level
 * @throws UnauthorizedError if user doesn't have required role level
 */
export async function requireRole(requiredRole: Role): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (!canAccess(user.role, requiredRole)) {
    throw new ForbiddenError(
      `Access denied. Required role: ${requiredRole}, User role: ${user.role}`
    );
  }

  return user;
}

/**
 * Require a specific capability
 * @throws UnauthorizedError if user doesn't have the capability
 */
export async function requireCapability(
  capability: Capability,
  requireFull: boolean = false
): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  const hasPermission = requireFull
    ? hasFullCapability(user.role, capability)
    : hasCapability(user.role, capability);

  if (!hasPermission) {
    throw new ForbiddenError(
      `Access denied. Required capability: ${capability} (${requireFull ? "FULL" : "any level"})`
    );
  }

  return user;
}

/**
 * Require one of multiple capabilities (OR logic)
 */
export async function requireAnyCapability(
  capabilities: Capability[]
): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  const hasAnyCapability = capabilities.some((cap) => hasCapability(user.role, cap));

  if (!hasAnyCapability) {
    throw new ForbiddenError(
      `Access denied. Required one of: ${capabilities.join(", ")}`
    );
  }

  return user;
}

/**
 * Require all of multiple capabilities (AND logic)
 */
export async function requireAllCapabilities(
  capabilities: Capability[]
): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  const missingCapabilities = capabilities.filter(
    (cap) => !hasCapability(user.role, cap)
  );

  if (missingCapabilities.length > 0) {
    throw new ForbiddenError(
      `Access denied. Missing capabilities: ${missingCapabilities.join(", ")}`
    );
  }

  return user;
}

/**
 * Check resource access for a specific scope
 * @throws ForbiddenError if user cannot access the resource
 */
export async function requireResourceAccess(
  scope: "district" | "school" | "department" | "class" | "student",
  resourceContext: {
    districtId?: string;
    schoolId?: string;
    departmentId?: string;
    classId?: string;
    studentId?: string;
  },
  userClassIds?: string[],
  userStudentIds?: string[]
): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  const userContext = {
    districtId: user.districtId,
    schoolId: user.schoolId,
    departmentId: user.departmentId,
    classIds: userClassIds,
    studentIds: userStudentIds,
  };

  const hasAccess = canAccessResource(user.role, scope, resourceContext, userContext);

  if (!hasAccess) {
    throw new ForbiddenError(
      `Access denied to ${scope} resource`
    );
  }

  return user;
}

// =============================================================================
// Error Classes
// =============================================================================

export class UnauthorizedError extends Error {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

// =============================================================================
// API Route Helpers
// =============================================================================

/**
 * Wrap an API route handler with authentication/authorization checks
 */
export function withAuth<T = any>(
  handler: (req: Request, context: AuthorizationContext) => Promise<Response>,
  options?: {
    requiredRole?: Role;
    requiredCapability?: Capability;
    requireFullCapability?: boolean;
  }
) {
  return async (req: Request): Promise<Response> => {
    try {
      let user: AuthenticatedUser;

      if (options?.requiredRole) {
        user = await requireRole(options.requiredRole);
      } else if (options?.requiredCapability) {
        user = await requireCapability(
          options.requiredCapability,
          options.requireFullCapability
        );
      } else {
        user = await requireAuth();
      }

      const context: AuthorizationContext = {
        user,
        // These could be populated from database queries
        classIds: [],
        studentIds: [],
      };

      return await handler(req, context);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }

      if (error instanceof ForbiddenError) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }

      // Re-throw other errors
      throw error;
    }
  };
}

/**
 * Create a role-based route guard for Next.js middleware
 */
export function createRoleGuard(allowedRoles: Role[]) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return null; // Allow the request to proceed
  };
}

/**
 * Create a capability-based route guard
 */
export function createCapabilityGuard(
  requiredCapabilities: Capability[],
  requireAll: boolean = true
) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const hasPermission = requireAll
      ? requiredCapabilities.every((cap) => hasCapability(user.role, cap))
      : requiredCapabilities.some((cap) => hasCapability(user.role, cap));

    if (!hasPermission) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    return null; // Allow the request to proceed
  };
}
