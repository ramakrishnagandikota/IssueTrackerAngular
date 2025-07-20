import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { mergeMap, retryWhen, take, throwError, timer } from 'rxjs';
import { ApiService } from '../../../Services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SharedService } from '../../../Services/shared.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface UserData {
  Id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  role_name: string
  status: number;
}

interface RoleData{
  id: string
  role_name: string
}

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  displayedColumns: string[] = ['first_name', 'last_name','email','mobile','role','status','action'];
  dataSource = new MatTableDataSource<UserData>([]);
  isRetrying = false;
  retryAttempt = 0
  timerInterval: any;
  //loader: boolean = false
  searchText: any = ''

  constructor(private apiService: ApiService, private sharedService: SharedService, private router: Router){}


  ngOnInit(): void {
    this.getAllUsers()
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // getAllPermissions(user: any){
  //   return user.permissions.map
  // }

  getAllUsers(){
    this.sharedService.startStopLoader(true)
    //this.loader = true;
    this.retryAttempt = 0;
    this.isRetrying = false;
    this.dataSource.data = [{ Id: '', first_name: 'Fetching data...', last_name: '', email: '',mobile: '', role_name: '', status: 0 }]
    this.apiService.getAllUsers().pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, i) => {
            this.retryAttempt = i + 1;
            this.isRetrying = true;
            this.dataSource.data = [{ Id: '', first_name: `Trying to fetch data (Attempt - ${this.retryAttempt})`, last_name: '', email: '',mobile: '', role_name: '', status: 0  }];
            //console.log('Retrying...', i + 1);
            return i < 2 ? timer(1000) : throwError(() => error); // retry 2 more times
          }),
          take(3) // total 3 attempts
        )
      )
    ).subscribe(
      (res: any)=>{
        this.sharedService.startStopLoader(false)
        this.isRetrying = true;
        console.log('RES',res)
        //this.loader = false;
        this.dataSource = new MatTableDataSource(res); // replace the whole source
        this.dataSource.paginator = this.paginator; // re-assign paginator
        this.dataSource.sort = this.sort; 
        this.searchText = '';
        this.dataSource.filter = '';
      },
      (err: any) =>{
        this.sharedService.startStopLoader(false)
        if(err.status == 401){
          this.sharedService.logout();
          this.router.navigate(['/'])
        }
        //this.loader = false;
        console.log('err', err)
        this.isRetrying = false;
        this.searchText = '';
        this.dataSource.filter = '';
        this.dataSource.data = [{ Id: '', first_name: 'Unable to fetch data. Try again after sometime.', last_name: '', email: '',mobile: '', role_name: '', status: 0  }];
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editUser(permission: any) {
    // Implement navigation or modal logic here
    console.log('Edit clicked:', permission);
    localStorage.setItem('editUser', JSON.stringify(permission));
    this.router.navigate(['/pages/users/edit']);
  }

  deleteUser(user: any) {
    // Show confirm dialog and delete
    //console.log('Delete clicked:', user);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.sharedService.startStopLoader(true)
        let Data = {
          id: user.id,
          user_id: this.sharedService.getUserInfo().id
        }

        this.apiService.deleteUser(Data).subscribe({
          next: (res: any)=>{
            this.sharedService.startStopLoader(false)
            if(res.status == 'Success'){
              this.getAllUsers();
              Swal.fire({
                title: "Deleted!",
                text: "User has been deleted.",
                icon: "success"
              });
            }else{
              Swal.fire({
                title: "Oops!",
                text: res.message,
                icon: "error"
              });
            }
          },
          error: (err: any)=>{
            console.log('error', err)
            this.sharedService.startStopLoader(false)
            if(err.status == 401){
              this.sharedService.logout();
              this.router.navigate(['/'])
            }else if(err.status == 0){
              Swal.fire({
                title: "Oops!",
                text: "Unable to delete the user, Try again after sometime.",
                icon: "error"
              });
            }else{
              Swal.fire({
                title: "Oops!",
                text: err.error.details.message,
                icon: "error"
              });
            }
          }
        })
      }
    });
  }
}
