import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-used-car',
  templateUrl: './used-car.component.html',
  styleUrls: ['./used-car.component.css']
})
export class UsedCarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.location.replace('http://localhost:9411');
  }
}
