import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { SharedService } from '../../../Services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { mergeMap, retryWhen, take, throwError, timer } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

interface IssueImg {
  Id: string;
  file_name: string;
  size: string;
  created_at: string;
}

@Component({
  selector: 'app-issue-view',
  standalone: false,
  templateUrl: './issue-view.component.html',
  styleUrl: './issue-view.component.scss'
})
export class IssueViewComponent implements OnInit, AfterViewInit{
//issueForm!: FormGroup;
  state: any = [];
  priority: any = [];
  type: any = [];
  files: File[] = [];
  issueId: any;
  displayedColumns: string[] = ['file_name', 'size', 'created_at','action'];
  dataSource = new MatTableDataSource<IssueImg>([]);
  isRetrying = false;
  retryAttempt = 0;
  timerInterval: any;
  //loader: boolean = false;
  searchText: any = '';

  id: any;
  title: any;
  description: any;
  type_name: any;
  state_name: any;
  priority_name: any;
  azure_ticket_no: any
  ticketUrl: any = '';
  createdOn: any = '';
  createdBy: any = '';
  updatedOn: any = '';
  updatedBy: any = '';
  status: any;
  errorMessage: any = ""
  issueLogs: any = []


  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.issueId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    //this.initForm();
    this.getMasterData();
  }

  // initForm() {
  //   this.issueForm = this.fb.group({
  //     id: [''],
  //     title: ['', [Validators.required]],
  //     description: ['', [Validators.required]],
  //     type: ['', [Validators.required]],
  //     state: ['', [Validators.required]],
  //     azure_ticket_no: [''],
  //     priority: ['', [Validators.required]],
  //   });
  // }

  async getMasterData() {
    this.sharedService.startStopLoader(true);
    await this.apiService.getMasterData().subscribe({
      next: (res: any) => {
        this.state = res.state;
        this.priority = res.priority;
        this.type = res.type;

        this.getIssueData();
        
      },
      error: (err: any) => {
        this.sharedService.startStopLoader(false);
        console.log('err',err)
        if(err.status == 401){
          this.sharedService.logout();
          this.router.navigate(['/'])
        }
      },
    });
  }

  getIssueData() {
    //this.loader = true;
    this.retryAttempt = 0;
    this.isRetrying = false;
    this.dataSource.data = [
      { Id: '', file_name: 'Fetching data...', size: '', created_at: '' },
    ];

    let Data = {
      id: this.issueId,
    };
    this.apiService
      .getIssueById(Data)
      .pipe(
        retryWhen((errors) =>
          errors.pipe(
            mergeMap((error, i) => {
              this.retryAttempt = i + 1;
              this.isRetrying = true;
              this.dataSource.data = [
                {
                  Id: '',
                  file_name: `Trying to fetch data (Attempt - ${this.retryAttempt})`,
                  size: '',
                  created_at: '',
                },
              ];
              //console.log('Retrying...', i + 1);
              return i < 2 ? timer(1000) : throwError(() => error); // retry 2 more times
            }),
            take(3) // total 3 attempts
          )
        )
      )
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.id = res.id
          this.title = res.title
          this.description = res.description
          this.type_name = this.type.filter((x: any)=>x.id == res.type)[0].type_name
          this.state_name = this.state.filter((x: any)=>x.id == res.state)[0].state_name
          this.azure_ticket_no = res.azure_ticket_no
          this.priority_name = this.priority.filter((x: any)=>x.id == res.priority)[0].priority_name
          this.ticketUrl = environment.azureUrl+'/'+res.azure_ticket_no
          this.createdOn = res.created_at
          this.createdBy = res.created_by
          this.updatedOn = res.updated_at
          this.updatedBy = res.updated_by
          this.status = res.status
          this.getAllLogs(res.id)
          console.log('this.type_name', this.type_name)

          // this.issueForm.get('id')?.setValue(res.id);
          // this.issueForm.get('title')?.setValue(res.title);
          // this.issueForm.get('description')?.setValue(res.description);
          // this.issueForm.get('type')?.setValue(res.type);
          // this.issueForm.get('state')?.setValue(res.state);
          // this.issueForm.get('azure_ticket_no')?.setValue(res.azure_ticket_no);
          // this.issueForm.get('priority')?.setValue(res.priority);

          this.isRetrying = true;
          //this.loader = false;
          this.dataSource = new MatTableDataSource(res.attachments); // replace the whole source
          this.dataSource.paginator = this.paginator; // re-assign paginator
          this.dataSource.sort = this.sort;
          this.sharedService.startStopLoader(false);
        },
        error: (err: any) => {
          this.sharedService.startStopLoader(false);
          //this.loader = false;
          console.log('err', err.detail)
          this.isRetrying = false;
          this.searchText = '';
          this.dataSource.filter = '';
          this.dataSource.data = [{ Id: '', file_name: 'Unable to fetch data. Try again after sometime.', size: '', created_at: '' }];

          if(err.status == 401){
            this.sharedService.logout();
            this.router.navigate(['/'])
          }
        }
      });
  }

  public dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.files.push(file);
        });
      }
    }
  }

  // createTicket() {
  //   const formData = new FormData();
  //   formData.append('title', this.issueForm.get('title')?.value);
  //   formData.append('description', this.issueForm.get('description')?.value);
  //   formData.append('type', this.issueForm.get('type')?.value);
  //   formData.append('state', this.issueForm.get('state')?.value);
  //   formData.append(
  //     'azure_ticket_no',
  //     this.issueForm.get('azure_ticket_no')?.value
  //   );
  //   formData.append('priority', this.issueForm.get('priority')?.value);
  //   formData.append('user_id', this.sharedService.getUserInfo().id);

  //   this.files.forEach((file, index) => {
  //     formData.append('files', file); // backend expects 'files' as the key for multiple
  //   });

  //   this.apiService.uploadTask(formData).subscribe((response: any) => {
  //     console.log('Upload success', response);
  //   });
  // }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  convertBytesToKB(bytes: number): string {
    const kb = bytes / 1024;
    return kb.toFixed(2) + ' KB';
  }

  deleteImage(image: any){
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
        this.sharedService.startStopLoader(true);
        let Data = {
          id: image.id,
          user_id: this.sharedService.getUserInfo().id,
          issue_id: this.id
        }
        this.apiService.deleteFile(Data).subscribe({
          next: (res: any)=>{
            this.sharedService.startStopLoader(false);
            if(res.status == 'Success'){
              this.getIssueData()
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
              });
            }else{
              Swal.fire({
                title: "Oops!",
                text: res.message,
                icon: "warning"
              });
            }
          },
          error: (err: any)=>{
            this.sharedService.startStopLoader(false);
            if(err.status == 401){
              this.sharedService.logout()
              this.router.navigate(['/'])
            }

            Swal.fire({
              title: "Oops!",
              text: err.error.details.message,
              icon: "warning"
            });
}
        })
      }
    });
  }

  downloadFile(fileName: any) {
   this.sharedService.startStopLoader(true);
    this.apiService.downloadFile(fileName).subscribe({
      next: (blob: Blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.sharedService.startStopLoader(false);
      },
      error: (err) => {
        this.sharedService.startStopLoader(false);
        console.error('File download failed:', err);
        if(err.status == 401){
          this.sharedService.logout();
          this.router.navigate(['/'])
        }else{
          Swal.fire({
            title: "Oops!",
            text: "Unable to download file, Try again after sometime.",
            icon: "warning"
          });
        }
      }
    });
  }

  approve(id: any){
    this.sharedService.startStopLoader(true);
    let Data = {
      id: id,
      state: 'Approved',
      user_id: this.sharedService.getUserInfo().id
    }
    this.apiService.approveIssue(Data).subscribe({
      next: (res: any)=>{
        this.sharedService.startStopLoader(false);
        this.getIssueData();
        if(res.status == "Success"){
          Swal.fire({
            title: "Yeah..!",
            text: "Issue has been approved.",
            icon: "success"
          });
        }else{
          Swal.fire({
            title: "Oops..!",
            text: "Unable to approve issue, Try again after sometime. ",
            icon: "warning"
          });
        }
      },
      error: (err: any)=>{
        this.sharedService.startStopLoader(false);
        if(err.status == 401){
          this.sharedService.logout();
          this.router.navigate(['/'])
        }else{
          Swal.fire({
            title: "Oops..!",
            text: err.error.details.message,
            icon: "warning"
          });
        }
      }
    })
  }

  reject(id: any){
    this.sharedService.startStopLoader(true);
    let Data = {
      id: id,
      state: 'Rejected',
      user_id: this.sharedService.getUserInfo().id
    }
    this.apiService.rejectIssue(Data).subscribe({
      next: (res: any)=>{
        this.sharedService.startStopLoader(false);
        this.getIssueData();
        if(res.status == "Success"){
          Swal.fire({
            title: "Yeah..!",
            text: "Issue has been rejected.",
            icon: "success"
          });
        }else{
          Swal.fire({
            title: "Oops..!",
            text: "Unable to update issue, Try again after sometime. ",
            icon: "warning"
          });
        }
      },
      error: (err: any)=>{
        this.sharedService.startStopLoader(false);
        if(err.status == 401){
          this.sharedService.logout();
          this.router.navigate(['/'])
        }else{
          Swal.fire({
            title: "Oops..!",
            text: err.error.details.message,
            icon: "warning"
          });
        }
      }
    })
  }

  hasAccess(name: any){
    return this.sharedService.hasAccess(name)
  }

  uploadImages(){
      if(this.files.length == 0){
        this.errorMessage = "You have not uploaded any file."
        setTimeout(()=>{ this.errorMessage = ""}, 10000)
        return
      }
      this.sharedService.startStopLoader(true);
      const formData = new FormData();
      this.files.forEach((file, index) => {
        formData.append('files', file); // backend expects 'files' as the key for multiple
      });
  
      formData.append('user_id', this.sharedService.getUserInfo().id);
      formData.append('id', this.id);
  
      this.apiService.updateAttachments(formData).subscribe({
        next: (res: any) => {
          this.sharedService.startStopLoader(false);
          if (res.status == 'Success') {
            Swal.fire({
              title: "",
              text: "Attachments updated successfully",
              icon: "success",
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Ok"
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/pages/issues']);
              }
            });
  
          } else {
            Swal.fire({
              title: "Oops!",
              text: res.message,
              icon: "warning"
            });
          }
        },
        error: (err: any) => {
          this.sharedService.startStopLoader(false);
          if(err.status == 401){
            this.sharedService.logout();
            this.router.navigate(['/'])
          }
          console.log('err', err)
          Swal.fire({
            title: "Oops!",
            text: err.error.details.message,
            icon: "warning"
          });
        }
      });
    }

    getAllLogs(id: any){
      this.sharedService.startStopLoader(true);
      this.apiService.getAllIssueLogs(id).subscribe({
        next: (res: any)=>{
          this.sharedService.startStopLoader(false);
          this.issueLogs = res
        },
        error: (err: any)=>{
          this.sharedService.startStopLoader(false);
          if(err.status == 401){
            this.sharedService.logout();
            this.router.navigate(['/'])
          }
          console.log('err', err)
          Swal.fire({
            title: "Oops!",
            text: err.error.details.message,
            icon: "warning"
          });
        }
      })
    }

    isRecent(dateStr: string): boolean {
      const createdAt = new Date(dateStr);
      const now = new Date();
      const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      return diffInHours <= 24;
    }
}
