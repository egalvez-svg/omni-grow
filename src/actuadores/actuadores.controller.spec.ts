import { Test, TestingModule } from '@nestjs/testing'

import { ActuadoresController } from './actuadores.controller'
import { ActuadoresService } from './actuadores.service'

describe('ActuadoresController', () => {
  let controller: ActuadoresController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActuadoresController],
      providers: [ActuadoresService]
    }).compile()

    controller = module.get<ActuadoresController>(ActuadoresController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
