import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import {UploadController} from '../upload/upload.controller'
@Module({
  controllers: [AudioController, UploadController],
  providers: [AudioService],
})
export class AudioModule {}
