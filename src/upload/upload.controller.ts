import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('uploads')
export class UploadController {
  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '..', 'images/uploads', filename);

    // Verifica se o arquivo existe
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: 'Arquivo não encontrado' });
    }
  }
}
