"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendInvitationService = exports.acceptInvitationService = exports.deleteInvitationService = exports.updateInvitationService = exports.getInvitationsByLargeOrganizationService = exports.getInvitationsByOrganizationService = exports.getInvitationsByChurchService = exports.getInvitationsByEmailService = exports.getInvitationByTokenService = exports.getInvitationByIdService = exports.getInvitationsService = exports.createInvitationService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const mailer_1 = require("../mailer/mailer");
const generateToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
const createInvitationService = async (data) => {
    const pool = db_1.default.$client;
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const query = `
    INSERT INTO invitations (
      email,
      role,
      token,
      expires_at,
      status,
      invited_by,
      large_organization_id,
      organization_id,
      church_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9
    )
    RETURNING *
  `;
    const values = [
        data.email,
        data.role,
        token,
        expiresAt.toISOString(),
        'pending',
        data.invitedBy ? Number(data.invitedBy) : null,
        data.largeOrganizationId ? Number(data.largeOrganizationId) : null,
        data.organizationId ? Number(data.organizationId) : null,
        data.churchId ? Number(data.churchId) : null
    ];
    const result = await pool.query(query, values);
    // Send invitation email
    const invitationLink = `${process.env.FRONTEND_URL}/accept-invitation?token=${token}`;
    const emailHtml = `
    <h2>You've Been Invited to VineChMS!</h2>
    <p>Hello,</p>
    <p>You have been invited to join VineChMS as a <strong>${data.role}</strong>.</p>
    <p>Click the button below to accept your invitation:</p>
    <p style="text-align: center; margin-top: 20px;">
      <a href="${invitationLink}" style="display: inline-block; padding: 12px 24px; background: #1565C0; color: #fff; text-decoration: none; border-radius: 6px;">Accept Invitation</a>
    </p>
    <p>Or copy and paste this link in your browser:</p>
    <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;">${invitationLink}</p>
    <p><strong>Your token:</strong> ${token}</p>
    <p>This invitation expires in 7 days.</p>
    <p>VineChMS - Church Management Platform</p>
  `;
    await (0, mailer_1.sendEmail)(data.email, "You've Been Invited to VineChMS", `You have been invited to join VineChMS as a ${data.role}. Click the link to accept: ${invitationLink}`, emailHtml);
    return result.rows[0];
};
exports.createInvitationService = createInvitationService;
const getInvitationsService = async () => {
    return await db_1.default
        .select({
        invitationId: schema_1.invitations.invitationId,
        email: schema_1.invitations.email,
        role: schema_1.invitations.role,
        token: schema_1.invitations.token,
        status: schema_1.invitations.status,
        expiresAt: schema_1.invitations.expiresAt,
        invitedBy: schema_1.invitations.invitedBy,
        invitedByName: schema_1.users.fullName,
        largeOrganizationId: schema_1.invitations.largeOrganizationId,
        organizationId: schema_1.invitations.organizationId,
        churchId: schema_1.invitations.churchId,
        createdAt: schema_1.invitations.createdAt,
    })
        .from(schema_1.invitations)
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.invitations.invitedBy, schema_1.users.userId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.invitations.createdAt));
};
exports.getInvitationsService = getInvitationsService;
const getInvitationByIdService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid invitation ID");
    }
    const [result] = await db_1.default
        .select()
        .from(schema_1.invitations)
        .where((0, drizzle_orm_1.eq)(schema_1.invitations.invitationId, id));
    if (!result)
        throw new Error("Invitation not found");
    return result;
};
exports.getInvitationByIdService = getInvitationByIdService;
const getInvitationByTokenService = async (token) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.invitations)
        .where((0, drizzle_orm_1.eq)(schema_1.invitations.token, token));
    if (!result)
        throw new Error("Invitation not found");
    return result;
};
exports.getInvitationByTokenService = getInvitationByTokenService;
const getInvitationsByEmailService = async (email) => {
    return await db_1.default
        .select()
        .from(schema_1.invitations)
        .where((0, drizzle_orm_1.eq)(schema_1.invitations.email, email))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.invitations.createdAt));
};
exports.getInvitationsByEmailService = getInvitationsByEmailService;
const getInvitationsByChurchService = async (churchId) => {
    if (!churchId || isNaN(churchId)) {
        throw new Error("Invalid church ID");
    }
    return await db_1.default
        .select()
        .from(schema_1.invitations)
        .where((0, drizzle_orm_1.eq)(schema_1.invitations.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.invitations.createdAt));
};
exports.getInvitationsByChurchService = getInvitationsByChurchService;
const getInvitationsByOrganizationService = async (organizationId) => {
    if (!organizationId || isNaN(organizationId)) {
        throw new Error("Invalid organization ID");
    }
    return await db_1.default
        .select()
        .from(schema_1.invitations)
        .where((0, drizzle_orm_1.eq)(schema_1.invitations.organizationId, organizationId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.invitations.createdAt));
};
exports.getInvitationsByOrganizationService = getInvitationsByOrganizationService;
const getInvitationsByLargeOrganizationService = async (largeOrganizationId) => {
    if (!largeOrganizationId || isNaN(largeOrganizationId)) {
        throw new Error("Invalid large organization ID");
    }
    return await db_1.default
        .select()
        .from(schema_1.invitations)
        .where((0, drizzle_orm_1.eq)(schema_1.invitations.largeOrganizationId, largeOrganizationId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.invitations.createdAt));
};
exports.getInvitationsByLargeOrganizationService = getInvitationsByLargeOrganizationService;
const updateInvitationService = async (id, data) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid invitation ID");
    }
    const pool = db_1.default.$client;
    const updates = [];
    const values = [];
    let paramIndex = 1;
    if (data.status !== undefined) {
        updates.push(`status = $${paramIndex}`);
        values.push(data.status);
        paramIndex++;
    }
    if (data.acceptedAt !== undefined) {
        updates.push(`accepted_at = $${paramIndex}`);
        values.push(data.acceptedAt);
        paramIndex++;
    }
    if (updates.length === 0) {
        throw new Error("No fields to update");
    }
    values.push(id);
    const query = `
    UPDATE invitations 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE invitation_id = $${paramIndex}
    RETURNING *
  `;
    const result = await pool.query(query, values);
    if (!result.rows[0])
        throw new Error("Invitation not found");
    return result.rows[0];
};
exports.updateInvitationService = updateInvitationService;
const deleteInvitationService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid invitation ID");
    }
    const [result] = await db_1.default
        .delete(schema_1.invitations)
        .where((0, drizzle_orm_1.eq)(schema_1.invitations.invitationId, id))
        .returning({ id: schema_1.invitations.invitationId });
    if (!result)
        throw new Error("Invitation not found");
    return result;
};
exports.deleteInvitationService = deleteInvitationService;
const acceptInvitationService = async (token) => {
    const invitation = await (0, exports.getInvitationByTokenService)(token);
    if (invitation.status !== 'pending') {
        throw new Error("Invitation already " + invitation.status);
    }
    if (new Date() > new Date(invitation.expiresAt)) {
        throw new Error("Invitation has expired");
    }
    const pool = db_1.default.$client;
    const query = `
    UPDATE invitations 
    SET 
      status = 'accepted',
      accepted_at = NOW(),
      updated_at = NOW()
    WHERE token = $1
    RETURNING *
  `;
    const result = await pool.query(query, [token]);
    return result.rows[0];
};
exports.acceptInvitationService = acceptInvitationService;
const resendInvitationService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid invitation ID");
    }
    const invitation = await (0, exports.getInvitationByIdService)(id);
    if (invitation.status === 'accepted') {
        throw new Error("Invitation already accepted");
    }
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const pool = db_1.default.$client;
    const query = `
    UPDATE invitations 
    SET 
      token = $1,
      expires_at = $2,
      status = 'pending',
      updated_at = NOW()
    WHERE invitation_id = $3
    RETURNING *
  `;
    const result = await pool.query(query, [token, expiresAt.toISOString(), id]);
    // Send email
    const invitationLink = `${process.env.FRONTEND_URL}/accept-invitation?token=${token}`;
    const emailHtml = `
    <h2>Invitation Resent - VineChMS</h2>
    <p>Hello,</p>
    <p>You have been re-invited to join VineChMS as a <strong>${invitation.role}</strong>.</p>
    <p>Click the button below to accept your invitation:</p>
    <p style="text-align: center; margin-top: 20px;">
      <a href="${invitationLink}" style="display: inline-block; padding: 12px 24px; background: #1565C0; color: #fff; text-decoration: none; border-radius: 6px;">Accept Invitation</a>
    </p>
    <p><strong>Your token:</strong> ${token}</p>
    <p>This invitation expires in 7 days.</p>
    <p>VineChMS - Church Management Platform</p>
  `;
    await (0, mailer_1.sendEmail)(invitation.email, "Your Invitation to VineChMS (Resent)", `You have been re-invited to join VineChMS as a ${invitation.role}. Click the link to accept: ${invitationLink}`, emailHtml);
    return result.rows[0];
};
exports.resendInvitationService = resendInvitationService;
