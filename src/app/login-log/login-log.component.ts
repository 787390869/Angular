import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login-log',
  templateUrl: './login-log.component.html',
  styleUrls: ['./login-log.component.css']
})
export class LoginLogComponent implements OnInit {

  driverLogs: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('Driver/getLog').subscribe(data => {
      this.driverLogs = data;
    });
  }

}
