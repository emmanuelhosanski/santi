import { API_CONFIG } from '../config';
import { APIError } from '../utils/errors';
import type { FaceSwapRequest } from '../types';

async function uploadImage(base64Image: string): Promise<string> {
  // Convert base64 to blob
  const base64Response = await fetch(base64Image);
  const blob = await base64Response.blob();

  // Create form data
  const formData = new FormData();
  formData.append('image', blob);

  // Upload to ImgBB
  const response = await fetch('https://api.imgbb.com/1/upload?key=0942edaa5f98ea44bfb95e1f6f797839', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new APIError('Failed to upload image');
  }

  const data = await response.json();
  return data.data.url;
}

export async function performFaceSwap(request: FaceSwapRequest): Promise<Blob> {
  // Convert base64 source image to URL
  const sourceUrl = await uploadImage(request.source_img);

  const apiRequest = {
    ...request,
    source_img: sourceUrl,
    base64: false
  };

  const response = await fetch(API_CONFIG.SEGMIND_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_SEGMIND_API_KEY
    },
    body: JSON.stringify(apiRequest)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new APIError(error.error || 'Failed to perform face swap');
  }

  return response.blob();
}