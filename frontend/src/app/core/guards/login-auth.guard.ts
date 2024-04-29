import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginAuthGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).isLoggedIn()) {
    inject(Router).navigate(['/novel']);
    return false;
  } else {
    return true;
  }
};
