// ./src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { environment } from './environments/environment';

export type User = {
  id: string;
  name: string;
  displayName: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  _userData: User = { id: '', name: '', displayName: '' };
  API = environment.api;
  userData: User = this._userData;

  // function to check if user is logged in
  async isLoggedin(): Promise<boolean> {
    try {
      // get user data
      this.userData = await this.userInfo();
      // console.log({ userData: this.userData });
      if (!this.userData.id) throw new Error('no user id, not logged in');

      return true;
      // A valid JWT is in place so that the user object was able to be fetched.
    } catch (error) {
      console.log({ error });
      return false;
    }
  }

  // function to get user data
  async userInfo() {
    try {
      // get user id from cookie
      let id = '';
      const cookies = document.cookie;
      cookies.split('; ').forEach((cookie) => {
        const [key, value] = cookie.split('=');
        if (key === 'id') {
          id = value;
          console.log({ key, value });
        }
      });

      // get user data from api
      const res = await fetch(`${this.API}/user?id=${id || this.userData.id}`);
      const user = await res.json();

      // set user data in service
      this.userData = {
        displayName: user.username,
        id: user.id,
        name: user.username,
      };

      // console.log({ user, userData: this.userData });
      // return user data
      return this.userData;
    } catch (error) {
      console.log({ error, user: this.userData });
      return this.userData;
    }
  }

  // function to log user out
  logOut() {
    // remove user id from cookie
    document.cookie = 'id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // reset user data
    this.userData = this._userData;

    alert("You've been logged out. Please log in again to continue.");
  }

  constructor() {}
}
