"use client";

import useSWR from "swr";
import { DocumentFolder, UserDocument } from "@/types/document";

interface DocumentsModuleData {
  folders: DocumentFolder[];
  documents: UserDocument[];
}

const fetcher = async (url: string): Promise<DocumentsModuleData> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || "Failed to fetch documents data");
  }
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "API returned failure");
  return json.data;
};

export function useDocumentsModule() {
  const { data, error, isLoading, mutate } = useSWR<DocumentsModuleData>(
    "/api/v1/documents",
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5_000,
    }
  );

  const folders = data?.folders || [];
  const documents = data?.documents || [];

  const createFolder = async (name: string, parentId?: string): Promise<DocumentFolder> => {
    try {
      const res = await fetch("/api/v1/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_folder", name, parent_id: parentId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useDocumentsModule] createFolder failed:", json.error);
        throw new Error(json.error?.message || "Failed to create folder");
      }
      await mutate();
      return json.data;
    } catch (err) {
      console.error("[useDocumentsModule] error creating folder:", err);
      throw err;
    }
  };

  const renameFolder = async (id: string, name: string) => {
    try {
      const res = await fetch("/api/v1/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rename_folder", id, name }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useDocumentsModule] renameFolder failed:", json.error);
        throw new Error(json.error?.message || "Failed to rename folder");
      }
      await mutate();
    } catch (err) {
      console.error("[useDocumentsModule] error renaming folder:", err);
      throw err;
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/documents?id=${id}&target=folder`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useDocumentsModule] deleteFolder failed:", json.error);
        throw new Error(json.error?.message || "Failed to delete folder");
      }
      await mutate();
    } catch (err) {
      console.error("[useDocumentsModule] error deleting folder:", err);
      throw err;
    }
  };

  const createDocument = async (doc: Omit<UserDocument, "id">): Promise<UserDocument> => {
    try {
      const res = await fetch("/api/v1/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_document", ...doc }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useDocumentsModule] createDocument failed:", json.error);
        throw new Error(json.error?.message || "Failed to create document");
      }
      await mutate();
      return json.data;
    } catch (err) {
      console.error("[useDocumentsModule] error creating document:", err);
      throw err;
    }
  };

  const renameDocument = async (id: string, name: string) => {
    try {
      const res = await fetch("/api/v1/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rename_document", id, name }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useDocumentsModule] renameDocument failed:", json.error);
        throw new Error(json.error?.message || "Failed to rename document");
      }
      await mutate();
    } catch (err) {
      console.error("[useDocumentsModule] error renaming document:", err);
      throw err;
    }
  };

  const moveDocument = async (id: string, folderId: string | null) => {
    try {
      const res = await fetch("/api/v1/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "move_document", id, folder_id: folderId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useDocumentsModule] moveDocument failed:", json.error);
        throw new Error(json.error?.message || "Failed to move document");
      }
      await mutate();
    } catch (err) {
      console.error("[useDocumentsModule] error moving document:", err);
      throw err;
    }
  };

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      const res = await fetch("/api/v1/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_favorite", id, is_favorite: isFavorite }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useDocumentsModule] toggleFavorite failed:", json.error);
        throw new Error(json.error?.message || "Failed to toggle favorite");
      }
      await mutate();
    } catch (err) {
      console.error("[useDocumentsModule] error toggling favorite:", err);
      throw err;
    }
  };

  const togglePin = async (id: string, isPinned: boolean) => {
    try {
      const res = await fetch("/api/v1/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_pin", id, is_pinned: isPinned }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useDocumentsModule] togglePin failed:", json.error);
        throw new Error(json.error?.message || "Failed to toggle pin");
      }
      await mutate();
    } catch (err) {
      console.error("[useDocumentsModule] error toggling pin:", err);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/documents?id=${id}&target=document`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useDocumentsModule] deleteDocument failed:", json.error);
        throw new Error(json.error?.message || "Failed to delete document");
      }
      await mutate();
    } catch (err) {
      console.error("[useDocumentsModule] error deleting document:", err);
      throw err;
    }
  };

  return {
    folders,
    documents,
    isLoading: isLoading && !data,
    error,
    createFolder,
    renameFolder,
    deleteFolder,
    createDocument,
    renameDocument,
    moveDocument,
    toggleFavorite,
    togglePin,
    deleteDocument,
    refresh: () => mutate(),
  };
}
