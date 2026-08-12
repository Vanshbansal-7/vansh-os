import { examsRepository } from "@/repositories/exams.repository";
import {
  ExamMaster,
  ExamApplication,
  ExamOverviewData,
  ExamSubject,
  ExamResource,
  ExamNote,
} from "@/types/exams";

export class ExamsService {
  async getLauncherData(): Promise<{ exams: ExamMaster[]; applications: ExamApplication[] }> {
    const [exams, applications] = await Promise.all([
      examsRepository.getExams(),
      examsRepository.getApplications(),
    ]);
    return { exams, applications };
  }

  async getExamWorkspace(slug: string): Promise<{
    exam: ExamMaster | null;
    overview: ExamOverviewData | null;
    subjects: ExamSubject[];
    resources: ExamResource[];
    notes: ExamNote[];
  }> {
    const [exam, overview, subjects, resources, notes] = await Promise.all([
      examsRepository.getExamBySlug(slug),
      examsRepository.getOverview(slug),
      examsRepository.getSubjects(slug),
      examsRepository.getResources(slug),
      examsRepository.getNotes(slug),
    ]);

    return { exam, overview, subjects, resources, notes };
  }
}

export const examsService = new ExamsService();
