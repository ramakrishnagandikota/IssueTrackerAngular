import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiBaseUrl

  constructor(private http: HttpClient) { }

  getToken(){
    let token = localStorage.getItem("access_token");
    return "Bearer "+token
  }

  getAllPermissions(){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.get(this.baseUrl+"/api/permissions",{headers});
  }

  getAllRoles(){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.get(this.baseUrl+"/api/roles",{headers});
  }

  createRole(data: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.post(this.baseUrl+"/api/role",data,{headers});
  }

  updateRole(data: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.post(this.baseUrl+"/api/role/update",data,{headers});
  }

  deleteRole(data: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.post(this.baseUrl+"/api/role/delete",data,{headers});
  }

  getMasterData(){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.get(this.baseUrl+"/api/masterData",{headers});
  }

  uploadTask(data: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.post(this.baseUrl+"/api/create-task",data,{headers});
  }

  updateTask(data: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.post(this.baseUrl+"/api/update-task",data,{headers});
  }

  getAllIssues(){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.get(this.baseUrl+"/api/getAllIssues",{headers});
  }

  getIssueById(data: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.post(this.baseUrl+"/api/getIssue",data,{headers});
  }

  downloadFile(fileName: string) {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });
    return this.http.get(this.baseUrl+`/api/download/${fileName}`, {
      responseType: 'blob' , headers
    });
  }

  deleteFile(data: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.post(this.baseUrl+"/api/deleteIssue",data,{headers});
  }

  approveIssue(data: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.post(this.baseUrl+"/api/approve-issue",data,{headers});
  }

  rejectIssue(data: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.post(this.baseUrl+"/api/reject-issue",data,{headers});
  }

  updateAttachments(data: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.post(this.baseUrl+"/api/update-attachments",data,{headers});
  }

  deleteIssue(data: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.post(this.baseUrl+"/api/delete-issue",data,{headers});
  }

  getAllUsers(){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.get(this.baseUrl+"/api/users/",{headers});
  }

  createUser(data: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.post(this.baseUrl+"/api/user",data,{headers});
  }

  updateUser(data: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.post(this.baseUrl+"/api/user/update",data,{headers});
  }

  deleteUser(data: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.post(this.baseUrl+"/api/user/delete",data,{headers});
  }

  getAllIssueLogs(id: any){
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': this.getToken() 
    });

    return this.http.get(this.baseUrl+"/api/getAllIssueLog/"+id,{headers});
  }
}
