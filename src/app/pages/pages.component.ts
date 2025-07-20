import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SharedService } from '../Services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages',
  standalone: false,
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent implements OnInit, AfterViewInit{

  loader: boolean = false;
  constructor(private sharedService: SharedService, private router: Router, private cdRef: ChangeDetectorRef){}

  ngOnInit(): void {
   
    const isLoggedIn = localStorage.getItem('access_token');
    if (!isLoggedIn) {
      this.router.navigate(['/']);
    }
    //this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
     this.sharedService.loaderClick$.subscribe((res: any)=>{
      this.loader = res
    })
    this.cdRef.detectChanges();
  }

}
