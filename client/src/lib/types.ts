export interface MediaFile {
   id: string;
   url: string;
   alt?: string;
   type: "image" | "video" | "audio";
   thumbnail?: string;
   timestamp?: number;
}
