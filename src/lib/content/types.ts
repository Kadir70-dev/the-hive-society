export type ContentType =
  | "heading"
  | "text"
  | "paragraph"
  | "rich_text"
  | "button"
  | "label"
  | "caption"
  | "link";

export interface ContentRow {
  content_key: string;
  value: string;
}

export interface MediaRow {
  media_key: string;
  storage_path: string | null;
  alt_text: string | null;
  object_position: string | null;
}

export interface ResolvedMedia {
  url: string;
  alt: string;
  objectPosition: string;
}
