import { NextRequest, NextResponse } from 'next/server';
import { NotesRepository } from '@/repositories/notes.repository';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawModule = searchParams.get('module') || 'CGL';
    const examId = searchParams.get('exam_id') || undefined;

    const allowedModules = ['PLACEMENT', 'CGL', 'EXAMS', 'YOUTUBE'];
    const moduleName = allowedModules.includes(rawModule.toUpperCase()) ? rawModule.toUpperCase() : "EXAMS";

    const notes = await NotesRepository.findByModule(moduleName, examId);
    return NextResponse.json({
      success: true,
      data: notes,
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err?.message || 'Failed to fetch notes', code: 'DATABASE_ERROR' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, error: { message: 'Note title is required', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    let moduleName = body.module || 'CGL';
    const allowedModules = ['PLACEMENT', 'CGL', 'EXAMS', 'YOUTUBE'];
    if (!allowedModules.includes(moduleName.toUpperCase())) {
      moduleName = "EXAMS";
    }

    const note = await NotesRepository.create({
      module: moduleName as any,
      exam_id: body.exam_id,
      title: body.title.trim(),
      content: body.content || '',
      category: body.category || 'General',
      tags: Array.isArray(body.tags) ? body.tags : [],
      is_pinned: !!body.is_pinned,
    });

    return NextResponse.json({
      success: true,
      data: note,
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err?.message || 'Failed to create note', code: 'DATABASE_ERROR' } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: { message: 'Note ID is required', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    const { id, ...updates } = body;
    const note = await NotesRepository.update(id, updates);

    return NextResponse.json({
      success: true,
      data: note,
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err?.message || 'Failed to update note', code: 'DATABASE_ERROR' } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: { message: 'Note ID is required', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    await NotesRepository.delete(id);

    return NextResponse.json({
      success: true,
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err?.message || 'Failed to delete note', code: 'DATABASE_ERROR' } },
      { status: 500 }
    );
  }
}
