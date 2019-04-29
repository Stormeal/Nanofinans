import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { tap, map, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) { }
    canActivate(
    // ) {
        // if ( this.auth.isLoggedIn() ) {
        //     return true;
        // }
        // this.router.navigate(['/']);
        // return false;


        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): Observable<boolean> | Promise<boolean> | boolean {
        return this.auth.user$.pipe(
          take(1),
          map(user => !!user),
          tap(loggedIn => {
            if (!loggedIn) {
              console.log('access denied');
              this.router.navigate(['/login']);
            }
          })
        );
      }
    }
