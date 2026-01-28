import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modulo } from './entities/modulo.entity';
import { CreateModuloDto, UpdateModuloDto } from './dto/modulos.dto';

@Injectable()
export class ModulosService {
    constructor(
        @InjectRepository(Modulo)
        private readonly moduloRepo: Repository<Modulo>,
    ) { }

    async create(createModuloDto: CreateModuloDto): Promise<Modulo> {
        const nuevo = this.moduloRepo.create(createModuloDto);
        return await this.moduloRepo.save(nuevo);
    }

    async findAll(): Promise<Modulo[]> {
        return await this.moduloRepo.find();
    }

    async findOne(id: number): Promise<Modulo> {
        const modulo = await this.moduloRepo.findOneBy({ id });
        if (!modulo) throw new NotFoundException(`Modulo #${id} no encontrado`);
        return modulo;
    }

    async findBySlug(slug: string): Promise<Modulo> {
        const modulo = await this.moduloRepo.findOneBy({ slug });
        if (!modulo) throw new NotFoundException(`Modulo con slug ${slug} no encontrado`);
        return modulo;
    }

    async update(id: number, updateModuloDto: UpdateModuloDto): Promise<Modulo> {
        const modulo = await this.findOne(id);
        Object.assign(modulo, updateModuloDto);
        return await this.moduloRepo.save(modulo);
    }

    async remove(id: number): Promise<void> {
        const modulo = await this.findOne(id);
        await this.moduloRepo.remove(modulo);
    }
}
