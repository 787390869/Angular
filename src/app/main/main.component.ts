import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  loginUsername: any = '未登录';
  constructor(private http: HttpClient) {
    this.http.get('api/User/getLoginUser').subscribe(data => {
      if (data !== null) {
        this.loginUsername = data;
        this.loginUsername = this.loginUsername.username;
        console.log(this.loginUsername);
      }
    });
  }

  ngOnInit() {
  }

}
