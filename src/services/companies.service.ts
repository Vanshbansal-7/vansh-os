import { companiesRepository } from "@/repositories/companies.repository";
import { CompanyApplication } from "@/types/company";

export class CompaniesService {
  async getCompanies(): Promise<CompanyApplication[]> {
    return companiesRepository.getCompanies();
  }

  async createCompany(input: Omit<CompanyApplication, "id" | "documents">): Promise<CompanyApplication> {
    return companiesRepository.createCompany(input);
  }

  async updateCompanyStatus(id: string, status: CompanyApplication["status"]): Promise<boolean> {
    return companiesRepository.updateCompanyStatus(id, status);
  }

  async updateCompanyDetails(id: string, updates: Partial<CompanyApplication>): Promise<boolean> {
    return companiesRepository.updateCompanyDetails(id, updates);
  }

  async deleteCompany(id: string): Promise<boolean> {
    return companiesRepository.deleteCompany(id);
  }
}

export const companiesService = new CompaniesService();
