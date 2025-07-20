import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { mergeMap, retryWhen, take, throwError, timer } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SharedService } from '../../../Services/shared.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface RoleData {
  Id: string;
  role_name: string;
  description: string;
  permissions: string;
  status: number;
  created_at: string;
}

@Component({
  selector: 'app-role-list',
  standalone: false,
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss'
})
export class RoleListComponent implements OnInit, AfterViewInit{
  displayedColumns: string[] = ['role_name', 'description','permissions','status','created_at','action'];
  dataSource = new MatTableDataSource<RoleData>([]);
  isRetrying = false;
  retryAttempt = 0
  timerInterval: any;
  //loader: boolean = false
  searchText: any = ''

  constructor(private apiService: ApiService, private sharedService: SharedService, private router: Router){}


  ngOnInit(): void {
    this.getRoles()
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

  getRoles(){
    this.sharedService.startStopLoader(true);
    //this.loader = true;
    this.retryAttempt = 0;
    this.isRetrying = false;
    this.dataSource.data = [{ Id: '', role_name: 'Fetching data...', description: '', permissions: '',status: 0, created_at: '' }]
    this.apiService.getAllRoles().pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, i) => {
            this.retryAttempt = i + 1;
            this.isRetrying = true;
            this.dataSource.data = [{ Id: '', role_name: `Trying to fetch data (Attempt - ${this.retryAttempt})`, description: '',permissions: '', status: 0, created_at: '' }];
            //console.log('Retrying...', i + 1);
            return i < 2 ? timer(1000) : throwError(() => error); // retry 2 more times
          }),
          take(3) // total 3 attempts
        )
      )
    ).subscribe(
      (res: any)=>{
        this.sharedService.startStopLoader(false);
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
        this.sharedService.startStopLoader(false);
        if(err.status == 401){
          this.sharedService.logout();
          this.router.navigate(['/'])
        }
        //this.loader = false;
        console.log('err', err)
        this.isRetrying = false;
        this.searchText = '';
        this.dataSource.filter = '';
        this.dataSource.data = [{ Id: '', role_name: 'Unable to fetch data. Try again after sometime.', description: '',permissions: '', status: 0, created_at: '' }];
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editPermission(role: any) {
    // Implement navigation or modal logic here
    console.log('Edit clicked:', role);
    localStorage.setItem("roleEdit",JSON.stringify(role))
    this.router.navigate(['/pages/roles/edit']);
  }

  deletePermission(role: any) {
    // Show confirm dialog and delete
    console.log('Delete clicked:', role);
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
          id: role.id,
          user_id: this.sharedService.getUserInfo().id
        }

        this.apiService.deleteRole(Data).subscribe({
          next: (res: any)=>{
            this.sharedService.startStopLoader(false)
            if(res.status == 'Success'){
              this.getRoles();
              Swal.fire({
                title: "Deleted!",
                text: "Role has been deleted.",
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
                text: "Unable to delete the role, Try again after sometime.",
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
