import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  btnDisabled = false;

  constructor(
    private data: DataService,
    private router: Router,
    private rest: RestApiService
  ) { }

  ngOnInit() {
  }


  validate() {
    if (this.email) {
      if (this.password) {
        return true;
      } else {
        this.data.error('Password is not entered');
      }
    } else {
      this.data.error('Email is invalid or not correct');
    }
  }

  async login() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        const data = await this.rest.post(
          'http://localhost:2222/api/accounts/login',
          {
            email: this.email,
            password: this.password
          }
        );
        if (data['success']) {
          localStorage.setItem('token', data['token']);
          await this.data.getProfile();
          this.router.navigate(['/']);
          this.data.success('Login successful');
        } else {
          this.data.error(['message']);
        }
      }
    } catch (error) {
      this.data.error(['message']);
    }
    this.btnDisabled = false;
  }


}
