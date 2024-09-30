import { Controller, Get, Param, Res } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import type { Response } from 'express';

@Controller('uploads')
export class UploadController {
  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'images/uploads', filename);
    const file = createReadStream(filePath);
    file.pipe(res);
  }
}
