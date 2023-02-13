import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { startRegistration } from '@simplewebauthn/browser';
import { AuthService, User } from '../auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  // define component state

  API = environment.api;

  userData: User = {
    id: '',
    name: '',
    displayName: '',
  };

  username = '';
  attestationResponse = {};
  isLoading = false;

  ngOnInit(): void {}

  constructor(private router: Router, private authService: AuthService) {}

  // function to update username
  updateUsername(event: any) {
    this.username = event.target.value;
    console.log({ username: this.username });
  }

  // function to generate registration options
  async generateRegistrationOptions() {
    try {
      const res = await fetch(
        `${this.API}/generate-registration-options?username=${this.username}`
      );
      const creationOptions = await res.json();
      this.userData = creationOptions.user;

      console.log({ creationOptions, user: this.authService.userData });

      try {
        this.attestationResponse = await startRegistration(creationOptions);
        console.log({ attestationResponse: this.attestationResponse });
      } catch (error) {
        console.log({ error });
        throw error;
      }
    } catch (error) {
      console.log({ error });
    }
  }

  // function to verify registration
  async verifyRegistration() {
    try {
      const res = await fetch(`${this.API}/verify-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.userData.id,
          attestationResponse: this.attestationResponse,
        }),
      });
      const verification = await res.json();
      console.log({ verification });

      if (verification.verified) {
        alert('Registration successful! Proceed to login');
        this.authService.userData.name = this.userData.name;

        // redirect to login
        this.router.navigate(['/login']);
      } else {
        alert('Registration failed! Please try again.');
      }
    } catch (error) {
      console.log({ error });
    }
  }

  // function to register
  async register(event: any) {
    event.preventDefault();
    this.isLoading = true;
    await this.generateRegistrationOptions();
    await this.verifyRegistration();
    this.isLoading = false;
  }
}
