import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit {
  focus: any;
  focus1: any;

  constructor(private readonly router: Router) { }

  ngOnInit() {}

routeToDashboard(){
  this.router.navigate(['/main/dashboard']);
}
}
