import * as dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  try {
    const authService = app.get(AuthService);
    await authService.register('admin@zeta.com', 'password123');
    console.log('Admin user seeded');
  } catch (e) {
    // Ignore if already exists
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`NestJS running on port ${port}`);
}
bootstrap();
