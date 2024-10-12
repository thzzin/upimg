import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AudioService {
  async getUrl(idAudio: string, token: string): Promise<string> {
    console.log('vai chamar passando', idAudio, token)
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v20.0/${idAudio}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data.url) {
        throw new Error('URL não encontrada na resposta da API');
      }
      console.log(response.data.url)
      return response.data.url;
    } catch (error) {
      //console.error('Erro ao buscar a URL da imagem:', error.message);
      throw new Error('Não foi possível obter a URL da imagem');
    }
  }

  async downloadWhatsAppAudio(url: string, token: string): Promise<string> {
    const uploadDir = path.join(__dirname, '..', 'images/uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const fileName = `audio_${timestamp}.ogg`; // Alterado para .ogg
    const localAudioPath = path.join(uploadDir, fileName);

    try {
        const response = await axios.get(url, {
            responseType: 'stream',
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${token}`,
            },
        });

        const writer = fs.createWriteStream(localAudioPath);

        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            writer.on('finish', () => {
                resolve(localAudioPath);
            });
            writer.on('error', (error) => {
                reject(error);
            });
        });
    } catch (error) {
        console.error('Erro na requisição Axios:', error.message);
        throw new Error('Erro ao baixar o áudio');
    }
  }

  async uploadToLocal(localImagePath: string): Promise<string> {
    if (!fs.existsSync(localImagePath)) {
      throw new Error('O caminho da imagem não existe: ' + localImagePath);
    }

    const baseUrl = 'https://getluvia.com.br:3003/uploads';
    const fileName = path.basename(localImagePath);
    const res = `${baseUrl}/${fileName}`;
    return res;
  }
}
