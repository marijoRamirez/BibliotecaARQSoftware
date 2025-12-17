export class CrearLibroDto {
    titulo: string;
    genero: string;
    portadaBase64: string;
    pdfBase64: string;
}
export class LibroViewModel {
    id: number | string;

    titulo: string;
    genero: string;

    universidad: string;
    esExterno: boolean;
    portadaUrl: string;
}