import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  loginUsername;
  words: any = '未登录';
  constructor(private http: HttpClient) {
    this.http.get('api/User/getLoginUser').subscribe(data => {
      if (data !== null) {
        const response: any = data;
        const role = response.userRole.role;
        this.loginUsername = response.username;
        if (role === 'admin') {
          this.words = '欢迎您系统管理员:' + this.loginUsername;
        }
        if (role === 'driver') {
          this.words = '欢迎您驾驶员:' + this.loginUsername;
        }
      }
    });
  }

  ngOnInit() {  }

}
