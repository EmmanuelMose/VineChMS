"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentsCountService = exports.getInactiveDocumentsService = exports.getActiveDocumentsService = exports.restoreDocumentService = exports.hardDeleteDocumentService = exports.deleteDocumentService = exports.updateDocumentService = exports.getDocumentsByUploaderService = exports.getDocumentsByVisibilityService = exports.getDocumentsByTypeService = exports.getDocumentsByChurchService = exports.getDocumentByIdService = exports.getAllDocumentsService = exports.getDocumentsService = exports.createDocumentService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createDocumentService = async (data) => {
    const pool = db_1.default.$client;
    const query = `
    INSERT INTO documents (
      church_id,
      title,
      description,
      file_name,
      file_url,
      file_public_id,
      file_size,
      file_type,
      document_type,
      visibility,
      thumbnail,
      thumbnail_public_id,
      uploaded_by,
      version,
      is_active
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
    )
    RETURNING *
  `;
    const values = [
        Number(data.churchId),
        data.title,
        data.description || null,
        data.fileName,
        data.fileUrl,
        data.filePublicId || null,
        data.fileSize ? Number(data.fileSize) : null,
        data.fileType || null,
        data.documentType || null,
        data.visibility || "members_only",
        data.thumbnail || null,
        data.thumbnailPublicId || null,
        data.uploadedBy ? Number(data.uploadedBy) : null,
        data.version ? Number(data.version) : 1,
        data.isActive !== undefined ? Boolean(data.isActive) : true
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};
exports.createDocumentService = createDocumentService;
const getDocumentsService = async () => {
    return await db_1.default
        .select()
        .from(schema_1.documents)
        .where((0, drizzle_orm_1.eq)(schema_1.documents.isActive, true))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.documents.createdAt));
};
exports.getDocumentsService = getDocumentsService;
const getAllDocumentsService = async () => {
    return await db_1.default
        .select()
        .from(schema_1.documents)
        .orderBy((0, drizzle_orm_1.desc)(schema_1.documents.createdAt));
};
exports.getAllDocumentsService = getAllDocumentsService;
const getDocumentByIdService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid document ID");
    }
    const [result] = await db_1.default
        .select()
        .from(schema_1.documents)
        .where((0, drizzle_orm_1.eq)(schema_1.documents.documentId, id));
    if (!result)
        throw new Error("Document not found");
    return result;
};
exports.getDocumentByIdService = getDocumentByIdService;
const getDocumentsByChurchService = async (churchId) => {
    if (!churchId || isNaN(churchId)) {
        throw new Error("Invalid church ID");
    }
    return await db_1.default
        .select()
        .from(schema_1.documents)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.documents.churchId, churchId), (0, drizzle_orm_1.eq)(schema_1.documents.isActive, true)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.documents.createdAt));
};
exports.getDocumentsByChurchService = getDocumentsByChurchService;
const getDocumentsByTypeService = async (documentType) => {
    return await db_1.default
        .select()
        .from(schema_1.documents)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.documents.documentType, documentType), (0, drizzle_orm_1.eq)(schema_1.documents.isActive, true)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.documents.createdAt));
};
exports.getDocumentsByTypeService = getDocumentsByTypeService;
const getDocumentsByVisibilityService = async (visibility) => {
    const pool = db_1.default.$client;
    const query = `
    SELECT *
    FROM documents
    WHERE visibility = $1
      AND is_active = true
    ORDER BY created_at DESC
  `;
    const result = await pool.query(query, [visibility]);
    return result.rows;
};
exports.getDocumentsByVisibilityService = getDocumentsByVisibilityService;
const getDocumentsByUploaderService = async (uploadedBy) => {
    if (!uploadedBy || isNaN(uploadedBy)) {
        throw new Error("Invalid user ID");
    }
    return await db_1.default
        .select()
        .from(schema_1.documents)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.documents.uploadedBy, uploadedBy), (0, drizzle_orm_1.eq)(schema_1.documents.isActive, true)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.documents.createdAt));
};
exports.getDocumentsByUploaderService = getDocumentsByUploaderService;
const updateDocumentService = async (id, data) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid document ID");
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
    if (data.description !== undefined) {
        updates.push(`description = $${paramIndex}`);
        values.push(data.description);
        paramIndex++;
    }
    if (data.fileName !== undefined) {
        updates.push(`file_name = $${paramIndex}`);
        values.push(data.fileName);
        paramIndex++;
    }
    if (data.fileUrl !== undefined) {
        updates.push(`file_url = $${paramIndex}`);
        values.push(data.fileUrl);
        paramIndex++;
    }
    if (data.filePublicId !== undefined) {
        updates.push(`file_public_id = $${paramIndex}`);
        values.push(data.filePublicId);
        paramIndex++;
    }
    if (data.fileSize !== undefined) {
        updates.push(`file_size = $${paramIndex}`);
        values.push(data.fileSize ? Number(data.fileSize) : null);
        paramIndex++;
    }
    if (data.fileType !== undefined) {
        updates.push(`file_type = $${paramIndex}`);
        values.push(data.fileType);
        paramIndex++;
    }
    if (data.documentType !== undefined) {
        updates.push(`document_type = $${paramIndex}`);
        values.push(data.documentType);
        paramIndex++;
    }
    if (data.visibility !== undefined) {
        updates.push(`visibility = $${paramIndex}`);
        values.push(data.visibility);
        paramIndex++;
    }
    if (data.thumbnail !== undefined) {
        updates.push(`thumbnail = $${paramIndex}`);
        values.push(data.thumbnail);
        paramIndex++;
    }
    if (data.thumbnailPublicId !== undefined) {
        updates.push(`thumbnail_public_id = $${paramIndex}`);
        values.push(data.thumbnailPublicId);
        paramIndex++;
    }
    if (data.version !== undefined) {
        updates.push(`version = $${paramIndex}`);
        values.push(Number(data.version));
        paramIndex++;
    }
    if (data.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex}`);
        values.push(Boolean(data.isActive));
        paramIndex++;
    }
    if (updates.length === 0) {
        throw new Error("No fields to update");
    }
    values.push(id);
    const query = `
    UPDATE documents 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE document_id = $${paramIndex}
    RETURNING *
  `;
    const result = await pool.query(query, values);
    if (!result.rows[0])
        throw new Error("Document not found");
    return result.rows[0];
};
exports.updateDocumentService = updateDocumentService;
const deleteDocumentService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid document ID");
    }
    const pool = db_1.default.$client;
    const query = `
    UPDATE documents 
    SET is_active = false, updated_at = NOW()
    WHERE document_id = $1
    RETURNING *
  `;
    const result = await pool.query(query, [id]);
    if (!result.rows[0])
        throw new Error("Document not found");
    return result.rows[0];
};
exports.deleteDocumentService = deleteDocumentService;
const hardDeleteDocumentService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid document ID");
    }
    const [result] = await db_1.default
        .delete(schema_1.documents)
        .where((0, drizzle_orm_1.eq)(schema_1.documents.documentId, id))
        .returning({ id: schema_1.documents.documentId });
    if (!result)
        throw new Error("Document not found");
    return result;
};
exports.hardDeleteDocumentService = hardDeleteDocumentService;
const restoreDocumentService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid document ID");
    }
    const pool = db_1.default.$client;
    const query = `
    UPDATE documents 
    SET is_active = true, updated_at = NOW()
    WHERE document_id = $1
    RETURNING *
  `;
    const result = await pool.query(query, [id]);
    if (!result.rows[0])
        throw new Error("Document not found");
    return result.rows[0];
};
exports.restoreDocumentService = restoreDocumentService;
const getActiveDocumentsService = async () => {
    return await db_1.default
        .select()
        .from(schema_1.documents)
        .where((0, drizzle_orm_1.eq)(schema_1.documents.isActive, true))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.documents.createdAt));
};
exports.getActiveDocumentsService = getActiveDocumentsService;
const getInactiveDocumentsService = async () => {
    return await db_1.default
        .select()
        .from(schema_1.documents)
        .where((0, drizzle_orm_1.eq)(schema_1.documents.isActive, false))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.documents.createdAt));
};
exports.getInactiveDocumentsService = getInactiveDocumentsService;
const getDocumentsCountService = async () => {
    const pool = db_1.default.$client;
    const query = `
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN is_active THEN 1 END) as active,
      COUNT(CASE WHEN NOT is_active THEN 1 END) as inactive,
      document_type,
      COUNT(*) as type_count
    FROM documents
    GROUP BY document_type
  `;
    const result = await pool.query(query);
    return result.rows;
};
exports.getDocumentsCountService = getDocumentsCountService;
