import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../Services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  close : boolean = false
  fullName: any = ''

  constructor(private sharedService: SharedService, private router: Router){}

  ngOnInit(): void {
    this.fullName = this.sharedService.getUserInfo().first_name+' '+this.sharedService.getUserInfo().last_name
  }

  openMenu(){
    this.close = !this.close
    this.sharedService.openMenu(this.close)
  }

  logout(){
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    localStorage.removeItem("permissions")
    localStorage.removeItem("access_token")
    localStorage.removeItem('login_time');
    localStorage.removeItem('expiry_time');
    this.router.navigate(['/'])
  }

}
