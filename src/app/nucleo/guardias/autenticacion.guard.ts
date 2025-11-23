import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion.service';

export const autenticacionGuard: CanActivateFn = (route, state) => {
  const autenticacionService = inject(AutenticacionService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  if (autenticacionService.estaAutenticado()) {
    return true; // Permitir acceso
  } else {
    // Redirigir al login
    console.log('⚠️ Acceso denegado. Redirigiendo al login...');
    router.navigate(['/login']);
    return false;
  }
};