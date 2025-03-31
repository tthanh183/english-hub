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

export async function deleteFileFromS3(fileUrl: string): Promise<void> {
  try {
    await axios.delete(fileUrl);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new Error('Failed to delete file from S3');
  }
}
