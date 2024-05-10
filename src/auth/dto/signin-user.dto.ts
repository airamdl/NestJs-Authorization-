import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class SignInDto {

  @ApiProperty()
  @IsString({ 'message': 'Escriba un nombre válido.' })
  @Length(8, 20, { 'message': 'Nombre de usuario entre 8 y 20 caracteres' })
  username: string;

  @ApiProperty()
  @Length(8, 20, { 'message': 'Contraseña entre 8 y 20 caracteres' })
  password: string;

}