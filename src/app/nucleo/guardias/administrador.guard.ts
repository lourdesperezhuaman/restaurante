import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion.service';

export const administradorGuard: CanActivateFn = (route, state) => {
  const autenticacionService = inject(AutenticacionService);
  const router = inject(Router);

  // aca verifica si el usuario es administrador
  if (autenticacionService.esAdministrador()) {
    return true; // Permitir acceso
  } else {
    // Redirigir al inicio si no es admin
    console.log('⚠️ Acceso denegado. Solo administradores.');
    router.navigate(['/']);
    return false;
  }
};