import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LibroViewModel } from '../LibroViewModel/libro.dto';

@Injectable()
export class UtlApiService {
    constructor(private readonly httpService: HttpService) { }

    async getLibrosExternos(query: string): Promise<LibroViewModel[]> {
        const urlExterna = `http://10.16.14.52:8080/biblioteca/ApiLibrosController?accion=buscar&q=${query}`;

        try {
            console.log(`Consultando API externa: ${urlExterna}`);
            const response = await firstValueFrom(this.httpService.get(urlExterna));
            
            if(response.data && response.data.length > 0) {
                console.log("Campos en el LISTADO:", Object.keys(response.data[0]));
            }

            const librosMapeados: LibroViewModel[] = response.data.map((item: any) => ({
                id: item.id || item.id_libro || item.idLibro || 0,
                titulo: item.titulo || item.nombre || 'Sin título',
                genero: item.genero || 'Desconocido',
                
                portadaUrl: item.portadaBase64 ? 
                    (item.portadaBase64.startsWith('data:') ? item.portadaBase64 : `data:image/jpeg;base64,${item.portadaBase64}`) 
                    : '',

                universidad: 'Universidad Externa', 
                esExterno: true,
                
                pdfBase64: item.pdfBase64 || item.pdf || ''
            }));

            return librosMapeados;

        } catch (error) {
            console.error('Error conectando con API externa:', error.message);
            return [];
        }
    }

    async obtenerLibroExterno(idRemoto: string): Promise<any> {
        const url = `http://10.16.14.52:8080/biblioteca/LibroController?accion=verPdf&id=${idRemoto}&origen=Mi%20Universidad%20(Local)`;
        
        console.log(`--- PIDIENDO PDF A COMPAÑERO (ID: ${idRemoto}) ---`);

        try {
            const response = await firstValueFrom(this.httpService.get(url));
            const data = response.data;

            console.log("Campos recibidos en DETALLE:", Object.keys(data));
            const pdfRecibido = data.pdfBase64 || data.pdf || data.contenido || ''; 

            if (pdfRecibido) {
                return { 
                    pdfBase64: pdfRecibido, 
                    titulo: data.titulo || 'Libro Externo' 
                };
            }
            
            throw new Error(`El campo 'pdfBase64' vino vacío. Campos disponibles: ${Object.keys(data).join(', ')}`);

        } catch (error) {
            console.log(">>> USANDO MOCK DE EMERGENCIA <<<");

            const pdfMock = "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXwKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSCisgICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqCjw8IC9MZW5ndGggNDQggPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSG9sYSBNdW5kbyEgRXh0ZXJubykgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDExNCAwMDAwMCBuIAowMDAwMDAwMjI1IDAwMDAwIG4gCjAwMDAwMDAzMTIgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMzY1CiUlRU9GCg==";

            return {
                pdfBase64: pdfMock,
                titulo: 'Libro Externo (Demo Respaldo)'
            };
        }
    }
}