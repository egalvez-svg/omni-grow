import { Test, TestingModule } from '@nestjs/testing'

import { ActuadoresService } from './actuadores.service'

describe('ActuadoresService', () => {
  let service: ActuadoresService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActuadoresService]
    }).compile()

    service = module.get<ActuadoresService>(ActuadoresService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
