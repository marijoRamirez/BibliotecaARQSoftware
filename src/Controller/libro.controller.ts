import { Controller, Get, Post, Body, Query, Res, HttpStatus, Delete, Put, Param } from '@nestjs/common';
import { Response } from 'express'; // Necesario para manejar respuestas HTTP
import { LibroDao } from '../DAO/libro.dao';
import { LibroCqrs } from '../CQRS/libro.cqrs';
import { UtlApiService } from '../ApiService/utlapi.service';
import { CrearLibroDto, LibroViewModel } from '../LibroViewModel/libro.dto';

@Controller('libros')
export class LibroController {
    constructor(
        private readonly libroDao: LibroDao,
        private readonly libroCqrs: LibroCqrs,
        private readonly apiService: UtlApiService
    ) { }


    @Get('buscar')
    async buscarLibros(@Query('q') query: string): Promise<any[]> {
        const termino = query || '';

        const librosLocalesEntidad = await this.libroDao.consultarLibrosInternos(termino);

        const librosLocalesVM = librosLocalesEntidad.map(libro => ({
            id: libro.id_libro,
            titulo: libro.titulo,
            genero: libro.genero_literario,
            universidad: 'UTL (Local)',
            esExterno: false,
            portadaUrl: libro.portada_base64,
            pdfBase64: libro.pdf_base64
        }));

        const librosExternosVM = await this.apiService.getLibrosExternos(termino);

        return [...librosLocalesVM, ...librosExternosVM];
    }

    @Post('crear')
    async registrarLibro(@Body() dto: CrearLibroDto, @Res() res: Response) {
        try {
            await this.libroCqrs.ejecutarAlta(dto);

            return res.status(HttpStatus.CREATED).json({
                mensaje: 'Libro registrado correctamente en el catálogo interno.'
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                mensaje: 'Error al registrar el libro',
                error: error.message
            });
        }
    }

    @Get('ver-pdf')
    async verPdf(
        @Query('id') id: string,
        @Query('externo') externo: string,
        @Res() res: Response
    ) {
        const esExterno = externo === 'true';
        if (esExterno) {
            console.log(`Solicitando libro externo ID: ${id}`);

            const libroExterno = await this.apiService.obtenerLibroExterno(id);

            if (libroExterno && libroExterno.pdfBase64) {
                return res.status(HttpStatus.OK).json({
                    titulo: libroExterno.titulo,
                    pdfBase64: libroExterno.pdfBase64
                });
            } else {
                return res.status(HttpStatus.NOT_FOUND).json({
                    mensaje: 'No se pudo recuperar el PDF de la universidad externa.'
                });
            }
        }
        const idLocal = parseInt(id);
        const libro = await this.libroDao.obtenerPorId(idLocal);

        if (libro && libro.pdf_base64) {
            return res.status(HttpStatus.OK).json({
                titulo: libro.titulo,
                pdfBase64: libro.pdf_base64
            });
        }

        return res.status(HttpStatus.NOT_FOUND).json({
            mensaje: 'El libro local no tiene PDF adjunto o no existe.'
        });
    }
    @Get(':id')
    async obtenerLibro(@Param('id') id: number, @Res() res: Response) {
        const libro = await this.libroDao.obtenerPorId(id);
        if (!libro) return res.status(HttpStatus.NOT_FOUND).json({ mensaje: 'No existe' });
        return res.json({
            id: libro.id_libro,
            titulo: libro.titulo,
            genero: libro.genero_literario,
            portadaUrl: libro.portada_base64
        });
    }

    @Put('editar/:id')
    async editarLibro(@Param('id') id: number, @Body() dto: CrearLibroDto, @Res() res: Response) {
        try {
            await this.libroCqrs.ejecutarEdicion(id, dto);
            return res.status(HttpStatus.OK).json({ mensaje: 'Libro actualizado' });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ mensaje: 'Error al editar', error: error.message });
        }
    }

    @Delete('eliminar/:id')
    async eliminarLibro(@Param('id') id: number, @Res() res: Response) {
        try {
            await this.libroCqrs.ejecutarBaja(id);
            return res.status(HttpStatus.OK).json({ mensaje: 'Libro eliminado' });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ mensaje: 'Error al eliminar' });
        }

    }

}