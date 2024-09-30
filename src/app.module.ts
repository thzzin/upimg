import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ImagesModule } from './images/images.module'; // ajuste conforme necessário
import { UploadModule } from './upload/upload.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images/uploads'), // Ajuste para o caminho correto
      serveRoot: '/uploads/', // URL que você usará para acessar as imagens
    }),
    ImagesModule,
    UploadModule,
  ],
})
export class AppModule {}
