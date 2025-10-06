
export interface GroundingSource {
  uri: string;
  title: string;
}

export interface UploadedFile {
  name: string;
  type: string;
  data: string; // base64 encoded data
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: GroundingSource[];
  files?: UploadedFile[];
}