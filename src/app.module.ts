import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ActuadoresModule } from './actuadores/actuadores.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CamasModule } from './camas/camas.module'
import { ClimaModule } from './clima/clima.module'
import databaseConfig from './config/database.config'
import redisConfig from './config/redis.config'
import { CultivosModule } from './cultivos/cultivos.module'
import { DispositivosModule } from './dispositivos/dispositivos.module'
import { GpioModule } from './gpio/gpio.module'
import { IaModule } from './ia/ia.module'
import { LecturasModule } from './lecturas/lecturas.module'
import { LoggerModule } from './logger/logger.module'
import { MailModule } from './mail/mail.module'
import { MediosCultivoModule } from './medios-cultivo/medios-cultivo.module'
import { ModulosModule } from './modulos/modulos.module'
import { MqttModule } from './mqtt/mqtt.module'
import { NutricionModule } from './nutricion/nutricion.module'
import { PlantasModule } from './plantas/plantas.module'
import { ProductosModule } from './productos/productos.module'
import { RedisModule } from './redis/redis.module'
import { ReglasModule } from './reglas/reglas.module'
import { RolModule } from './rol/rol.module'
import { SalasModule } from './salas/salas.module'
import { SensoresModule } from './sensores/sensores.module'
import { UsuarioModule } from './usuario/usuario.module'
import { VariedadModule } from './variedad/variedad.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('database').config
    }),
    AuthModule,
    UsuarioModule,
    RolModule,
    ModulosModule,
    LoggerModule,
    MailModule,
    MqttModule,
    ActuadoresModule,
    CamasModule,
    ClimaModule,
    CultivosModule,
    DispositivosModule,
    GpioModule,
    IaModule,
    LecturasModule,
    MediosCultivoModule,
    NutricionModule,
    PlantasModule,
    ProductosModule,
    RedisModule,
    ReglasModule,
    SalasModule,
    SensoresModule,
    VariedadModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
