// Get base URL from environment variable
export const url = import.meta.env.VITE_BASE_URL || "https://timothy-backend.onrender.com/api/v1";

// Extract the base domain from the API URL for images and WebSocket
const baseUrlObj = new URL(url.replace('/api/v1', ''));
export const imgUrl = baseUrlObj.origin + '/';

// 🔥 WebSocket base URL - use wss:// for Render.com and other HTTPS hosts
const wsProtocol = baseUrlObj.protocol === "https:" ? "wss" : "ws";
export const wsUrl = `${wsProtocol}://${baseUrlObj.host}`;

// Function to get the base API URL
export const getBaseUrl = () => url;

// Function to get the image base URL
export const getImageBaseUrl = () => imgUrl;

// Function to get the WebSocket base URL
export const getWsBaseUrl = () => wsUrl;

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  // If it's already a full URL, return as-is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Remove trailing slash from base and leading slash from path
  const base = imgUrl.replace(/\/+$/, "");
  const path = imagePath.replace(/^\/+/, "");

  const finalUrl = `${base}/${path}`;
  // console.log("Image URL:", finalUrl);

  return finalUrl;
};
