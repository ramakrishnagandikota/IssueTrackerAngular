import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private menuOpen = new BehaviorSubject<boolean>(false);
  public menuClick$: Observable<boolean> = this.menuOpen.asObservable();

  private loader = new BehaviorSubject<boolean>(false);
  public loaderClick$: Observable<boolean> = this.loader.asObservable();

  menuItems: any = []

  constructor() { }

  openMenu(newMessage: boolean) {
    this.menuOpen.next(newMessage);
  }

  startStopLoader(newMessage: boolean) {
    this.loader.next(newMessage);
  }

  getUserInfo(){
    let data: any = localStorage.getItem("user");
    let dataStr = JSON.parse(data)
    return dataStr
  }

  getAccessToken(){
    let data: any = localStorage.getItem("access_token");
    return data
  }

  getUserRole(){
    let data: any = localStorage.getItem("role");
    return data
  }

  logout(){
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    localStorage.removeItem("permissions")
    localStorage.removeItem("access_token")
    localStorage.removeItem('login_time');
    localStorage.removeItem('expiry_time');
  }

  // hasAccess(name: any){
  //   let data: any = localStorage.getItem("permissions");
  //   let dataStr = JSON.parse(data)
  //   return dataStr.includes(name)
  // }

  hasAccess(name: any){
    let data: any = localStorage.getItem("permissions");
    let dataStr = JSON.parse(data)
    return dataStr.includes(name)
  }

}
