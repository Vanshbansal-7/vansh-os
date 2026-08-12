import { CompanyApplication } from "@/types/company";

export const MOCK_COMPANIES: CompanyApplication[] = [];

export class MockCompaniesDatasource {
  async getCompanies(): Promise<CompanyApplication[]> {
    return MOCK_COMPANIES;
  }
}

export const mockCompaniesDatasource = new MockCompaniesDatasource();
