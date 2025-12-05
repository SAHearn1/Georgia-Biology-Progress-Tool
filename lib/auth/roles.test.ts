/**
 * Unit tests for Role Hierarchy and Permissions System
 */

import { describe, it, expect } from "@jest/globals";
import {
  Role,
  Capability,
  roleHierarchy,
  permissionsMatrix,
  canAccess,
  hasCapability,
  hasFullCapability,
  getAccessLevel,
  canAccessResource,
  canManageRole,
  getRoleCapabilities,
} from "./roles";

describe("Role Hierarchy", () => {
  it("should have correct hierarchy levels", () => {
    expect(roleHierarchy.SUPER_ADMIN).toBe(9);
    expect(roleHierarchy.DISTRICT_ADMIN).toBe(8);
    expect(roleHierarchy.DATA_STEWARD).toBe(7);
    expect(roleHierarchy.TECH_ADMIN).toBe(7);
    expect(roleHierarchy.SCHOOL_ADMIN).toBe(6);
    expect(roleHierarchy.DEPT_CHAIR).toBe(5);
    expect(roleHierarchy.TEACHER).toBe(4);
    expect(roleHierarchy.STUDENT).toBe(2);
    expect(roleHierarchy.PARENT).toBe(1);
  });

  it("should allow SUPER_ADMIN to access all roles", () => {
    const roles: Role[] = [
      "DISTRICT_ADMIN",
      "SCHOOL_ADMIN",
      "DEPT_CHAIR",
      "TEACHER",
      "STUDENT",
      "PARENT",
    ];

    roles.forEach((role) => {
      expect(canAccess("SUPER_ADMIN", role)).toBe(true);
    });
  });

  it("should allow higher roles to access lower roles", () => {
    expect(canAccess("DISTRICT_ADMIN", "SCHOOL_ADMIN")).toBe(true);
    expect(canAccess("DISTRICT_ADMIN", "TEACHER")).toBe(true);
    expect(canAccess("SCHOOL_ADMIN", "DEPT_CHAIR")).toBe(true);
    expect(canAccess("SCHOOL_ADMIN", "TEACHER")).toBe(true);
    expect(canAccess("DEPT_CHAIR", "TEACHER")).toBe(true);
  });

  it("should not allow lower roles to access higher roles", () => {
    expect(canAccess("TEACHER", "DEPT_CHAIR")).toBe(false);
    expect(canAccess("TEACHER", "SCHOOL_ADMIN")).toBe(false);
    expect(canAccess("DEPT_CHAIR", "SCHOOL_ADMIN")).toBe(false);
    expect(canAccess("SCHOOL_ADMIN", "DISTRICT_ADMIN")).toBe(false);
    expect(canAccess("STUDENT", "TEACHER")).toBe(false);
    expect(canAccess("PARENT", "TEACHER")).toBe(false);
  });

  it("should allow same role to access itself", () => {
    expect(canAccess("TEACHER", "TEACHER")).toBe(true);
    expect(canAccess("SCHOOL_ADMIN", "SCHOOL_ADMIN")).toBe(true);
  });
});

describe("Permissions Matrix - Multi-Site Analytics", () => {
  it("DISTRICT_ADMIN should have FULL multi-site analytics", () => {
    expect(permissionsMatrix.DISTRICT_ADMIN.MULTI_SITE_ANALYTICS).toBe("FULL");
  });

  it("SCHOOL_ADMIN should have NONE multi-site analytics", () => {
    expect(permissionsMatrix.SCHOOL_ADMIN.MULTI_SITE_ANALYTICS).toBe("NONE");
  });

  it("TEACHER should have NONE multi-site analytics", () => {
    expect(permissionsMatrix.TEACHER.MULTI_SITE_ANALYTICS).toBe("NONE");
  });
});

describe("Permissions Matrix - School-Wide Data", () => {
  it("DISTRICT_ADMIN should have FULL school-wide data access", () => {
    expect(permissionsMatrix.DISTRICT_ADMIN.SCHOOL_WIDE_DATA).toBe("FULL");
  });

  it("SCHOOL_ADMIN should have FULL school-wide data access", () => {
    expect(permissionsMatrix.SCHOOL_ADMIN.SCHOOL_WIDE_DATA).toBe("FULL");
  });

  it("DEPT_CHAIR should have LIMITED school-wide data access", () => {
    expect(permissionsMatrix.DEPT_CHAIR.SCHOOL_WIDE_DATA).toBe("LIMITED");
  });

  it("TEACHER should have NONE school-wide data access", () => {
    expect(permissionsMatrix.TEACHER.SCHOOL_WIDE_DATA).toBe("NONE");
  });
});

describe("Permissions Matrix - Department Data", () => {
  it("SCHOOL_ADMIN should have FULL department data access", () => {
    expect(permissionsMatrix.SCHOOL_ADMIN.DEPARTMENT_DATA).toBe("FULL");
  });

  it("DEPT_CHAIR should have FULL department data access", () => {
    expect(permissionsMatrix.DEPT_CHAIR.DEPARTMENT_DATA).toBe("FULL");
  });

  it("TEACHER should have LIMITED department data access", () => {
    expect(permissionsMatrix.TEACHER.DEPARTMENT_DATA).toBe("LIMITED");
  });

  it("STUDENT should have NONE department data access", () => {
    expect(permissionsMatrix.STUDENT.DEPARTMENT_DATA).toBe("NONE");
  });
});

describe("Permissions Matrix - Class-Level Data", () => {
  it("DEPT_CHAIR should have FULL class-level data access", () => {
    expect(permissionsMatrix.DEPT_CHAIR.CLASS_LEVEL_DATA).toBe("FULL");
  });

  it("TEACHER should have FULL class-level data access", () => {
    expect(permissionsMatrix.TEACHER.CLASS_LEVEL_DATA).toBe("FULL");
  });

  it("STUDENT should have NONE class-level data access", () => {
    expect(permissionsMatrix.STUDENT.CLASS_LEVEL_DATA).toBe("NONE");
  });
});

describe("Permissions Matrix - Individual Student Data", () => {
  it("TEACHER should have FULL individual student data access", () => {
    expect(permissionsMatrix.TEACHER.INDIVIDUAL_STUDENT_DATA).toBe("FULL");
  });

  it("STUDENT should have LIMITED individual student data access", () => {
    expect(permissionsMatrix.STUDENT.INDIVIDUAL_STUDENT_DATA).toBe("LIMITED");
  });

  it("PARENT should have LIMITED individual student data access", () => {
    expect(permissionsMatrix.PARENT.INDIVIDUAL_STUDENT_DATA).toBe("LIMITED");
  });
});

describe("Permissions Matrix - Create Assessments", () => {
  it("TEACHER should be able to create assessments", () => {
    expect(permissionsMatrix.TEACHER.CREATE_ASSESSMENTS).toBe("FULL");
  });

  it("DEPT_CHAIR should be able to create assessments", () => {
    expect(permissionsMatrix.DEPT_CHAIR.CREATE_ASSESSMENTS).toBe("FULL");
  });

  it("STUDENT should NOT be able to create assessments", () => {
    expect(permissionsMatrix.STUDENT.CREATE_ASSESSMENTS).toBe("NONE");
  });

  it("PARENT should NOT be able to create assessments", () => {
    expect(permissionsMatrix.PARENT.CREATE_ASSESSMENTS).toBe("NONE");
  });
});

describe("Permissions Matrix - System Configuration", () => {
  it("SUPER_ADMIN should have FULL system configuration", () => {
    expect(permissionsMatrix.SUPER_ADMIN.SYSTEM_CONFIGURATION).toBe("FULL");
  });

  it("TECH_ADMIN should have FULL system configuration", () => {
    expect(permissionsMatrix.TECH_ADMIN.SYSTEM_CONFIGURATION).toBe("FULL");
  });

  it("DISTRICT_ADMIN should have LIMITED system configuration", () => {
    expect(permissionsMatrix.DISTRICT_ADMIN.SYSTEM_CONFIGURATION).toBe("LIMITED");
  });

  it("TEACHER should have NONE system configuration", () => {
    expect(permissionsMatrix.TEACHER.SYSTEM_CONFIGURATION).toBe("NONE");
  });
});

describe("Capability Functions", () => {
  describe("hasCapability", () => {
    it("should return true for FULL access", () => {
      expect(hasCapability("TEACHER", "CLASS_LEVEL_DATA")).toBe(true);
    });

    it("should return true for LIMITED access", () => {
      expect(hasCapability("STUDENT", "INDIVIDUAL_STUDENT_DATA")).toBe(true);
    });

    it("should return false for NONE access", () => {
      expect(hasCapability("TEACHER", "SYSTEM_CONFIGURATION")).toBe(false);
    });
  });

  describe("hasFullCapability", () => {
    it("should return true only for FULL access", () => {
      expect(hasFullCapability("TEACHER", "CLASS_LEVEL_DATA")).toBe(true);
      expect(hasFullCapability("STUDENT", "INDIVIDUAL_STUDENT_DATA")).toBe(false);
      expect(hasFullCapability("TEACHER", "SYSTEM_CONFIGURATION")).toBe(false);
    });
  });

  describe("getAccessLevel", () => {
    it("should return correct access levels", () => {
      expect(getAccessLevel("TEACHER", "CLASS_LEVEL_DATA")).toBe("FULL");
      expect(getAccessLevel("STUDENT", "INDIVIDUAL_STUDENT_DATA")).toBe("LIMITED");
      expect(getAccessLevel("TEACHER", "SYSTEM_CONFIGURATION")).toBe("NONE");
    });
  });
});

describe("Resource Access Control", () => {
  describe("District-level access", () => {
    it("SUPER_ADMIN can access any district", () => {
      expect(
        canAccessResource(
          "SUPER_ADMIN",
          "district",
          { districtId: "district-1" },
          {}
        )
      ).toBe(true);
    });

    it("DISTRICT_ADMIN can access their own district", () => {
      expect(
        canAccessResource(
          "DISTRICT_ADMIN",
          "district",
          { districtId: "district-1" },
          { districtId: "district-1" }
        )
      ).toBe(true);
    });

    it("DISTRICT_ADMIN cannot access other districts", () => {
      expect(
        canAccessResource(
          "DISTRICT_ADMIN",
          "district",
          { districtId: "district-2" },
          { districtId: "district-1" }
        )
      ).toBe(false);
    });

    it("TEACHER cannot access district level", () => {
      expect(
        canAccessResource(
          "TEACHER",
          "district",
          { districtId: "district-1" },
          { districtId: "district-1" }
        )
      ).toBe(false);
    });
  });

  describe("School-level access", () => {
    it("SCHOOL_ADMIN can access their own school", () => {
      expect(
        canAccessResource(
          "SCHOOL_ADMIN",
          "school",
          { schoolId: "school-1" },
          { schoolId: "school-1" }
        )
      ).toBe(true);
    });

    it("DISTRICT_ADMIN can access schools in their district", () => {
      expect(
        canAccessResource(
          "DISTRICT_ADMIN",
          "school",
          { districtId: "district-1", schoolId: "school-1" },
          { districtId: "district-1" }
        )
      ).toBe(true);
    });

    it("TEACHER cannot access school level", () => {
      expect(
        canAccessResource(
          "TEACHER",
          "school",
          { schoolId: "school-1" },
          { schoolId: "school-1" }
        )
      ).toBe(false);
    });
  });

  describe("Class-level access", () => {
    it("TEACHER can access their own classes", () => {
      expect(
        canAccessResource(
          "TEACHER",
          "class",
          { classId: "class-1" },
          { classIds: ["class-1", "class-2"] }
        )
      ).toBe(true);
    });

    it("TEACHER cannot access other classes", () => {
      expect(
        canAccessResource(
          "TEACHER",
          "class",
          { classId: "class-3" },
          { classIds: ["class-1", "class-2"] }
        )
      ).toBe(false);
    });

    it("DEPT_CHAIR can access classes in their department", () => {
      expect(
        canAccessResource(
          "DEPT_CHAIR",
          "class",
          { departmentId: "dept-1", classId: "class-1" },
          { departmentId: "dept-1" }
        )
      ).toBe(true);
    });
  });

  describe("Student-level access", () => {
    it("TEACHER can access their own students", () => {
      expect(
        canAccessResource(
          "TEACHER",
          "student",
          { studentId: "student-1" },
          { studentIds: ["student-1", "student-2"] }
        )
      ).toBe(true);
    });

    it("STUDENT can access their own data", () => {
      expect(
        canAccessResource(
          "STUDENT",
          "student",
          { studentId: "student-1" },
          { studentIds: ["student-1"] }
        )
      ).toBe(true);
    });

    it("STUDENT cannot access other students' data", () => {
      expect(
        canAccessResource(
          "STUDENT",
          "student",
          { studentId: "student-2" },
          { studentIds: ["student-1"] }
        )
      ).toBe(false);
    });

    it("PARENT can access their children's data", () => {
      expect(
        canAccessResource(
          "PARENT",
          "student",
          { studentId: "student-1" },
          { studentIds: ["student-1", "student-2"] }
        )
      ).toBe(true);
    });

    it("PARENT cannot access other students' data", () => {
      expect(
        canAccessResource(
          "PARENT",
          "student",
          { studentId: "student-3" },
          { studentIds: ["student-1", "student-2"] }
        )
      ).toBe(false);
    });
  });
});

describe("Role Management", () => {
  describe("canManageRole", () => {
    it("SUPER_ADMIN can manage all roles", () => {
      const roles: Role[] = [
        "DISTRICT_ADMIN",
        "SCHOOL_ADMIN",
        "TEACHER",
        "STUDENT",
        "PARENT",
      ];
      roles.forEach((role) => {
        expect(canManageRole("SUPER_ADMIN", role)).toBe(true);
      });
    });

    it("DISTRICT_ADMIN can manage lower roles", () => {
      expect(canManageRole("DISTRICT_ADMIN", "SCHOOL_ADMIN")).toBe(true);
      expect(canManageRole("DISTRICT_ADMIN", "TEACHER")).toBe(true);
      expect(canManageRole("DISTRICT_ADMIN", "STUDENT")).toBe(true);
    });

    it("DISTRICT_ADMIN cannot manage equal or higher roles", () => {
      expect(canManageRole("DISTRICT_ADMIN", "SUPER_ADMIN")).toBe(false);
      expect(canManageRole("DISTRICT_ADMIN", "DISTRICT_ADMIN")).toBe(false);
    });

    it("TEACHER cannot manage any roles", () => {
      expect(canManageRole("TEACHER", "STUDENT")).toBe(false);
      expect(canManageRole("TEACHER", "PARENT")).toBe(false);
    });
  });
});

describe("Role Capabilities", () => {
  it("should return all capabilities for a role", () => {
    const teacherCaps = getRoleCapabilities("TEACHER");

    expect(teacherCaps.CLASS_LEVEL_DATA).toBe("FULL");
    expect(teacherCaps.INDIVIDUAL_STUDENT_DATA).toBe("FULL");
    expect(teacherCaps.CREATE_ASSESSMENTS).toBe("FULL");
    expect(teacherCaps.SYSTEM_CONFIGURATION).toBe("NONE");
  });

  it("should have all capabilities defined for each role", () => {
    const roles: Role[] = [
      "SUPER_ADMIN",
      "DISTRICT_ADMIN",
      "DATA_STEWARD",
      "TECH_ADMIN",
      "SCHOOL_ADMIN",
      "DEPT_CHAIR",
      "TEACHER",
      "STUDENT",
      "PARENT",
    ];

    const capabilities: Capability[] = [
      "MULTI_SITE_ANALYTICS",
      "SCHOOL_WIDE_DATA",
      "DEPARTMENT_DATA",
      "CLASS_LEVEL_DATA",
      "INDIVIDUAL_STUDENT_DATA",
      "CREATE_ASSESSMENTS",
      "VIEW_PREDICTIONS",
      "SYSTEM_CONFIGURATION",
      "MANAGE_USERS",
      "MANAGE_INTEGRATIONS",
      "PRIVACY_COMPLIANCE",
    ];

    roles.forEach((role) => {
      const roleCaps = getRoleCapabilities(role);
      capabilities.forEach((cap) => {
        expect(roleCaps[cap]).toBeDefined();
        expect(["FULL", "LIMITED", "NONE"]).toContain(roleCaps[cap]);
      });
    });
  });
});
