import { Controller, Post, Body, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UsuarioDao } from '../DAO/usuario.dao';
import { UsuarioCqrs } from '../CQRS/usuario.cqrs';

@Controller('usuarios')
export class UsuarioController {
    constructor(
        private readonly usuarioDao: UsuarioDao, 
        private readonly usuarioCqrs: UsuarioCqrs  
    ) { }

    @Post('login')
    async login(@Body() body: any, @Res() res: Response) {
        const { usuario, password } = body;

        const userEncontrado = await this.usuarioDao.validarCredenciales(usuario, password);

        if (userEncontrado) {
            return res.status(HttpStatus.OK).json({
                mensaje: 'Login exitoso',
                usuario: userEncontrado.nombre_usuario,
                rol: userEncontrado.rol 
            });
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                mensaje: 'Credenciales inválidas'
            });
        }
    }

    @Post('crear')
    async crearUsuario(@Body() body: any, @Res() res: Response) {
        try {
            const { usuario, password, rol } = body;

            await this.usuarioCqrs.ejecutarAlta(usuario, password, rol);

            return res.status(HttpStatus.CREATED).json({ mensaje: 'Usuario creado' });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ mensaje: 'Error' });
        }
    }
    @Get()
    async listarUsuarios() {
        return await this.usuarioDao.listarUsuarios();
    }

    @Get()
    async obtenerTodos(@Res() res: Response) {
        try {
        const usuarios = await this.usuarioDao.listarUsuarios();
        return res.status(HttpStatus.OK).json(usuarios);
        } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ mensaje: 'Error al listar usuarios' });
        }
    }
}