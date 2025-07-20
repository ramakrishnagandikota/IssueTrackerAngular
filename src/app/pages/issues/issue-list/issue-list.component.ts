import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../Services/api.service';
import { mergeMap, retryWhen, take, throwError, timer } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from '../../../Services/shared.service';
import Swal from 'sweetalert2';

interface IssueData {
  Id: string;
  title: string;
  type_name: string;
  state_name: string;
  status: any;
  priority_name: string;
  created_at: string;
}

@Component({
  selector: 'app-issue-list',
  standalone: false,
  templateUrl: './issue-list.component.html',
  styleUrl: './issue-list.component.scss'
})
export class IssueListComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = ['title','type_name','state_name','status','priority_name','created_at','action'];
  dataSource = new MatTableDataSource<IssueData>([]);
  isRetrying = false;
  retryAttempt = 0
  timerInterval: any;
  //loader: boolean = false
  searchText: any = ''
  
  constructor(private apiService: ApiService, private router: Router, private sharedService: SharedService){}

  ngOnInit(): void {
    this.getIssues()
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

  getIssues(){
    //this.loader = true;
    this.retryAttempt = 0;
    this.isRetrying = false;
    this.dataSource.data = [{ Id: '', title: 'Fetching data...', type_name: '', state_name: '',status: '',priority_name: '', created_at: '' }]
    this.apiService.getAllIssues().pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, i) => {
            this.retryAttempt = i + 1;
            this.isRetrying = true;
            this.dataSource.data = [{ Id: '', title: `Trying to fetch data (Attempt - ${this.retryAttempt})`, type_name: '', state_name: '',status: '',priority_name: '', created_at: '' }];
            //console.log('Retrying...', i + 1);
            return i < 2 ? timer(1000) : throwError(() => error); // retry 2 more times
          }),
          take(3) // total 3 attempts
        )
      )
    ).subscribe(
      (res: any)=>{
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
        if(err.status == 401){
          this.sharedService.logout();
          this.router.navigate(['/'])
        }
        //this.loader = false;
        console.log('err', err)
        this.isRetrying = false;
        this.searchText = '';
        this.dataSource.filter = '';
        this.dataSource.data = [{ Id: '', title: 'Unable to fetch data. Try again after sometime.', type_name: '', state_name: '',status: '',priority_name: '', created_at: '' }];
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

   editPermission(issue: any) {
    // Implement navigation or modal logic here
    console.log('Edit clicked:', issue);
    this.router.navigate(['/pages/issues/edit/'+issue.id])
  }

  deletePermission(permission: any) {
    // Show confirm dialog and delete
    //console.log('Delete clicked:', permission);

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
          id: permission.id,
          user_id: this.sharedService.getUserInfo().id
        }

        this.apiService.deleteIssue(Data).subscribe({
          next: (res: any)=>{
            this.sharedService.startStopLoader(false)
            if(res.status == 'Success'){
              this.getIssues();
              Swal.fire({
                title: "Deleted!",
                text: "Issue has been deleted.",
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
                text: "Unable to delete the issue, Try again after sometime.",
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

  viewIssue(issue: any){
    console.log('viewIssue:', issue);
    this.router.navigate(['/pages/issues/view/'+issue.id])
  }

  copyLink(issue: any){
    let text = window.location.origin+"/pages/issues/view/"+issue.id
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy!', err);
    });
  }

}
