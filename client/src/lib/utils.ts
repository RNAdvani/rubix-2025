import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const convertToBase64 = (file: File): Promise<string> => {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
   });
};

export const base64ToFile = (base64: string, fileName: string) => {
   // Extract the Base64 content without the data URL prefix
   const base64Content = base64.split(",")[1];

   // Decode the Base64 string to binary data
   const binaryData = atob(base64Content);

   // Create a Uint8Array for the binary data
   const byteArray = new Uint8Array(binaryData.length);
   for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i);
   }

   // Determine the MIME type from the Base64 string
   const mimeType =
      base64.match(/data:(.*?);base64/)?.[1] || "application/octet-stream";

   // Create and return the File object
   return new File([byteArray], fileName, { type: mimeType });
};
