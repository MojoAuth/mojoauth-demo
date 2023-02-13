// ./src/app/login/login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { startAuthentication } from '@simplewebauthn/browser';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  API = environment.api;
  username = this.authService.userData.name || '';
  assertionResponse = {};
  isLoading = false;

  constructor(private router: Router, private authService: AuthService) {}

  // function to update username
  updateUsername(event: any) {
    this.username = event.target.value;
    console.log({ username: this.username });
  }

  // function to generate authentication options
  async generateAuthenticationOptions() {
    try {
      const res = await fetch(
        `${this.API}/generate-authentication-options?username=${this.username}`
      );
      const authOptions = await res.json();

      console.log({ authOptions });

      try {
        this.assertionResponse = await startAuthentication(authOptions);
        console.log({ assertionResponse: this.assertionResponse });
      } catch (error) {
        console.log({ error });
        throw error;
      }
    } catch (error) {
      console.log({ error });
    }
  }

  // function to verify authentication
  async verifyAuthentication() {
    try {
      const res = await fetch(`${this.API}/verify-authentication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.username,
          assertionResponse: this.assertionResponse,
        }),
      });

      const data = await res.json();

      // if authentication is successful, set user data and call the redirect function
      if (data.verified) {
        this.authService.userData = {
          id: data.user.id,
          name: data.user.username,
          displayName: data.user.username,
        };
        alert(`Authentication successful! Welcome back ${data.user.username}!`);
        console.log({ data, user: this.authService.userData });

        // get user id cookie
        document.cookie = `id=${data.user.id}`;
        console.log({ id: data.user.id, cookie: document.cookie });

        this.redirectAfterLogin(data);
      } else {
        alert('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.log({ error });
    }
  }

  // function to authenticate user on form submit
  async authenticate(event: any) {
    event.preventDefault();
    this.isLoading = true;
    await this.generateAuthenticationOptions();
    await this.verifyAuthentication();

    this.isLoading = false;
  }

  redirectAfterLogin(event: any) {
    console.log('redirecting after login', { event });
    // call loggedIn frunction to update auth service state
    this.authService.isLoggedin();
    this.router.navigate(['/todo']);
  }
}
