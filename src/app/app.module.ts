import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartComponent } from './cart/cart.component';
import {HttpClientModule} from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { UsedCarComponent } from './used-car/used-car.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ElementRef} from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    MainComponent,
    LoginComponent,
    UsedCarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: '', component: CartComponent},
      {path: 'login', component: LoginComponent},
      {path: 'cart', component: CartComponent}, // :authority/:username
      {path: 'usedcar', component: UsedCarComponent},
    ]),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
