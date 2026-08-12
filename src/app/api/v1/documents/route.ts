import { NextResponse, NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { documentsService } from "@/services/documents.service";

const ALLOWED_TYPES = ['PDF', 'DOCX', 'PNG', 'JPG', 'ZIP'];
const ALLOWED_CATEGORIES = ['Study Materials', 'Placement', 'Projects', 'Certificates', 'Personal', 'College'];
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET() {
  const requestId = crypto.randomUUID();
  logger.info("Handling GET /api/v1/documents", { requestId });

  try {
    const data = await documentsService.getModuleData();

    return NextResponse.json({
      success: true,
      data,
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("GET /api/v1/documents failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to fetch documents data", code: "DOCUMENTS_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling POST /api/v1/documents", { requestId });

  try {
    const body = await req.json();
    const { action } = body;

    if (action === "create_folder") {
      if (!body.name?.trim()) {
        return NextResponse.json(
          { success: false, error: { message: "Folder name is required", code: "VALIDATION_ERROR" } },
          { status: 400 }
        );
      }
      const parentId = body.parent_id && UUID_REGEX.test(body.parent_id) ? body.parent_id : undefined;
      const folder = await documentsService.createFolder(body.name.trim(), parentId);
      return NextResponse.json({
        success: true,
        data: folder,
        meta: { generated_at: new Date().toISOString() },
      });
    }

    if (action === "create_document") {
      if (!body.name?.trim()) {
        return NextResponse.json(
          { success: false, error: { message: "Document name is required", code: "VALIDATION_ERROR" } },
          { status: 400 }
        );
      }

      const folderId = body.folder_id && UUID_REGEX.test(body.folder_id) ? body.folder_id : null;
      const type = ALLOWED_TYPES.includes(body.type) ? body.type : "PDF";
      const category = ALLOWED_CATEGORIES.includes(body.category) ? body.category : "Study Materials";

      const doc = await documentsService.createDocument({
        name: body.name.trim(),
        folder_id: folderId,
        path: body.path || `/Root/${body.name.trim()}`,
        type: type as any,
        category: category as any,
        size: body.size || "1.2 MB",
        modified_date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        tags: Array.isArray(body.tags) ? body.tags : [category],
        download_url: body.download_url || "",
      });

      return NextResponse.json({
        success: true,
        data: doc,
        meta: { generated_at: new Date().toISOString() },
      });
    }

    return NextResponse.json(
      { success: false, error: { message: "Invalid action", code: "INVALID_ACTION" } },
      { status: 400 }
    );
  } catch (err: any) {
    logger.error("POST /api/v1/documents failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to process document request", code: "DOCUMENTS_POST_ERROR" } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling PATCH /api/v1/documents", { requestId });

  try {
    const body = await req.json();
    const { action, id } = body;

    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: { message: "id and action are required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    if (action === "rename_folder") {
      await documentsService.renameFolder(id, body.name);
    } else if (action === "rename_document") {
      await documentsService.renameDocument(id, body.name);
    } else if (action === "move_document") {
      const folderId = body.folder_id && UUID_REGEX.test(body.folder_id) ? body.folder_id : null;
      await documentsService.moveDocument(id, folderId);
    } else if (action === "toggle_favorite") {
      await documentsService.toggleFavorite(id, !!body.is_favorite);
    } else if (action === "toggle_pin") {
      await documentsService.togglePin(id, !!body.is_pinned);
    }

    return NextResponse.json({
      success: true,
      data: { id, action },
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("PATCH /api/v1/documents failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to update document item", code: "UPDATE_ERROR" } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling DELETE /api/v1/documents", { requestId });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const target = searchParams.get("target");

    if (!id || !target) {
      return NextResponse.json(
        { success: false, error: { message: "id and target are required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    if (target === "folder") {
      await documentsService.deleteFolder(id);
    } else {
      await documentsService.deleteDocument(id);
    }

    return NextResponse.json({
      success: true,
      data: { id, target },
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("DELETE /api/v1/documents failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to delete document item", code: "DELETE_ERROR" } },
      { status: 500 }
    );
  }
}
