import { Component, OnInit} from '@angular/core';
import {products} from '../products';
import {CartService} from '../cart.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products = products;
  books: any = [] ;
  message = [];
  constructor(private http: HttpClient) {
  }

  changeDate() {
    const array: number[] = [1, 2, 3, 4];
    for (const value of array) {
      console.log(array[(value - 1)]);
    }
    this.message = array;
  }
  ngOnInit() { }
  getData() {
    this.http.get('api/getAllBook/1/10').subscribe((data) => {
      this.books = data;
      console.log(this.books.length);
    });
  }
  share() {
    window.alert('The product has been shared!');
  }
  onNotify() {
    window.alert('You will be notified when the product goes on sale');
  }
}
