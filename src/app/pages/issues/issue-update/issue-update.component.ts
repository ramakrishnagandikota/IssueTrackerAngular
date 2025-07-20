import { Component, OnInit, ViewChild } from '@angular/core';
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

interface IssueImg {
  Id: string;
  file_name: string;
  size: string;
  created_at: string;
}

@Component({
  selector: 'app-issue-update',
  standalone: false,
  templateUrl: './issue-update.component.html',
  styleUrl: './issue-update.component.scss'
})
export class IssueUpdateComponent implements OnInit {
  issueForm!: FormGroup;
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
  errorMessage: any = ''

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
    this.initForm();
    this.getMasterData();
  }

  initForm() {
    this.issueForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['', [Validators.required]],
      state: ['', [Validators.required]],
      azure_ticket_no: [''],
      priority: ['', [Validators.required]]
    });
  }

  async getMasterData() {
    this.sharedService.startStopLoader(true);
    await this.apiService.getMasterData().subscribe({
      next: (res: any) => {
        this.state = res.state.filter((item:any) => {
          const name = item.state_name.toLowerCase();
          return name !== 'approved' && name !== 'rejected' && name !== 'in review';
        });;
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
          this.issueForm.get('id')?.setValue(res.id);
          this.issueForm.get('title')?.setValue(res.title);
          this.issueForm.get('description')?.setValue(res.description);
          this.issueForm.get('type')?.setValue(res.type);
          this.issueForm.get('state')?.setValue(res.state);
          this.issueForm.get('azure_ticket_no')?.setValue(res.azure_ticket_no);
          this.issueForm.get('priority')?.setValue(res.priority);
          //this.issueForm.get('user_id')?.setValue(this.sharedService.getUserInfo().id)

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

  createTicket() {
    const formData = {
      ...this.issueForm.value,
      user_id: this.sharedService.getUserInfo().id  // assuming you have this from auth token
    };
    this.apiService.updateTask(formData).subscribe({
      next: (res: any) => {
        this.sharedService.startStopLoader(false);
        if (res.status == 'Success') {
          Swal.fire({
            title: "",
            text: "Issue updated successfully",
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
        this.apiService.deleteFile(image.id).subscribe({
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

  uploadImages(){
    if(this.files.length == 0){
      this.errorMessage = "You have not uploaded any file."
      setTimeout(()=>{ this.errorMessage = ""}, 10000)
      return
    }
    const formData = new FormData();
    this.files.forEach((file, index) => {
      formData.append('files', file); // backend expects 'files' as the key for multiple
    });

    formData.append('user_id', this.sharedService.getUserInfo().id);
    formData.append('id', this.issueForm.value.id);

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
}
