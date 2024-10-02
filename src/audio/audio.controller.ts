import { Controller, Post, Body } from '@nestjs/common';
import { AudioService } from './audio.service';

@Controller('audio')
export class AudioController {
  constructor(private readonly imagesService: AudioService) {}

  @Post('upload-from-whatsapp')
  async uploadFromWhatsApp(
    @Body('idAudio') idAudio: string,
    @Body('bearerToken') bearerToken: string,
  ) {
    const whatsAppImageUrl = await this.imagesService.getUrl(idAudio);

    const localImagePath = await this.imagesService.downloadWhatsAppAudio(
      whatsAppImageUrl,
      bearerToken,
    );

    const imageUrl = await this.imagesService.uploadToLocal(localImagePath);

    return { imageUrl };
  }
}
