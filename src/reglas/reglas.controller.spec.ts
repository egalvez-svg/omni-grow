import { Test, TestingModule } from '@nestjs/testing'

import { ReglasController } from './reglas.controller'
import { ReglasService } from './reglas.service'

describe('ReglasController', () => {
  let controller: ReglasController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReglasController],
      providers: [ReglasService]
    }).compile()

    controller = module.get<ReglasController>(ReglasController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
