import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImagesService {
  async getUrl(idImage: string , token: string): Promise<string> {
    //const token = 'EAAPQis7WA0sBO7hpYbDoUnJVk75Mz2hZA59tze8HQ4Yrdqw8R40a8d2gQFmMvzAm0i7gyASQnhCaJAw01aeRL6bFnthAr6Y02Bmlz8aUFmJJRnnLfUINBtj8X2bP28ZCNY9sRxbzJBd59BZArSoftPv1LH6ZBT8KZAxOiwQGuG305se3it1ZCaMgt0KAkymKx0XwZDZD'; // Substitua por seu token

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
    const localImagePath = path.join(uploadDir, `image_${timestamp}`); // Nome do arquivo sem extensão

    try {
        const response = await axios.get(url, {
            responseType: 'stream',
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${token}`,
            },
        });

        const mimeType = response.headers['content-type']; // Obtém o tipo MIME da resposta
        console.log('Tipo MIME obtido:', mimeType); // Log para verificar o MIME type

        const fileExtension = this.getFileExtension(mimeType); // Obtém a extensão correspondente
        console.log('Extensão do arquivo:', fileExtension); // Log para verificar a extensão

        const finalImagePath = localImagePath + fileExtension; // Cria o caminho final com a extensão
        console.log('Caminho final da imagem:', finalImagePath); // Log para verificar o caminho final

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
    // Remove o charset e outros parâmetros
    const mainMimeType = mimeType.split(';')[0].trim(); 

    const mimeMap: { [key: string]: string } = {
        // Tipos de Áudio
        'audio/aac': '.aac',
        'audio/amr': '.amr',
        'audio/mpeg': '.mp3',
        'audio/mp4': '.m4a',
        'audio/ogg': '.ogg',

        // Tipos de Documento
        'text/plain': '.txt',
        'application/vnd.ms-excel': '.xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'application/vnd.ms-powerpoint': '.ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
        'application/pdf': '.pdf',

        // Tipos de Imagem
        'image/jpeg': '.jpeg',
        'image/png': '.png',
        'image/webp': '.webp',

        // Tipos de Vídeo
        'video/3gp': '.3gp',
        'video/mp4': '.mp4',
    };

    return mimeMap[mainMimeType] || '.jpg'; // Retorna .jpg como padrão se o tipo não for reconhecido
}



  async uploadToLocal(localImagePath: string): Promise<string> {
    if (!fs.existsSync(localImagePath)) {
      throw new Error('O caminho da imagem não existe: ' + localImagePath);
    }

    const baseUrl = 'https://getluvia.com.br:3003/uploads';
    const fileName = path.basename(localImagePath);
    const res = `${baseUrl}/${fileName}`;
    console.log('res', res)
    return res;
  }
}
