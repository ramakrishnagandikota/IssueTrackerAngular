import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup
  errorMessage: any = ""

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){}

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('access_token');
    if (isLoggedIn) {
      this.router.navigate(['/pages/dashboard']);
    }
    this.initForm();
  }

  initForm(){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{6,16}$')]]
    })
  }

  get f(){
    return this.loginForm.controls;
  }

  submitForm(){
    if(this.loginForm.invalid){
      this.errorMessage = ""
      return
    }

    let Data = "username="+btoa(this.loginForm.value.email)+"&password="+btoa(this.loginForm.value.password)+"&grant_type=password&scope=null&client_id=null&client_secret=null"

    this.authService.loginUser(Data).subscribe({
      next : (res: any)=>{
        // console.log('res', res)
        // console.log('user', res.user)
        // console.log('role', res.role)
        // console.log('permissions', res.permissions)
        // console.log('access_token', res.access_token)
        if(res.status == "Success"){
          localStorage.setItem("user",JSON.stringify(res.user))
          localStorage.setItem("role",res.role[0])
          localStorage.setItem("permissions", JSON.stringify(res.permissions))
          localStorage.setItem("access_token", res.access_token)
          const loginTime = new Date().getTime();
          const expiryTime = loginTime + res.expiry * 60 * 60 * 1000;
          localStorage.setItem('login_time', loginTime.toString());
          localStorage.setItem('expiry_time', expiryTime.toString());
          this.router.navigate(["/pages/dashboard"]);
        }else{
          this.errorMessage = res.message;
        }
        
      },
      error : (err: any)=>{
        console.log('err', err.error.detail.status)
        if(err.error.detail.status == "Fail"){
          this.errorMessage = "The Email / Password is incorrect. Kindly check and retry again."
        }
      }
    })

    setTimeout(()=>{
      this.errorMessage = ""
    }, 10000)
  }
}
