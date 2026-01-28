import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { SERVER, SWAGGER_PATH } from '../shared/constants/constant'

export const initSwagger = (app: INestApplication) => {
  const configService = app.get(ConfigService)
  const server = configService.get<string>(SERVER) ?? 'http://localhost:3010'
  const swaggerPath = configService.get<string>(SWAGGER_PATH) ?? 'docs'

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Onmi Grow')
    .setVersion('1.0.0')
    .setDescription('Esta es una API Creada con NestJS por Eduardo Gálvez M.')
    .addServer(`${server}`)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'method',
      filter: true,
      showRequestDuration: true
    }
  })
}
