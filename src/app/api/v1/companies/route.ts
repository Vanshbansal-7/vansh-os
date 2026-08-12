import { NextResponse, NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { companiesService } from "@/services/companies.service";

const ALLOWED_APPLICATION_MODES = ['On Campus', 'Off Campus', 'Referral', 'LinkedIn', 'Careers Page'];
const ALLOWED_STATUSES = ['Applied', 'Assessment', 'Interview', 'Selected', 'Rejected', 'Offer Received', 'Withdrawn'];

export async function GET() {
  const requestId = crypto.randomUUID();
  logger.info("Handling GET /api/v1/companies", { requestId });

  try {
    const companies = await companiesService.getCompanies();
    return NextResponse.json({
      success: true,
      data: companies,
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("GET /api/v1/companies failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to fetch companies", code: "COMPANIES_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling POST /api/v1/companies", { requestId });

  try {
    const body = await req.json();

    if (!body.company_name?.trim()) {
      return NextResponse.json(
        { success: false, error: { message: "Company name is required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const mode = ALLOWED_APPLICATION_MODES.includes(body.application_mode)
      ? body.application_mode
      : "Off Campus";

    const status = ALLOWED_STATUSES.includes(body.status)
      ? body.status
      : "Applied";

    const company = await companiesService.createCompany({
      company_name: body.company_name.trim(),
      logo_url: body.logo_url || "",
      role: body.role?.trim() || "Software Engineer",
      applied_date: body.applied_date || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      application_mode: mode as any,
      job_link: body.job_link || "",
      status: status as any,
      location: body.location || "",
      notes: body.notes || "",
    });

    return NextResponse.json({
      success: true,
      data: company,
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("POST /api/v1/companies failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to create company", code: "CREATE_ERROR" } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling PATCH /api/v1/companies", { requestId });

  try {
    const body = await req.json();
    const { id, status, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: { message: "id is required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    if (status) {
      const validStatus = ALLOWED_STATUSES.includes(status) ? status : "Applied";
      await companiesService.updateCompanyStatus(id, validStatus as any);
    }

    if (Object.keys(updates).length > 0) {
      if (updates.application_mode && !ALLOWED_APPLICATION_MODES.includes(updates.application_mode)) {
        updates.application_mode = "Off Campus";
      }
      await companiesService.updateCompanyDetails(id, updates);
    }

    return NextResponse.json({
      success: true,
      data: { id, status, ...updates },
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("PATCH /api/v1/companies failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to update company application", code: "UPDATE_ERROR" } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling DELETE /api/v1/companies", { requestId });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: { message: "id is required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    await companiesService.deleteCompany(id);

    return NextResponse.json({
      success: true,
      data: { id },
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("DELETE /api/v1/companies failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to delete company", code: "DELETE_ERROR" } },
      { status: 500 }
    );
  }
}
