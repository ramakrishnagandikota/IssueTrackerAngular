import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { SharedService } from '../../../Services/shared.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issue-create',
  standalone: false,
  templateUrl: './issue-create.component.html',
  styleUrl: './issue-create.component.scss'
})
export class IssueCreateComponent implements OnInit {

  issueForm!: FormGroup
  state: any = []
  priority: any = []
  type: any = []
  files: File[] = [];
  fixState: any
  submitted: boolean = false

  constructor(private fb: FormBuilder, private apiService: ApiService, private sharedService: SharedService, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
    this.getMasterData()
  }

  initForm() {
    this.issueForm = this.fb.group({
      title: ['', [Validators.required, Validators.pattern(/^(?! )[^\s]+(?: [^\s]+)*$/), Validators.minLength(2), Validators.max(150)]],
      description: ['', [Validators.required]],
      type: ['', [Validators.required]],
      state: ['', [Validators.required]],
      azure_ticket_no: [''],
      priority: ['', [Validators.required]]
    })
  }

  getMasterData() {
    this.sharedService.startStopLoader(true);
    this.apiService.getMasterData().subscribe({
      next: (res: any) => {
        this.state = res.state;
        this.priority = res.priority
        this.type = res.type

        const dat = res.state.filter((x: any)=> x.state_name == 'Todo');
        console.log('res', dat[0].id)
        this.issueForm.get('state')?.setValue(dat[0].id)
        this.issueForm.get('state')?.disable();
        this.sharedService.startStopLoader(false);
      },
      error: (err: any) => {
        this.sharedService.startStopLoader(false);
        Swal.fire({
          title: "Oops!",
          text: err.error.details.message,
          icon: "warning"
        });
      }
    })
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
    this.submitted = true;
    if(this.issueForm.invalid){
      return;
    }
    this.sharedService.startStopLoader(true);
    const formData = new FormData();
    formData.append('title', this.issueForm.get('title')?.value);
    formData.append('description', this.issueForm.get('description')?.value);
    formData.append('type', this.issueForm.get('type')?.value);
    formData.append('state', this.issueForm.get('state')?.value);
    formData.append('azure_ticket_no', this.issueForm.get('azure_ticket_no')?.value);
    formData.append('priority', this.issueForm.get('priority')?.value);
    formData.append('user_id', this.sharedService.getUserInfo().id);
    if(this.files.length > 0){
      this.files.forEach((file, index) => {
        formData.append('files', file); // backend expects 'files' as the key for multiple
      });
    }else{
      this.files = []
      //formData.append('files', new Blob());
    }
    

    this.apiService.uploadTask(formData).subscribe({
      next: (res: any) => {
        this.sharedService.startStopLoader(false);
        if (res.status == 'Success') {
          Swal.fire({
            title: "",
            text: "Issue created successfully",
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
