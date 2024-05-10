import { SetMetadata } from '@nestjs/common';

// Identificador único para asociar el decorador con la lógica
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);