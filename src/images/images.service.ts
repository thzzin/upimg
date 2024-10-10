import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImagesService {
  async getUrl(idImage: string): Promise<string> {
    const token = 'EAAPQis7WA0sBO7hpYbDoUnJVk75Mz2hZA59tze8HQ4Yrdqw8R40a8d2gQFmMvzAm0i7gyASQnhCaJAw01aeRL6bFnthAr6Y02Bmlz8aUFmJJRnnLfUINBtj8X2bP28ZCNY9sRxbzJBd59BZArSoftPv1LH6ZBT8KZAxOiwQGuG305se3it1ZCaMgt0KAkymKx0XwZDZD'; // Substitua por seu token

    try {
      const response = await axios.get(
        `https://graph.facebook.com/v20.0/${idImage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data.url) {
        throw new Error('URL não encontrada na resposta da API');
      }
      return response.data.url;
    } catch (error) {
      console.error('Erro ao buscar a URL da imagem:', error.message);
      throw new Error('Não foi possível obter a URL da imagem');
    }
  }

  async downloadWhatsAppImage(url: string, token: string): Promise<string> {
    const uploadDir = path.join(__dirname, '..', 'images/uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const localImagePath = path.join(uploadDir, `image_${timestamp}`); // Nome do arquivo sem extensão por enquanto

    try {
      const response = await axios.get(url, {
        responseType: 'stream',
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });

      const mimeType = response.headers['content-type']; // Obtém o tipo MIME da resposta
      const fileExtension = this.getFileExtension(mimeType); // Obtém a extensão correspondente
      const finalImagePath = localImagePath + fileExtension; // Cria o caminho final com a extensão

      const writer = fs.createWriteStream(finalImagePath);

      return new Promise((resolve, reject) => {
        response.data.pipe(writer);
        writer.on('finish', () => {
          resolve(finalImagePath);
        });
        writer.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      console.error('Erro na requisição Axios:', error.message);
      throw new Error('Erro ao baixar a imagem');
    }
  }

  private getFileExtension(mimeType: string): string {
    const mimeMap: { [key: string]: string } = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      // Adicione mais tipos MIME conforme necessário
    };

    return mimeMap[mimeType] || '.jpg'; // Retorna .jpg como padrão se o tipo não for reconhecido
  }

  async uploadToLocal(localImagePath: string): Promise<string> {
    if (!fs.existsSync(localImagePath)) {
      throw new Error('O caminho da imagem não existe: ' + localImagePath);
    }

    const baseUrl = 'http://getluvia.com.br:3003/uploads';
    const fileName = path.basename(localImagePath);
    const res = `${baseUrl}/${fileName}`;
    return res;
  }
}
