import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { ComponentsComponent } from './components/components.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';
import { LandingComponent } from './examples/landing/landing.component';
import { ProfileComponent } from './examples/profile/profile.component';
import { SignupComponent } from './examples/signup/signup.component';

const routes: Routes =[
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',             component: ComponentsComponent },
  { path: 'user-profile',     component: ProfileComponent },
  { path: 'signup',           component: SignupComponent },
  { path: 'landing',          component: LandingComponent },
  { path: 'nucleoicons',      component: NucleoiconsComponent },
  {
    path: 'main',
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () => import ("./components/admin-layout/admin-layout.module").then(m => m.AdminLayoutModule)
      }
    ]
  }
];

@NgModule({
imports: [
  CommonModule,
  BrowserModule,
  RouterModule.forRoot(routes,{
    useHash: true
  })
],
exports: [
],
})
export class AppRoutingModule { }
