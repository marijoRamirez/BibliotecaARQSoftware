import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { LibroEntity } from '../Entities/libro.entity';

@Injectable()
export class LibroDao {
    constructor(
        @InjectRepository(LibroEntity)
        private readonly libroRepository: Repository<LibroEntity>,
    ) { }
    async consultarLibrosInternos(filtro: string): Promise<LibroEntity[]> {
        if (filtro) {
        return await this.libroRepository.find({
            where: { titulo: Like(`%${filtro}%`) },
        });
        }
        return await this.libroRepository.find();
    }

    async guardarLibro(libro: LibroEntity): Promise<LibroEntity> {
        return await this.libroRepository.save(libro);
    }

    async obtenerPorId(id: number): Promise<LibroEntity | null> {
        return await this.libroRepository.findOne({ where: { id_libro: id } });
    }

    async eliminarLibro(id: number): Promise<void> {
    await this.libroRepository.delete(id);
    }
}