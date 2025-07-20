import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiBaseUrl

  constructor(private http: HttpClient) { }

  loginUser(data: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(this.baseUrl+"/api/login", data,{headers});
  }
}
