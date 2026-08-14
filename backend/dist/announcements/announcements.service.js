"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveAnnouncementsService = exports.getPublishedAnnouncementsByChurchService = exports.unpublishAnnouncementService = exports.publishAnnouncementService = exports.deleteAnnouncementService = exports.updateAnnouncementService = exports.getAnnouncementsByChurchService = exports.getAnnouncementByIdService = exports.createAnnouncementService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createAnnouncementService = async (data) => {
    const pool = db_1.default.$client;
    const query = `
    INSERT INTO announcements (
      church_id,
      title,
      content,
      image_url,
      image_public_id,
      image_position,
      is_published,
      published_at,
      expires_at,
      created_by
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    )
    RETURNING *
  `;
    const values = [
        Number(data.churchId),
        data.title,
        data.content,
        data.imageUrl || null,
        data.imagePublicId || null,
        data.imagePosition || "top",
        data.isPublished !== undefined ? Boolean(data.isPublished) : false,
        data.publishedAt || null,
        data.expiresAt || null,
        data.createdBy ? Number(data.createdBy) : null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};
exports.createAnnouncementService = createAnnouncementService;
const getAnnouncementByIdService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid announcement ID");
    }
    const [result] = await db_1.default
        .select()
        .from(schema_1.announcements)
        .where((0, drizzle_orm_1.eq)(schema_1.announcements.announcementId, id));
    if (!result)
        throw new Error("Announcement not found");
    return result;
};
exports.getAnnouncementByIdService = getAnnouncementByIdService;
const getAnnouncementsByChurchService = async (churchId) => {
    if (!churchId || isNaN(churchId)) {
        throw new Error("Invalid church ID");
    }
    return await db_1.default
        .select()
        .from(schema_1.announcements)
        .where((0, drizzle_orm_1.eq)(schema_1.announcements.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.announcements.createdAt));
};
exports.getAnnouncementsByChurchService = getAnnouncementsByChurchService;
const updateAnnouncementService = async (id, data) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid announcement ID");
    }
    const pool = db_1.default.$client;
    const updates = [];
    const values = [];
    let paramIndex = 1;
    if (data.title !== undefined) {
        updates.push(`title = $${paramIndex}`);
        values.push(data.title);
        paramIndex++;
    }
    if (data.content !== undefined) {
        updates.push(`content = $${paramIndex}`);
        values.push(data.content);
        paramIndex++;
    }
    if (data.imageUrl !== undefined) {
        updates.push(`image_url = $${paramIndex}`);
        values.push(data.imageUrl);
        paramIndex++;
    }
    if (data.imagePublicId !== undefined) {
        updates.push(`image_public_id = $${paramIndex}`);
        values.push(data.imagePublicId);
        paramIndex++;
    }
    if (data.imagePosition !== undefined) {
        updates.push(`image_position = $${paramIndex}`);
        values.push(data.imagePosition);
        paramIndex++;
    }
    if (data.isPublished !== undefined) {
        updates.push(`is_published = $${paramIndex}`);
        values.push(Boolean(data.isPublished));
        paramIndex++;
    }
    if (data.publishedAt !== undefined) {
        updates.push(`published_at = $${paramIndex}`);
        values.push(data.publishedAt);
        paramIndex++;
    }
    if (data.expiresAt !== undefined) {
        updates.push(`expires_at = $${paramIndex}`);
        values.push(data.expiresAt);
        paramIndex++;
    }
    if (updates.length === 0) {
        throw new Error("No fields to update");
    }
    values.push(id);
    const query = `
    UPDATE announcements 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE announcement_id = $${paramIndex}
    RETURNING *
  `;
    const result = await pool.query(query, values);
    if (!result.rows[0])
        throw new Error("Announcement not found");
    return result.rows[0];
};
exports.updateAnnouncementService = updateAnnouncementService;
const deleteAnnouncementService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid announcement ID");
    }
    const [result] = await db_1.default
        .delete(schema_1.announcements)
        .where((0, drizzle_orm_1.eq)(schema_1.announcements.announcementId, id))
        .returning({ id: schema_1.announcements.announcementId });
    if (!result)
        throw new Error("Announcement not found");
    return result;
};
exports.deleteAnnouncementService = deleteAnnouncementService;
const publishAnnouncementService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid announcement ID");
    }
    const pool = db_1.default.$client;
    const query = `
    UPDATE announcements 
    SET 
      is_published = true,
      published_at = NOW(),
      updated_at = NOW()
    WHERE announcement_id = $1
    RETURNING *
  `;
    const result = await pool.query(query, [id]);
    if (!result.rows[0])
        throw new Error("Announcement not found");
    return result.rows[0];
};
exports.publishAnnouncementService = publishAnnouncementService;
const unpublishAnnouncementService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid announcement ID");
    }
    const pool = db_1.default.$client;
    const query = `
    UPDATE announcements 
    SET 
      is_published = false,
      updated_at = NOW()
    WHERE announcement_id = $1
    RETURNING *
  `;
    const result = await pool.query(query, [id]);
    if (!result.rows[0])
        throw new Error("Announcement not found");
    return result.rows[0];
};
exports.unpublishAnnouncementService = unpublishAnnouncementService;
const getPublishedAnnouncementsByChurchService = async (churchId) => {
    if (!churchId || isNaN(churchId)) {
        throw new Error("Invalid church ID");
    }
    return await db_1.default
        .select()
        .from(schema_1.announcements)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.announcements.isPublished, true), (0, drizzle_orm_1.eq)(schema_1.announcements.churchId, churchId)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.announcements.createdAt));
};
exports.getPublishedAnnouncementsByChurchService = getPublishedAnnouncementsByChurchService;
const getActiveAnnouncementsService = async (churchId) => {
    if (!churchId || isNaN(churchId)) {
        throw new Error("Invalid church ID");
    }
    return await db_1.default
        .select()
        .from(schema_1.announcements)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.announcements.isPublished, true), (0, drizzle_orm_1.eq)(schema_1.announcements.churchId, churchId)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.announcements.createdAt));
};
exports.getActiveAnnouncementsService = getActiveAnnouncementsService;
