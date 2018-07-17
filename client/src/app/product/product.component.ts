import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: any;

  myReview = {
    title: '',
    description: '',
    rating: 0
  };

  btnDisabled = false;

  constructor(
    private rest: RestApiService,
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.rest.get(`http://localhost:2222/api/product/${res['id']}`)
        .then(data => {
          data['success']
            ? (this.product = data['product'])
            : this.router.navigate(['/']);
        }).catch(error => this.data.error(error['message']));
    });
  }

  async postReview() {
    this.btnDisabled = true;
    try {
      const data = this.rest.post('http://localhost:2222/api/review', {
        productId: this.product._id,
        title: this.myReview.title,
        description: this.myReview.description,
        rating: this.myReview.rating
      });
      data['success']
        ? this.data.success(data['message'])
        : this.data.error(data['message']);
        console.log(this.myReview);
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;

  }



}
