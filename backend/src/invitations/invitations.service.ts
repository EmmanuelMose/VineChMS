import db from "../Drizzle/db";
import { invitations, users, largeOrganizations, organizations, churches } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { sendEmail } from "../mailer/mailer";

const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const createInvitationService = async (data: any) => {
  const pool = db.$client;
  
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

  await sendEmail(
    data.email,
    "You've Been Invited to VineChMS",
    `You have been invited to join VineChMS as a ${data.role}. Click the link to accept: ${invitationLink}`,
    emailHtml
  );

  return result.rows[0];
};

export const getInvitationsService = async () => {
  return await db
    .select({
      invitationId: invitations.invitationId,
      email: invitations.email,
      role: invitations.role,
      token: invitations.token,
      status: invitations.status,
      expiresAt: invitations.expiresAt,
      invitedBy: invitations.invitedBy,
      invitedByName: users.fullName,
      largeOrganizationId: invitations.largeOrganizationId,
      organizationId: invitations.organizationId,
      churchId: invitations.churchId,
      createdAt: invitations.createdAt,
    })
    .from(invitations)
    .leftJoin(users, eq(invitations.invitedBy, users.userId))
    .orderBy(desc(invitations.createdAt));
};

export const getInvitationByIdService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid invitation ID");
  }
  const [result] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.invitationId, id));
  if (!result) throw new Error("Invitation not found");
  return result;
};

export const getInvitationByTokenService = async (token: string) => {
  const [result] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.token, token));
  if (!result) throw new Error("Invitation not found");
  return result;
};

export const getInvitationsByEmailService = async (email: string) => {
  return await db
    .select()
    .from(invitations)
    .where(eq(invitations.email, email))
    .orderBy(desc(invitations.createdAt));
};

export const getInvitationsByChurchService = async (churchId: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  return await db
    .select()
    .from(invitations)
    .where(eq(invitations.churchId, churchId))
    .orderBy(desc(invitations.createdAt));
};

export const getInvitationsByOrganizationService = async (organizationId: number) => {
  if (!organizationId || isNaN(organizationId)) {
    throw new Error("Invalid organization ID");
  }
  return await db
    .select()
    .from(invitations)
    .where(eq(invitations.organizationId, organizationId))
    .orderBy(desc(invitations.createdAt));
};

export const getInvitationsByLargeOrganizationService = async (largeOrganizationId: number) => {
  if (!largeOrganizationId || isNaN(largeOrganizationId)) {
    throw new Error("Invalid large organization ID");
  }
  return await db
    .select()
    .from(invitations)
    .where(eq(invitations.largeOrganizationId, largeOrganizationId))
    .orderBy(desc(invitations.createdAt));
};

export const updateInvitationService = async (id: number, data: any) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid invitation ID");
  }
  
  const pool = db.$client;
  const updates: string[] = [];
  const values: any[] = [];
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
  if (!result.rows[0]) throw new Error("Invitation not found");
  return result.rows[0];
};

export const deleteInvitationService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid invitation ID");
  }
  const [result] = await db
    .delete(invitations)
    .where(eq(invitations.invitationId, id))
    .returning({ id: invitations.invitationId });
  if (!result) throw new Error("Invitation not found");
  return result;
};

export const acceptInvitationService = async (token: string) => {
  const invitation = await getInvitationByTokenService(token);
  
  if (invitation.status !== 'pending') {
    throw new Error("Invitation already " + invitation.status);
  }
  
  if (new Date() > new Date(invitation.expiresAt)) {
    throw new Error("Invitation has expired");
  }
  
  const pool = db.$client;
  
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

export const resendInvitationService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid invitation ID");
  }
  
  const invitation = await getInvitationByIdService(id);
  
  if (invitation.status === 'accepted') {
    throw new Error("Invitation already accepted");
  }
  
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  const pool = db.$client;
  
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

  await sendEmail(
    invitation.email,
    "Your Invitation to VineChMS (Resent)",
    `You have been re-invited to join VineChMS as a ${invitation.role}. Click the link to accept: ${invitationLink}`,
    emailHtml
  );

  return result.rows[0];
};
