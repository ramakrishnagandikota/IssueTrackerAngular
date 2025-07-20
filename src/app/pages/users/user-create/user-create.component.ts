import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { SharedService } from '../../../Services/shared.service';
import { mergeMap, retryWhen, take, throwError, timer } from 'rxjs';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-create',
  standalone: false,
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss'
})
export class UserCreateComponent implements OnInit{

  roles: any = []
  userForm!: FormGroup;
  submitted: boolean = false

  constructor(private apiService: ApiService, private sharedService: SharedService, private router: Router, private fb: FormBuilder){}

  ngOnInit(): void {
    this.initForm()
    this.getRoles()
  }

  initForm(){
    this.userForm = this.fb.group({
      first_name: ['',[Validators.required, Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/), Validators.minLength(2), Validators.maxLength(20)]],
      last_name: ['',[Validators.required, Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/), Validators.minLength(2), Validators.maxLength(20)]],
      email: ['',[Validators.required,Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@ripplemetering\.com$/)]],
      mobile_number: ['',[Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['',[Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;"'<>?,.\/\\]).{6,18}$/)]],
      confirm_password: ['',[Validators.required]],
      date_of_birth: [''],
      address: [''],
      profile_picture: [''],
      status: ['',[Validators.required]],
      role_id: ['',[Validators.required]],
    }, { validators: this.matchPasswords })
  }

  matchPasswords(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirm_password')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  }

  changeValue(event: any, field: any){
    this.userForm.get(field)?.setValue(event.target.value)
  }

  getRoles(){
    this.sharedService.startStopLoader(true)
    this.apiService.getAllRoles().pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, i) => {
            return i < 2 ? timer(1000) : throwError(() => error); // retry 2 more times
          }),
          take(3) // total 3 attempts
        )
      )
    ).subscribe(
      (res: any)=>{
        this.sharedService.startStopLoader(false)
        this.roles = res;
      },
      (err: any) =>{
        this.sharedService.startStopLoader(false)
        if(err.status == 401){
          this.sharedService.logout();
          this.router.navigate(['/'])
        }
      }
    )
  }

  submitForm(){
    this.submitted = true
    if(this.userForm.invalid){
      return
    }
    this.sharedService.startStopLoader(true)
    //console.log(this.userForm.value)
    this.apiService.createUser(this.userForm.value).subscribe({
      next : (res: any)=>{
        this.sharedService.startStopLoader(false)
        if(res.status == 'Success'){
          Swal.fire({
            title: "",
            text: "User created successfully",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok"
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/pages/users']);
            }
          });
        }else{
          Swal.fire({
            title: "Oops!",
            text: res.message,
            icon: "error"
          });
        }
      },
      error : (err: any)=>{
        this.sharedService.startStopLoader(false)
        if(err.status == 401){
          this.sharedService.logout();
          this.router.navigate(["/"])
        }

        Swal.fire({
          title: "Oops!",
          text: err.error.detail[0].msg,
          icon: "warning"
        });
      }
    })
  }

}
