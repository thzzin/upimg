import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as https from 'https';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Caminhos para os arquivos de certificado e chave privada
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/getluvia.com.br/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/getluvia.com.br/cert.pem', 'utf8'),
    ca: fs.readFileSync('/etc/letsencrypt/live/getluvia.com.br/chain.pem', 'utf8'), // Certificado da cadeia (se aplicável)
  };

  // Crie o servidor HTTPS com as opções SSL
  const server = https.createServer(httpsOptions, app.getHttpAdapter().getInstance());

  // Inicie o servidor na porta desejada (ex: 443 para HTTPS padrão)
  await server.listen(443, () => {
    console.log('Servidor rodando em https://getluvia.com.br');
  });
}

bootstrap();
