import { Test, TestingModule } from '@nestjs/testing'
import { LoggerService } from '../logger/logger.service'
import { MqttService } from '../mqtt/mqtt.service'
import { SensoresService } from '../sensores/sensores.service'
import { LecturasMqttService } from './lecturas-mqtt.service'
import { LecturasService } from './lecturas.service'

describe('LecturasMqttService', () => {
  let service: LecturasMqttService
  let lecturasService: Partial<LecturasService>
  let sensoresService: Partial<SensoresService>
  let mqttService: Partial<MqttService>

  beforeEach(async () => {
    lecturasService = {
      registrarLectura: jest.fn()
    }
    sensoresService = {
      findOneByDeviceAndType: jest.fn()
    }
    mqttService = {
      subscribe: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LecturasMqttService,
        { provide: MqttService, useValue: mqttService },
        { provide: LecturasService, useValue: lecturasService },
        { provide: SensoresService, useValue: sensoresService },
        {
          provide: LoggerService,
          useValue: {
            setContext: jest.fn(),
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn()
          }
        }
      ]
    }).compile()

    service = module.get<LecturasMqttService>(LecturasMqttService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should subscribe to mqtt on init', async () => {
    await service.onModuleInit()
    expect(mqttService.subscribe).toHaveBeenCalledWith('+/dispositivos/+/lecturas', expect.any(Function))
  })

  it('should process valid message and register reading', async () => {
    const payload = { device_id: 1, tipo: 'temp', valor: 25.5 }
    const message = Buffer.from(JSON.stringify(payload))
    const sensorMock = { id: 10, tipo: 'temp' } as any

    ;(sensoresService.findOneByDeviceAndType as jest.Mock).mockResolvedValue(sensorMock)

    await service.handleMessage('test/topic', message)

    expect(sensoresService.findOneByDeviceAndType).toHaveBeenCalledWith(1, 'temp')
    expect(lecturasService.registrarLectura).toHaveBeenCalledWith(10, 25.5)
  })

  it('should ignore message if sensor not found', async () => {
    const payload = { device_id: 999, tipo: 'unknown', valor: 25.5 }
    const message = Buffer.from(JSON.stringify(payload))

    ;(sensoresService.findOneByDeviceAndType as jest.Mock).mockResolvedValue(null)

    await service.handleMessage('test/topic', message)

    expect(sensoresService.findOneByDeviceAndType).toHaveBeenCalledWith(999, 'unknown')
    expect(lecturasService.registrarLectura).not.toHaveBeenCalled()
  })

  it('should invalid payload', async () => {
    const payload = { foo: 'bar' } // Missing required fields
    const message = Buffer.from(JSON.stringify(payload))

    await service.handleMessage('test/topic', message)

    expect(sensoresService.findOneByDeviceAndType).not.toHaveBeenCalled()
  })
})
