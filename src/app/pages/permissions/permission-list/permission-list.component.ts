import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { mergeMap, retryWhen, take, throwError, timer } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


interface PermissionData {
  Id: string;
  permission_name: string;
  description: string;
  status: number;
  created_at: string;
}

@Component({
  selector: 'app-permission-list',
  standalone: false,
  templateUrl: './permission-list.component.html',
  styleUrl: './permission-list.component.scss'
})
export class PermissionListComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = ['permission_name', 'description','status','created_at'];
  dataSource = new MatTableDataSource<PermissionData>([]);
  isRetrying = false;
  retryAttempt = 0
  timerInterval: any;
  //loader: boolean = false
  searchText: any = ''

  constructor(private apiService: ApiService){}


  ngOnInit(): void {
    this.getPermissions()
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPermissions(){
    //this.loader = true;
    this.retryAttempt = 0;
    this.isRetrying = false;
    this.dataSource.data = [{ Id: '', permission_name: 'Fetching data...', description: '', status: 0, created_at: '' }]
    this.apiService.getAllPermissions().pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, i) => {
            this.retryAttempt = i + 1;
            this.isRetrying = true;
            this.dataSource.data = [{ Id: '', permission_name: `Trying to fetch data (Attempt - ${this.retryAttempt})`, description: '', status: 0, created_at: '' }];
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
        //this.loader = false;
        console.log('err', err)
        this.isRetrying = false;
        this.searchText = '';
        this.dataSource.filter = '';
        this.dataSource.data = [{ Id: '', permission_name: 'Unable to fetch data. Try again after sometime.', description: '', status: 0, created_at: '' }];
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editPermission(permission: any) {
    // Implement navigation or modal logic here
    console.log('Edit clicked:', permission);
  }

  deletePermission(permission: any) {
    // Show confirm dialog and delete
    console.log('Delete clicked:', permission);
  }
}
