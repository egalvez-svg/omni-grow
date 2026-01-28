import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ActuadoresService } from '../actuadores/actuadores.service'
import { LoggerService } from '../logger/logger.service'
import { MqttService } from '../mqtt/mqtt.service'
import { SensoresService } from '../sensores/sensores.service'
import { Regla } from './entities/regla.entity'
import { ReglasService } from './reglas.service'

describe('ReglasService Sync', () => {
  let service: ReglasService
  let mqttService: Partial<MqttService>
  let repo: any

  beforeEach(async () => {
    mqttService = {
      publish: jest.fn()
    }
    repo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(r => Promise.resolve({ ...r, id: 1 })),
      remove: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReglasService,
        { provide: getRepositoryToken(Regla), useValue: repo },
        { provide: SensoresService, useValue: {} },
        { provide: ActuadoresService, useValue: {} },
        { provide: MqttService, useValue: mqttService },
        {
          provide: LoggerService,
          useValue: {
            setContext: jest.fn(),
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn()
          }
        }
      ]
    }).compile()

    service = module.get<ReglasService>(ReglasService)
  })

  it('should sync rules upon creation', async () => {
    const createDto = {
      nombre: 'Test Rule',
      tipo: 'sensor',
      sensorId: 10,
      actuadorId: 20,
      comparador: '>',
      valor_trigger: 30,
      accion: 'encender'
    } as any

    // Mock findOne to return the rule with relationships for triggerSync extraction
    repo.findOne.mockResolvedValue({
      id: 1,
      sensor: { gpio: { dispositivo: { id: 99 } } },
      actuador: { gpio: { dispositivo: { id: 99 } } }
    })

    // Mock find for sincronizarReglas
    repo.find.mockResolvedValue([
      {
        id: 1,
        nombre: 'Test Rule',
        tipo: 'sensor',
        sensor: { id: 10, gpio: { pin: 5 } },
        actuador: { id: 20, gpio: { pin: 6 } }
      }
    ])

    await service.create(createDto)

    expect(repo.save).toHaveBeenCalled()
    expect(mqttService.publish).toHaveBeenCalledWith('dispositivos/99/reglas', expect.any(Object))
  })
})
