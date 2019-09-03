import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  loginUsername;
  imageurl = 'image/panda.jpg';
  words: any = '未登录';
  private way = {
    1 : 'User Login',
    2 : 'User Register',
    3 : 'Data Management',
    4 : 'System Log',
    5 : 'User Management',
    6 : 'User Reply',
    7 : 'User Comment',
    8 : 'User Question',
    9 : 'Message System',
    10 : 'Order System'
  };
  private url = this.way['3'];
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
  changeUrl(num) {
    this.url = this.way[num];
  }
}
