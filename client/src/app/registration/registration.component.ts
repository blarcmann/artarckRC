import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  name = '';
  email = '';
  password = '';
  password1 = '';
  isSeller = false;
  btnDisabled = false;

  constructor(
    private data: DataService,
    private router: Router,
    private rest: RestApiService
  ) { }

  ngOnInit() {
  }

  validate() {
    if (this.name) {
      if (this.email) {
        if (this.password) {
          if (this.password1) {
            if (this.password === this.password1) {
              return true;
            } else {
              this.data.error('Password do not match, do you need help??');
            }
          } else {
            this.data.error('Confirmation password is not entered');
          }
        } else {
          this.data.error('Please enter your password, mbok');
        }
      } else {
        this.data.error('The email field is required');
      }
    } else {
      this.data.error('Anonymous users not allowed, please enter you name');
    }
  }

  async register() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        const data = await this.rest.post(
          'http://localhost:2222/api/accounts/signup',
          {
            name: this.name,
            email: this.email,
            password: this.password,
            isSeller: this.isSeller
          }
        );
        if (data['success']) {
          localStorage.setItem('token', data['token']);
          this.data.success('Registration successful');
          await this.data.getProfile();
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
