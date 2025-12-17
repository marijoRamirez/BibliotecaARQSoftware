import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroEntity } from './Entities/libro.entity';
import { UsuarioEntity } from './Entities/usuario.entity';
import { LibroDao } from './DAO/libro.dao';
import { UsuarioDao } from './DAO/usuario.dao';
import { LibroCqrs } from './CQRS/libro.cqrs';
import { UsuarioCqrs } from './CQRS/usuario.cqrs';
import { UtlApiService } from './ApiService/utlapi.service'
import { LibroController } from './Controller/libro.controller';
import { UsuarioController } from './Controller/usuario.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'biblioteca_universal',
      entities: [LibroEntity, UsuarioEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([LibroEntity, UsuarioEntity]),
  ],
  controllers: [LibroController, UsuarioController],
  providers: [
    LibroDao, 
    UsuarioDao, 
    LibroCqrs, 
    UsuarioCqrs, 
    UtlApiService
  ],
})
export class AppModule {}