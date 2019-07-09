import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user;
  public userWithRole;
  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
  }
  doLogin() {
    const username = $('.form-username').val();
    const password = $('.form-password').val();
    if (username !== '' && password !== '') {
      this.http.get('User/getUserByUsernameAndPassword/' + username + '/' + password).subscribe(data => {
        this.user = data;
        if (this.user !== null) {
          this.http.get('User/getUserByUsername/' + this.user.username).subscribe(response => {
            this.userWithRole = response;
            this.router.navigate(['/cart'] /*, this.userWithRole.authorities[0].authority, this.userWithRole.username]*/);
          });
        } else {
          alert('用户名或密码错误!');
        }
      });
    } else {
      alert('请填写用户名与密码!');
    }
  }
}
