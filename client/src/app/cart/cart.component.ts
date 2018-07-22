import { Component, OnInit } from '@angular/core';

import { environment } from '../../environments/environment';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  btnDisabled = false;
  handler: any;

  quantities = [];

  constructor(
    private router: Router,
    private data: DataService,
    private rest: RestApiService
  ) { }

  trackByCartItems(index: number, item: any) {
    return item._id;
  }

  get cartItems() {
    return this.data.getCart();
  }

  get cartTotal() {
    let total = 0;
    this.cartItems.forEach((data, index) => {
      total += data['price'] * this.quantities[index];
    });
    return total;
  }

  removeProduct(index, product) {
    this.quantities.splice(index, 1);
    this.data.removeFromCart(product);
  }

  ngOnInit() {
    this.cartItems.forEach(data => {
      this.quantities.push(1);
    });
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: 'assets/images/logo.png',
      locale: 'auto',
      token: async stripeToken => {
        let products;
        products = [];
        this.cartItems.forEach((d, index) => {
          products.push({
            product: d['_id'],
            quantity: this.quantities[index]
          });
        });

        try {
          const data = await this.rest.post('http://localhost:2222/api/payment', {
            totalPrice: this.cartTotal,
            products,
            stripeToken
          });
          data['success']
            ? (this.data.clearCart(), this.data.success('Purchase successful'))
            : this.data.error(data['message']);
        } catch (error) {
          this.data.error(error['message']);
        }
      }
    });
  }

  validate() {
    if (!this.quantities.every(data => data > 0)) {
      this.data.warning('What do you want to pay for??...ekpang somebody!');
    } else if (!localStorage.getItem('token')) {
      this.router.navigate(['/login'])
        .then(() => {
          this.data.warning('You need to login before making purchase');
        });
    } else if (!this.data.user['address']) {
      this.router.navigate(['/profile/address'])
        .then(() => {
          this.data.warning('Update your shipping address, abi mk dem bring am show for my domot??');
        });
    } else {
      this.data.message = '';
      return true;
    }
  }

  checkout() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        this.handler.open({
          name: 'artarckRC',
          description: 'Checkout payment',
          amount: this.cartTotal * 100,
          closed: () => {
            this.btnDisabled = false;
          }
        });
      } else {
        this.btnDisabled = false;
      }
    } catch (error) {
      this.data.error(error);
    }
  }


}
