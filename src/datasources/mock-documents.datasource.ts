import { DocumentFolder, UserDocument } from "@/types/document";

export const MOCK_FOLDERS: DocumentFolder[] = [];

export const MOCK_DOCUMENTS: UserDocument[] = [];

export class MockDocumentsDatasource {
  async getFolders(): Promise<DocumentFolder[]> {
    return MOCK_FOLDERS;
  }

  async getDocuments(): Promise<UserDocument[]> {
    return MOCK_DOCUMENTS;
  }
}

export const mockDocumentsDatasource = new MockDocumentsDatasource();
