export interface FaceSwapRequest {
  source_img: string;
  target_img: string;
  input_faces_index: number;
  source_faces_index: number;
  face_restore: string;
  base64: boolean;
}

export interface UploadResponse {
  url: string;
}