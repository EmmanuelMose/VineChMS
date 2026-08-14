"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const organizations_controller_1 = require("./organizations.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const organizationsRouter = (0, express_1.Router)();
// Large Organization routes
organizationsRouter.post("/large", auth_middleware_1.authenticate, organizations_controller_1.createLargeOrganization);
organizationsRouter.get("/large", auth_middleware_1.authenticate, organizations_controller_1.getLargeOrganizations);
organizationsRouter.get("/large/:id", auth_middleware_1.authenticate, organizations_controller_1.getLargeOrganizationById);
organizationsRouter.put("/large/:id", auth_middleware_1.authenticate, organizations_controller_1.updateLargeOrganization);
organizationsRouter.delete("/large/:id", auth_middleware_1.authenticate, organizations_controller_1.deleteLargeOrganization);
// Small Organization routes
organizationsRouter.post("/", auth_middleware_1.authenticate, organizations_controller_1.createOrganization);
organizationsRouter.get("/", auth_middleware_1.authenticate, organizations_controller_1.getOrganizations);
organizationsRouter.get("/:id", auth_middleware_1.authenticate, organizations_controller_1.getOrganizationById);
organizationsRouter.put("/:id", auth_middleware_1.authenticate, organizations_controller_1.updateOrganization);
organizationsRouter.delete("/:id", auth_middleware_1.authenticate, organizations_controller_1.deleteOrganization);
exports.default = organizationsRouter;
