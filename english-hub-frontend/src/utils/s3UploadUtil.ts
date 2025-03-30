import axiosInstance from '@/services/axiosInstance';
import axios from 'axios';

export async function getPresignedUrl(fileName: string): Promise<string> {
  const response = await axiosInstance.get('/s3/presigned-url', {
    params: { fileName },
  });
  return response.data.result;
}

export async function uploadFileToS3(
  file: File,
  presignedUrl: string
): Promise<string> {
  try {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
    return presignedUrl.split('?')[0];
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
}
