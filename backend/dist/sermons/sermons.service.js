"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSermonService = exports.updateSermonService = exports.getSermonsByChurchService = exports.getSermonByIdService = exports.createSermonService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createSermonService = async (data) => {
    const pool = db_1.default.$client;
    const query = `
    INSERT INTO sermons (
      church_id,
      title,
      speaker,
      topic,
      scripture,
      description,
      video_url,
      video_public_id,
      audio_url,
      audio_public_id,
      notes,
      preached_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
    )
    RETURNING *
  `;
    const values = [
        Number(data.churchId),
        data.title,
        data.speaker,
        data.topic || null,
        data.scripture || null,
        data.description || null,
        data.videoUrl || null,
        data.videoPublicId || null,
        data.audioUrl || null,
        data.audioPublicId || null,
        data.notes || null,
        data.preachedAt || new Date().toISOString()
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};
exports.createSermonService = createSermonService;
const getSermonByIdService = async (id) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.sermons)
        .where((0, drizzle_orm_1.eq)(schema_1.sermons.sermonId, id));
    if (!result)
        throw new Error("Sermon not found");
    return result;
};
exports.getSermonByIdService = getSermonByIdService;
const getSermonsByChurchService = async (churchId) => {
    return await db_1.default
        .select()
        .from(schema_1.sermons)
        .where((0, drizzle_orm_1.eq)(schema_1.sermons.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.sermons.preachedAt));
};
exports.getSermonsByChurchService = getSermonsByChurchService;
const updateSermonService = async (id, data) => {
    const pool = db_1.default.$client;
    const updates = [];
    const values = [];
    let paramIndex = 1;
    if (data.title !== undefined) {
        updates.push(`title = $${paramIndex}`);
        values.push(data.title);
        paramIndex++;
    }
    if (data.speaker !== undefined) {
        updates.push(`speaker = $${paramIndex}`);
        values.push(data.speaker);
        paramIndex++;
    }
    if (data.topic !== undefined) {
        updates.push(`topic = $${paramIndex}`);
        values.push(data.topic);
        paramIndex++;
    }
    if (data.scripture !== undefined) {
        updates.push(`scripture = $${paramIndex}`);
        values.push(data.scripture);
        paramIndex++;
    }
    if (data.description !== undefined) {
        updates.push(`description = $${paramIndex}`);
        values.push(data.description);
        paramIndex++;
    }
    if (data.videoUrl !== undefined) {
        updates.push(`video_url = $${paramIndex}`);
        values.push(data.videoUrl);
        paramIndex++;
    }
    if (data.videoPublicId !== undefined) {
        updates.push(`video_public_id = $${paramIndex}`);
        values.push(data.videoPublicId);
        paramIndex++;
    }
    if (data.audioUrl !== undefined) {
        updates.push(`audio_url = $${paramIndex}`);
        values.push(data.audioUrl);
        paramIndex++;
    }
    if (data.audioPublicId !== undefined) {
        updates.push(`audio_public_id = $${paramIndex}`);
        values.push(data.audioPublicId);
        paramIndex++;
    }
    if (data.notes !== undefined) {
        updates.push(`notes = $${paramIndex}`);
        values.push(data.notes);
        paramIndex++;
    }
    if (data.preachedAt !== undefined) {
        updates.push(`preached_at = $${paramIndex}`);
        values.push(data.preachedAt);
        paramIndex++;
    }
    if (updates.length === 0) {
        throw new Error("No fields to update");
    }
    values.push(id);
    const query = `
    UPDATE sermons 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE sermon_id = $${paramIndex}
    RETURNING *
  `;
    const result = await pool.query(query, values);
    if (!result.rows[0])
        throw new Error("Sermon not found");
    return result.rows[0];
};
exports.updateSermonService = updateSermonService;
const deleteSermonService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.sermons)
        .where((0, drizzle_orm_1.eq)(schema_1.sermons.sermonId, id))
        .returning({ id: schema_1.sermons.sermonId });
    if (!result)
        throw new Error("Sermon not found");
    return result;
};
exports.deleteSermonService = deleteSermonService;
