import { Router } from "express";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDepartmentsByLargeOrganization,
  getDepartmentsByOrganization,
  getDepartmentsByChurch,
  getSubDepartments,
  addMemberToDepartment,
  getDepartmentMembers,
  updateDepartmentMember,
  removeMemberFromDepartment,
} from "./departments.controller";
import { authenticate } from "../middleware/auth.middleware";

const departmentsRouter = Router();

departmentsRouter.post("/", authenticate, createDepartment);
departmentsRouter.get("/", authenticate, getDepartments);
departmentsRouter.get("/:id", authenticate, getDepartmentById);
departmentsRouter.put("/:id", authenticate, updateDepartment);
departmentsRouter.delete("/:id", authenticate, deleteDepartment);

departmentsRouter.get("/large-org/:largeOrganizationId", authenticate, getDepartmentsByLargeOrganization);
departmentsRouter.get("/organization/:organizationId", authenticate, getDepartmentsByOrganization);
departmentsRouter.get("/church/:churchId", authenticate, getDepartmentsByChurch);
departmentsRouter.get("/sub/:parentId", authenticate, getSubDepartments);

departmentsRouter.post("/member", authenticate, addMemberToDepartment);
departmentsRouter.get("/:departmentId/members", authenticate, getDepartmentMembers);
departmentsRouter.put("/member/:id", authenticate, updateDepartmentMember);
departmentsRouter.delete("/member/:id", authenticate, removeMemberFromDepartment);

export default departmentsRouter;