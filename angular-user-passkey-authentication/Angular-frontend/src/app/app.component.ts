// ./src/app/app.component.ts

import { Component } from '@angular/core';
import { AuthService, User } from './auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'passkeys-app-angular';
  user: User = {
    id: '',
    name: '',
    displayName: '',
  };

  constructor(private authService: AuthService, private router: Router) {
    router.events.subscribe((val) => {
      this.user = this.authService.userData;
      console.log({
        user: this.user,
        val,
        userData: this.authService.userData,
      });
    });
  }

  async ngOnInit(): Promise<void> {
    // get user data when component loads
    this.user = await this.authService.userInfo();
    console.log({ user: this.user });
  }

  async logOut() {
    this.authService.logOut();
    // call loggedIn frunction to update auth service state
    await this.authService.isLoggedin();
    // update component user state
    this.user = await this.authService.userInfo();
    this.router.navigate(['/login']);
  }
}
