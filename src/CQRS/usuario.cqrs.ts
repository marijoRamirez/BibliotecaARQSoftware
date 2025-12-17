import { Injectable } from '@nestjs/common';
import { UsuarioDao } from '../DAO/usuario.dao';
import { UsuarioEntity } from '../Entities/usuario.entity';

@Injectable()
export class UsuarioCqrs {
    constructor(private readonly usuarioDao: UsuarioDao) { }

    async ejecutarAlta(nombre: string, contrasena: string, rol: string): Promise<void> {
        const nuevoUsuario = new UsuarioEntity();
        nuevoUsuario.nombre_usuario = nombre;
        nuevoUsuario.contrasena = contrasena;
        nuevoUsuario.rol = rol;
        await this.usuarioDao.guardarUsuario(nuevoUsuario);
    }

    async ejecutarEdicion(id: number, nombre: string, contrasena: string, rol: string): Promise<void> {
        const usuario = await this.usuarioDao.obtenerPorId(id);
        if (!usuario) throw new Error('Usuario no encontrado');

        usuario.nombre_usuario = nombre;
        usuario.rol = rol;
        if (contrasena) usuario.contrasena = contrasena;

        await this.usuarioDao.guardarUsuario(usuario);
    }

    async ejecutarBaja(id: number): Promise<void> {
        await this.usuarioDao.eliminarUsuario(id);
    }
}