import { documentsRepository } from "@/repositories/documents.repository";
import { DocumentFolder, UserDocument } from "@/types/document";

export class DocumentsService {
  async getModuleData(): Promise<{
    folders: DocumentFolder[];
    documents: UserDocument[];
  }> {
    const [folders, documents] = await Promise.all([
      documentsRepository.getFolders(),
      documentsRepository.getDocuments(),
    ]);

    return { folders, documents };
  }

  async createFolder(name: string, parentId?: string): Promise<DocumentFolder> {
    return documentsRepository.createFolder(name, parentId);
  }

  async renameFolder(id: string, name: string): Promise<boolean> {
    return documentsRepository.renameFolder(id, name);
  }

  async deleteFolder(id: string): Promise<boolean> {
    return documentsRepository.deleteFolder(id);
  }

  async createDocument(doc: Omit<UserDocument, "id">): Promise<UserDocument> {
    return documentsRepository.createDocument(doc);
  }

  async renameDocument(id: string, name: string): Promise<boolean> {
    return documentsRepository.renameDocument(id, name);
  }

  async moveDocument(id: string, folderId: string | null): Promise<boolean> {
    return documentsRepository.moveDocument(id, folderId);
  }

  async toggleFavorite(id: string, isFavorite: boolean): Promise<boolean> {
    return documentsRepository.toggleFavorite(id, isFavorite);
  }

  async togglePin(id: string, isPinned: boolean): Promise<boolean> {
    return documentsRepository.togglePin(id, isPinned);
  }

  async deleteDocument(id: string): Promise<boolean> {
    return documentsRepository.deleteDocument(id);
  }
}

export const documentsService = new DocumentsService();
