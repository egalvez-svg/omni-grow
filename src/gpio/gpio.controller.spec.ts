import { Test, TestingModule } from '@nestjs/testing'

import { GpioController } from './gpio.controller'
import { GpioService } from './gpio.service'

describe('GpioController', () => {
  let controller: GpioController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GpioController],
      providers: [GpioService]
    }).compile()

    controller = module.get<GpioController>(GpioController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
