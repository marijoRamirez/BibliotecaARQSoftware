import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')
export class UsuarioEntity {
    @PrimaryGeneratedColumn()
    id_usuario: number;

    @Column({ length: 50 })
    nombre_usuario: string;

    @Column({ length: 50 })
    contrasena: string;

    @Column({ length: 20 })
    rol: string;
}