import db from "../Drizzle/db";
import { documents } from "../Drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const createDocumentService = async (data: any) => {
  const pool = db.$client;
  
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

export const getDocumentsService = async () => {
  return await db
    .select()
    .from(documents)
    .where(eq(documents.isActive, true))
    .orderBy(desc(documents.createdAt));
};

export const getAllDocumentsService = async () => {
  return await db
    .select()
    .from(documents)
    .orderBy(desc(documents.createdAt));
};

export const getDocumentByIdService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid document ID");
  }
  const [result] = await db
    .select()
    .from(documents)
    .where(eq(documents.documentId, id));
  if (!result) throw new Error("Document not found");
  return result;
};

export const getDocumentsByChurchService = async (churchId: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  return await db
    .select()
    .from(documents)
    .where(and(eq(documents.churchId, churchId), eq(documents.isActive, true)))
    .orderBy(desc(documents.createdAt));
};

export const getDocumentsByTypeService = async (documentType: string) => {
  return await db
    .select()
    .from(documents)
    .where(and(eq(documents.documentType, documentType), eq(documents.isActive, true)))
    .orderBy(desc(documents.createdAt));
};

export const getDocumentsByVisibilityService = async (visibility: string) => {
  const pool = db.$client;
  
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

export const getDocumentsByUploaderService = async (uploadedBy: number) => {
  if (!uploadedBy || isNaN(uploadedBy)) {
    throw new Error("Invalid user ID");
  }
  return await db
    .select()
    .from(documents)
    .where(and(eq(documents.uploadedBy, uploadedBy), eq(documents.isActive, true)))
    .orderBy(desc(documents.createdAt));
};

export const updateDocumentService = async (id: number, data: any) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid document ID");
  }
  
  const pool = db.$client;
  const updates: string[] = [];
  const values: any[] = [];
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
  if (!result.rows[0]) throw new Error("Document not found");
  return result.rows[0];
};

export const deleteDocumentService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid document ID");
  }
  const pool = db.$client;
  
  const query = `
    UPDATE documents 
    SET is_active = false, updated_at = NOW()
    WHERE document_id = $1
    RETURNING *
  `;
  
  const result = await pool.query(query, [id]);
  if (!result.rows[0]) throw new Error("Document not found");
  return result.rows[0];
};

export const hardDeleteDocumentService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid document ID");
  }
  const [result] = await db
    .delete(documents)
    .where(eq(documents.documentId, id))
    .returning({ id: documents.documentId });
  if (!result) throw new Error("Document not found");
  return result;
};

export const restoreDocumentService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid document ID");
  }
  const pool = db.$client;
  
  const query = `
    UPDATE documents 
    SET is_active = true, updated_at = NOW()
    WHERE document_id = $1
    RETURNING *
  `;
  
  const result = await pool.query(query, [id]);
  if (!result.rows[0]) throw new Error("Document not found");
  return result.rows[0];
};

export const getActiveDocumentsService = async () => {
  return await db
    .select()
    .from(documents)
    .where(eq(documents.isActive, true))
    .orderBy(desc(documents.createdAt));
};

export const getInactiveDocumentsService = async () => {
  return await db
    .select()
    .from(documents)
    .where(eq(documents.isActive, false))
    .orderBy(desc(documents.createdAt));
};

export const getDocumentsCountService = async () => {
  const pool = db.$client;
  
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