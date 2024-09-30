import { Controller, Post, Body } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload-from-whatsapp')
  async uploadFromWhatsApp(
    @Body('idImage') idImage: string,
    @Body('bearerToken') bearerToken: string,
  ) {
    const whatsAppImageUrl = await this.imagesService.getUrl(idImage);

    const localImagePath = await this.imagesService.downloadWhatsAppImage(
      whatsAppImageUrl,
      bearerToken,
    );

    const imageUrl = await this.imagesService.uploadToLocal(localImagePath);

    return { imageUrl };
  }
}
