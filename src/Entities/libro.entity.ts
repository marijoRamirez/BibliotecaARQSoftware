import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('libros')
export class LibroEntity {
    @PrimaryGeneratedColumn()
    id_libro: number;

    @Column({ length: 100 })
    titulo: string;

    @Column({ length: 50 })
    genero_literario: string;
    
    @Column({ type: 'longtext', nullable: true })
    portada_base64: string;

    @Column({ type: 'longtext', nullable: true })
    pdf_base64: string;
}
