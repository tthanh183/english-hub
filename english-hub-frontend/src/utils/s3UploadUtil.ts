import axios from 'axios';

import axiosInstance from '@/services/axiosInstance';

export async function getPresignedUrl(fileName: string): Promise<string> {
  try {
    const response = await axiosInstance.get('/s3/presigned-url', {
      params: { fileName },
    });
    return response.data.result;
  } catch (error) {
    console.error('Error fetching presigned URL:', error);
    throw new Error('Failed to fetch presigned URL');
  }
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
