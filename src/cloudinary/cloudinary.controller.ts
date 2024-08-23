import { CloudinaryService } from './cloudinary.service';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    console.log('ALL FILE:::', file);
    const result = await this.cloudinaryService.uploadImage(file.path);
    return result;
  }
}
