import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CartComponent} from './cart/cart.component';
import {LoginComponent} from './login/login.component';
import {UsedCarComponent} from './used-car/used-car.component';
import {LoginLogComponent} from './login-log/login-log.component';

const routes: Routes = [
  {path: '', component: CartComponent},
  {path: 'login', component: LoginComponent},
  {path: 'cart', component: CartComponent}, // :authority/:username
  {path: 'usedcar', component: UsedCarComponent},
  {path: 'SystemLog', component: LoginLogComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
