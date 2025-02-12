import axiosInstance from '@/lib/axios/axiosInstance';

export const uploadImage = async (file: File): Promise<string[]> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await axiosInstance.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.imageUrls;
  } catch (e) {
    console.error('이미지 업로드 실패', e);
    throw e;
  }
};

export const getUploadUrl = async (filename: string) => {
  try {
    const { data } = await axiosInstance.get('/upload/url', {
      params: { filename },
    });
    return data;
  } catch (e) {
    console.error('업로드 url 생성 실패', e);
    throw e;
  }
};

export const uploadImageOnS3 = async ({
  file,
  url,
}: {
  file: File;
  url: string;
}) => {
  try {
    await axiosInstance.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  } catch (e) {
    console.error('이미지 업로드 실패', e);
    throw e;
  }
};
