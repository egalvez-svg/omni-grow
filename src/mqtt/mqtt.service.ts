import { Injectable } from '@nestjs/common'

import * as mqtt from 'mqtt'

import { LoggerService } from '../logger/logger.service'

@Injectable()
export class MqttService {
  private client: mqtt.MqttClient
  private readonly url: string
  private readonly clientId: string

  constructor(private logger: LoggerService) {
    this.logger.setContext('MqttService')

    this.url = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883'
    this.clientId = process.env.MQTT_CLIENT_ID || 'clima-server'

    this.initializeClient()
  }

  private initializeClient() {
    this.client = mqtt.connect(this.url, {
      clientId: this.clientId,
      clean: true,
      reconnectPeriod: 5000,
      connectTimeout: 30 * 1000
    })

    let isFirstConnection = true
    this.client.on('connect', () => {
      if (isFirstConnection) {
        this.logger.log(`✅ Cliente MQTT conectado a ${this.url} (ID: ${this.clientId})`)
        isFirstConnection = false
      }
    })

    this.client.on('error', err => {
      this.logger.error(`Error MQTT: ${err.message}`, err.stack)
    })
  }

  async publish(topic: string, message: string | object): Promise<void> {
    const payload = typeof message === 'string' ? message : JSON.stringify(message)

    return new Promise((resolve, reject) => {
      this.client.publish(topic, payload, err => {
        if (err) {
          this.logger.error(`Error publicando en '${topic}': ${err.message}`, err.stack)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  async subscribe(topic: string, callback: (topic: string, message: Buffer) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.subscribe(topic, err => {
        if (err) {
          this.logger.error(`Error suscribiéndose a '${topic}': ${err.message}`, err.stack)
          reject(err)
        } else {
          this.logger.log(`✅ Suscrito a topic: ${topic}`)
          this.client.on('message', callback)
          resolve()
        }
      })
    })
  }

  getClient(): mqtt.MqttClient {
    return this.client
  }
}
