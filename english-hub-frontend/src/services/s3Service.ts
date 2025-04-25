import axiosInstance from './axiosInstance';

export async function uploadFileToS3(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axiosInstance.post('/s3/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.result;
}

export async function deleteFileFromS3(fileUrl: string): Promise<string> {
  const response = await axiosInstance.delete('/s3/delete', {
    data: { fileName: fileUrl.substring(fileUrl.lastIndexOf('/') + 1) },
  });

  return response.data.message;
}
