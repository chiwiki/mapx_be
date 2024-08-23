import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import cloudinary from 'src/configs/cloudinary.config';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    console.log('FILE:::', file);
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: 'map',
      });
      return result;
    } catch (error) {
      throw new Error('Failed to upload image to cludinary ');
    }
  }
}
