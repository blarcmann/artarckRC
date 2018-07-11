import { Component, OnInit } from '@angular/core';

import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  btnDisabled = false;
  currentAddress: any;

  constructor(private rest: RestApiService, private data: DataService) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        'http://localhost:2222/api/accounts/address'
      );

      if (JSON.stringify(data['address']) === '{}' && this.data.message === '') {
        this.data.warning('Please enter your shipping address, mbok');
      }
      this.currentAddress = data['address'];

    } catch (error) {
      this.data.error(error['message']);
    }
  }

  async updateAddress() {
    this.btnDisabled = true;

    try {
      const res = this.rest.post(
        'http://localhost:2222/api/accounts/address',
        this.currentAddress
      );

      res['success']
        ? (this.data.success(res['message']), await this.data.getProfile())
        : this.data.error(res['message']);

    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }


}
