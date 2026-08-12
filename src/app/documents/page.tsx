"use client";

import React, { useState } from "react";
import { useDocumentsModule } from "@/hooks/use-documents-module";
import { DocumentsHeader } from "@/components/modules/documents/documents-header";
import { TopActionArea } from "@/components/modules/documents/top-action-area";
import { FoldersSection } from "@/components/modules/documents/folders-section";
import { DocumentsToolbar } from "@/components/modules/documents/documents-toolbar";
import { DocumentsTable } from "@/components/modules/documents/documents-table";
import { CreateFolderModal } from "@/components/modules/documents/create-folder-modal";
import { UploadDocumentModal } from "@/components/modules/documents/upload-document-modal";
import { RenameModal } from "@/components/modules/documents/rename-modal";
import { MoveDocumentModal } from "@/components/modules/documents/move-document-modal";
import { DocumentPreviewModal } from "@/components/modules/documents/document-preview-modal";
import { EmptyState } from "@/components/crud/empty-state";
import { UserDocument } from "@/types/document";

export default function DocumentsPage() {
  const {
    folders,
    documents,
    isLoading,
    createFolder,
    renameDocument,
    moveDocument,
    toggleFavorite,
    togglePin,
    createDocument,
    deleteDocument,
  } = useDocumentsModule();

  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortValue, setSortValue] = useState("Latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);

  // Modals state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<UserDocument | null>(null);
  const [renameTargetDoc, setRenameTargetDoc] = useState<UserDocument | null>(null);
  const [moveTargetDoc, setMoveTargetDoc] = useState<UserDocument | null>(null);

  const filteredDocuments = documents.filter((doc) => {
    if (selectedFolderId && doc.folder_id !== selectedFolderId) {
      return false;
    }
    if (searchValue && !doc.name.toLowerCase().includes(searchValue.toLowerCase())) {
      return false;
    }
    if (typeFilter !== "All" && doc.type !== typeFilter) {
      return false;
    }
    if (categoryFilter !== "All" && doc.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 w-full p-6 animate-pulse">
        <div className="h-10 bg-[#10131E] rounded-xl w-48" />
        <div className="h-44 bg-[#10131E] rounded-2xl w-full" />
        <div className="h-32 bg-[#10131E] rounded-2xl w-full" />
        <div className="h-64 bg-[#10131E] rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full pb-20 min-h-screen">
      {/* Action Modals */}
      <CreateFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSuccess={(name) => createFolder(name, selectedFolderId)}
      />

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={(docData) =>
          createDocument({ ...docData, folder_id: selectedFolderId })
        }
      />

      {renameTargetDoc && (
        <RenameModal
          isOpen={!!renameTargetDoc}
          initialName={renameTargetDoc.name}
          itemType="document"
          onClose={() => setRenameTargetDoc(null)}
          onSuccess={(newName) => renameDocument(renameTargetDoc.id, newName)}
        />
      )}

      {moveTargetDoc && (
        <MoveDocumentModal
          isOpen={!!moveTargetDoc}
          docName={moveTargetDoc.name}
          folders={folders}
          onClose={() => setMoveTargetDoc(null)}
          onSuccess={(targetFolderId) => moveDocument(moveTargetDoc.id, targetFolderId)}
        />
      )}

      <DocumentPreviewModal
        isOpen={!!previewDoc}
        doc={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />

      {/* 1. Page Header */}
      <DocumentsHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      {/* 2. Top Action Area */}
      <TopActionArea
        onNewFolder={() => setIsFolderModalOpen(true)}
        onUploadFile={() => setIsUploadModalOpen(true)}
      />

      {/* 3. My Folders Section */}
      <FoldersSection
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={(id) =>
          setSelectedFolderId(selectedFolderId === id ? undefined : id)
        }
        onNewFolder={() => setIsFolderModalOpen(true)}
      />

      {/* 4. All Documents Toolbar */}
      <DocumentsToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        sortValue={sortValue}
        onSortChange={setSortValue}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 5. All Documents Table or Empty State */}
      {documents.length === 0 ? (
        <EmptyState
          title="No documents uploaded yet"
          description="Upload your study materials, certificates, placement documents, or project notes to organize your document vault."
          actionLabel="+ Upload First Document"
          onAction={() => setIsUploadModalOpen(true)}
          icon="general"
        />
      ) : filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl bg-[#10131E] border border-dashed border-white/[0.08] w-full">
          <p className="text-xs font-semibold text-slate-400">No documents match the current folder or search filters.</p>
          <button
            onClick={() => {
              setSelectedFolderId(undefined);
              setSearchValue("");
              setTypeFilter("All");
              setCategoryFilter("All");
            }}
            className="mt-2 text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
          >
            Clear Selected Folder & Filters
          </button>
        </div>
      ) : (
        <DocumentsTable
          documents={filteredDocuments}
          onPreviewDoc={(doc) => setPreviewDoc(doc)}
          onRenameDoc={(doc) => setRenameTargetDoc(doc)}
          onMoveDoc={(doc) => setMoveTargetDoc(doc)}
          onToggleFavorite={toggleFavorite}
          onTogglePin={togglePin}
          onDeleteDoc={deleteDocument}
        />
      )}
    </div>
  );
}
