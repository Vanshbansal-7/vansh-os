export type FileType = 'PDF' | 'DOCX' | 'PNG' | 'JPG' | 'ZIP';

export type DocumentCategory =
  | 'Study Materials'
  | 'Placement'
  | 'Projects'
  | 'Certificates'
  | 'Personal'
  | 'College';

export interface DocumentFolder {
  id: string;
  name: string;
  item_count: number;
  parent_id?: string;
}

export interface UserDocument {
  id: string;
  folder_id?: string;
  name: string;
  path: string;
  type: FileType;
  category: DocumentCategory;
  size: string;
  modified_date: string;
  tags: string[];
  is_favorite?: boolean;
  is_pinned?: boolean;
  download_url?: string;
}
