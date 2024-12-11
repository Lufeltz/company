import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthGatewayService } from '../services/api-gateway/auth-gateway.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authGatewayService = inject(AuthGatewayService);
  const router = inject(Router);
  const url = state.url;

  return new Observable<boolean>((observer) => {
    authGatewayService
      .loadUserData()
      .pipe(
        map(() => {
          const usuarioLogado = authGatewayService.getUser();
          const role = authGatewayService.getRoleFromToken();

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
              observer.next(false);
              observer.complete();
              return;
            }
            // em qualquer outro caso, permite o acesso
            observer.next(true);
            observer.complete();
            return;
          }

          // Se não está logado, vai para login
          router.navigate(['/login'], {
            queryParams: {
              error: 'Deve fazer o login antes de acessar ' + url,
            },
          });
          observer.next(false);
          observer.complete();
        }),
        catchError((error) => {
          console.error('Erro ao carregar dados do usuário:', error);
          router.navigate(['/login'], {
            queryParams: {
              error: 'Erro ao carregar dados do usuário. Tente novamente.',
            },
          });
          observer.next(false);
          observer.complete();
          return of(false);
        })
      )
      .subscribe();
  });
};
