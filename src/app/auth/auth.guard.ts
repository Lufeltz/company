import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthGatewayService } from '../services/api-gateway/auth-gateway.service'; // Use AuthGatewayService

export const authGuard: CanActivateFn = (route, state) => {
  const authGatewayService = inject(AuthGatewayService);
  const router = inject(Router);
  const usuarioLogado = authGatewayService.getUser(); // Get the logged-in user from AuthGatewayService
  const role = authGatewayService.getRoleFromToken(); // Get role from token
  let url = state.url;

  if (usuarioLogado && role) {
    if (
      route.data?.['role'] &&
      route.data?.['role'].indexOf(role.toUpperCase()) === -1
    ) {
      // Se o perfil do usuário não está no perfil da rota
      // vai para login
      router.navigate(['/login'], {
        queryParams: { error: 'Proibido o acesso a ' + url },
      });
      return false;
    }
    // em qualquer outro caso, permite o acesso
    return true;
  }
  // Se não está logado, vai para login
  router.navigate(['/login'], {
    queryParams: {
      error: 'Deve fazer o login antes de acessar ' + url,
    },
  });
  return false;
};
