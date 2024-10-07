import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Check if token exists in localStorage
  const token = localStorage.getItem('DisasterAppLogin');
  
  if (token) {
    // Token exists, allow access
    return true;
  } else {
    // No token, redirect to login page
    router.navigate(['/login']);
    return false;
  }
};
