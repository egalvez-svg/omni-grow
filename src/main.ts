import { DataSource } from 'typeorm'

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { setDataPerfil } from './config/insert-admin'
import { initSwagger } from './config/swagger.config'
import { LoggerService } from './logger/logger.service'
import { PORT } from './shared/constants/constant'
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = app.get(LoggerService)
  const configService = app.get(ConfigService)
  const dataSource = app.get(DataSource)
  const port = configService.get<number>(PORT) ?? 3069
  const nodeEnv = process.env.NODE_ENV ?? 'dev'

  await setDataPerfil(dataSource)
  // Inicializar Swagger solo en dev y qa
  if (nodeEnv === 'dev' || nodeEnv === 'qa') {
    initSwagger(app)
  }

  // Configurar CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,PUT,POST,DELETE,PATCH'
  })

  // Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  app.useGlobalFilters(new AllExceptionsFilter(logger))

  app.useLogger(logger)

  // Levantar servidor
  await app.listen(port)
  logger.log(`Server is running on ${await app.getUrl()}`)
}

bootstrap().catch(err => {
  console.error('Failed to start the app:', err)
  process.exit(1)
})
