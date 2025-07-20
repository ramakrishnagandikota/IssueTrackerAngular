import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { mergeMap, retryWhen, take, throwError, timer } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SharedService } from '../../../Services/shared.service';

@Component({
  selector: 'app-role-create',
  standalone: false,
  templateUrl: './role-create.component.html',
  styleUrl: './role-create.component.scss'
})
export class RoleCreateComponent implements OnInit{

  roleForm!: FormGroup
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings = {};
  submitted: boolean = false

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private sharedService: SharedService){}

  ngOnInit(): void {
    this.initForm()
    this.initDropdown()
    this.getPermissions()
  }

  initForm(){
    this.roleForm = this.fb.group({
      role_name: ['',[Validators.required, Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/), Validators.minLength(2), Validators.maxLength(20)]],
      description: ['', Validators.required],
      status: [1,[Validators.required]],
      permission_id: [[]]
    })
  }

  initDropdown(){
    // this.dropdownList = [
    //   { item_id: 1, item_text: 'Mumbai' },
    //   { item_id: 2, item_text: 'Bangaluru' },
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    //   { item_id: 5, item_text: 'New Delhi' }
    // ];
    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' }
    // ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'permission_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      enableCheckAll: true,
      disabledField: 'isDisabled',
      defaultOpen: false
    };
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  onItemDeSelect(item: any){
    console.log(item)
  }

  getPermissions(){
    this.apiService.getAllPermissions().pipe(
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
        console.log('RES',res)
        this.dropdownList = res;
        // this.selectedItem = [res.map((x:any)=> x.permission_name == 'Dashboard')]
        let sel = res.find((x:any)=> x.permission_name == 'Dashboard')
        this.selectedItems = [
          {id: sel.id, permission_name: sel.permission_name, isDisabled: true}
        ]
        console.log(res.find((x:any)=> x.permission_name == 'Dashboard'))
      },
      (err: any) =>{
        console.log('err', err)
      }
    )
  }

  submitForm(){
    this.submitted = true;
    if(this.roleForm.invalid){
      this.roleForm.markAllAsTouched();
      return;
    }
    this.roleForm.clearValidators()
    this.sharedService.startStopLoader(true)
    const idArray = this.selectedItems.map((p: any) => p.id);
    //console.log(idArray);
    this.roleForm.get('permission_id')?.setValue(idArray)
    // console.log(this.roleForm.value)
    this.apiService.createRole(this.roleForm.value).subscribe({
      next : (res: any)=>{
        console.log('res', res)
        this.sharedService.startStopLoader(false)
        if(res.status == 'Success'){
          Swal.fire({
            title: "",
            text: "Role created successfully",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok"
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/pages/roles']);
            }
          });
          
        }else{
          Swal.fire({
            title: "Oops!",
            text: res.message,
            icon: "warning"
          });
        }
        
      },
      error : (err: any)=>{
        this.sharedService.startStopLoader(false)
        console.log('err', err)
        Swal.fire({
          title: "Oops!",
          text: err.error.details.message,
          icon: "warning"
        });
      } 
    })
  }

}
