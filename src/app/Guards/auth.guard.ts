import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('access_token');
  if (!isLoggedIn) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
