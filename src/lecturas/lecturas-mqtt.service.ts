import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common'
import { LoggerService } from '../logger/logger.service'
import { MqttService } from '../mqtt/mqtt.service'
import { SensoresService } from '../sensores/sensores.service'
import { LecturasService } from './lecturas.service'

@Injectable()
export class LecturasMqttService implements OnModuleInit {
  constructor(
    private mqttService: MqttService,
    private lecturasService: LecturasService,
    @Inject(forwardRef(() => SensoresService))
    private sensoresService: SensoresService,
    private logger: LoggerService
  ) {
    this.logger.setContext('LecturasMqttService')
  }

  async onModuleInit() {
    this.logger.log('Inicializando suscripciones MQTT para lecturas...')
    await this.mqttService.subscribe('+/dispositivos/+/lecturas', this.handleMessage.bind(this))
  }

  async handleMessage(topic: string, message: Buffer) {
    try {
      const payload = JSON.parse(message.toString())
      this.logger.log(`Mensaje recibido en ${topic}: ${JSON.stringify(payload)}`)

      // Payload esperado: { device_id: number, tipo: string, valor: number, ... }
      const { device_id, tipo, valor } = payload

      if (!device_id || !tipo || valor === undefined) {
        this.logger.warn(`Payload inválido recibido en ${topic}: Faltan campos requeridos`)
        return
      }

      const sensor = await this.sensoresService.findOneByDeviceAndType(device_id, tipo)

      if (!sensor) {
        this.logger.warn(`No se encontró sensor para Device ${device_id} y Tipo ${tipo}`)
        return
      }

      await this.lecturasService.registrarLectura(sensor.id, Number(valor))
      this.logger.log(`Lectura registrada para sensor ${sensor.id} (${tipo}): ${valor}`)

      // Si es temperatura o humedad, calcular y guardar VPD si existe sensor VPD
      if (tipo.toLowerCase().includes('temp') || tipo.toLowerCase().includes('hum')) {
        await this.calcularYGuardarVPD(device_id)
      }
    } catch (error) {
      this.logger.error(`Error procesando mensaje MQTT en ${topic}: ${error.message}`, error.stack)
    }
  }

  private calcularVPD(temperatura: number, humedadRelativa: number): number {
    const svp = 0.61078 * Math.exp((17.27 * temperatura) / (temperatura + 237.3))
    const avp = svp * (humedadRelativa / 100)
    const vpd = svp - avp
    return Math.round(vpd * 100) / 100
  }

  private async calcularYGuardarVPD(deviceId: number) {
    try {
      // Buscar sensores de temperatura, humedad y VPD para este dispositivo
      const sensoresDispositivo = await this.sensoresService.findByDevice(deviceId)

      const tempSensor = sensoresDispositivo.find(s => s.tipo.toLowerCase().includes('temp'))
      const humSensor = sensoresDispositivo.find(s => s.tipo.toLowerCase().includes('hum'))
      const vpdSensor = sensoresDispositivo.find(s => s.tipo.toLowerCase().includes('vpd'))

      if (tempSensor && humSensor && vpdSensor) {
        // Obtener últimas lecturas
        const tempLectura = await this.lecturasService.obtenerUltimaLectura(tempSensor.id)
        const humLectura = await this.lecturasService.obtenerUltimaLectura(humSensor.id)

        if (tempLectura && humLectura) {
          const vpdValue = this.calcularVPD(Number(tempLectura.valor), Number(humLectura.valor))
          await this.lecturasService.registrarLectura(vpdSensor.id, vpdValue)
          this.logger.log(`VPD calculado y registrado para dispositivo ${deviceId}: ${vpdValue} kPa`)
        }
      }
    } catch (error) {
      this.logger.error(`Error calculando VPD para dispositivo ${deviceId}: ${error.message}`)
    }
  }
}
