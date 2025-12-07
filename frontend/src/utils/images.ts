import { API_BASE_URL } from "@/services/config";

export function getImageUrl(imagePath: string): string {
  if (!imagePath) {
    return "";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, "");
  let path = imagePath.startsWith("/") ? imagePath : `/public/img/${imagePath}`;
  
  if (!path.includes(".") && !path.endsWith("/")) {
    path += ".svg";
  }
  
  return `${baseUrl}${path}`;
}

