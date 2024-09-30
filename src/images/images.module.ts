import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { UploadController } from '../upload/upload.controller';

@Module({
  controllers: [ImagesController, UploadController],
  providers: [ImagesService],
})
export class ImagesModule {}
