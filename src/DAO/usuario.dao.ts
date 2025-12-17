import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../Entities/usuario.entity';

@Injectable()
export class UsuarioDao {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,
    ) { }
    async validarCredenciales(usuario: string, contrasena: string): Promise<UsuarioEntity | null> {
        return await this.usuarioRepository.findOne({
        where: { nombre_usuario: usuario, contrasena: contrasena },
        });
    }

    async guardarUsuario(usuario: UsuarioEntity): Promise<UsuarioEntity> {
        return await this.usuarioRepository.save(usuario);
    }

    async listarUsuarios(): Promise<UsuarioEntity[]> {
    return await this.usuarioRepository.find();
    }

    async obtenerPorId(id: number): Promise<UsuarioEntity | null> {
        return await this.usuarioRepository.findOne({ where: { id_usuario: id } });
    }

    async eliminarUsuario(id: number): Promise<void> {
        await this.usuarioRepository.delete(id);
    }
}