import { Injectable } from '@nestjs/common';
import { LibroDao } from '../DAO/libro.dao';
import { LibroEntity } from '../Entities/libro.entity';
import { CrearLibroDto } from '../LibroViewModel/libro.dto';

@Injectable()
export class LibroCqrs {
    constructor(private readonly libroDao: LibroDao) { }

    async ejecutarAlta(dto: CrearLibroDto): Promise<void> {
        const nuevoLibro = new LibroEntity();
        nuevoLibro.titulo = dto.titulo;
        nuevoLibro.genero_literario = dto.genero;
        nuevoLibro.portada_base64 = dto.portadaBase64;
        nuevoLibro.pdf_base64 = dto.pdfBase64;
        await this.libroDao.guardarLibro(nuevoLibro);
    }

    async ejecutarEdicion(id: number, dto: CrearLibroDto): Promise<void> {
        const libroExistente = await this.libroDao.obtenerPorId(id);
        if (!libroExistente) throw new Error('Libro no encontrado');

        libroExistente.titulo = dto.titulo;
        libroExistente.genero_literario = dto.genero;

        if (dto.portadaBase64) libroExistente.portada_base64 = dto.portadaBase64;
        if (dto.pdfBase64) libroExistente.pdf_base64 = dto.pdfBase64;

        await this.libroDao.guardarLibro(libroExistente);
    }

    async ejecutarBaja(id: number): Promise<void> {
        await this.libroDao.eliminarLibro(id);
    }
}