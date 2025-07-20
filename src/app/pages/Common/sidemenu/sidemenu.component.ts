import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { SharedService } from '../../../Services/shared.service';

@Component({
  selector: 'app-sidemenu',
  standalone: false,
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent implements OnInit{

  close: boolean = false;

  constructor(private sharedService: SharedService){}

  ngOnInit(): void {
    this.sharedService.menuClick$.subscribe((msg: boolean) => {
      console.log('msg', msg)
      this.close = msg
    });
    
  }

  hasAccess(name: any){
    return this.sharedService.hasAccess(name);
  }

}
