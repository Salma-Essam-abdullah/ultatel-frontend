import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Student } from '../../models/student';
import {
  
  StudentSearchDto,
  StudentService,
} from '../../Services/student.service';
import { AgePipe } from '../../pipes/age.pipe';
import Swal from 'sweetalert2';
import { AccountService } from '../../Services/core/account.service';
import { NavbarComponent } from '../../core/navbar/navbar.component';
import { catchError, throwError } from 'rxjs';
import { StudentLogs } from '../../models/student-logs';
import { StudentResponse } from '../../Dtos/StudentResponse';
import { AccountResponse } from '../../Dtos/AccountResponse';

@Component({
  selector: 'app-student-table',
  standalone: true,
  imports: [
    DecimalPipe,
    CommonModule,
    AgePipe,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
  ],
  templateUrl: './student-table.component.html',
  providers: [StudentService, DecimalPipe],
  styleUrls: ['./student-table.component.css'],
})
export class StudentTableComponent implements OnInit {
  // @ViewChild('content', { static: true }) content: TemplateRef<any> | undefined;
  // templateContext: any = null;
  // @ViewChild(AddStudentComponent) addStudentComponent:
  //   | AddStudentComponent
  //   | undefined;

  // errorMessage: string = '';
  // openEditModal(student: Student) {
  //   const modalRef = this.modalService.open(AddStudentComponent, {
  //     size: 'xl',
  //   });
  //   modalRef.componentInstance.student = student;
  // }

  // ngAfterViewInit() {
  //   this.addStudentComponent?.studentAdded.subscribe((student) => {
  //     this.UpdateTable(student);
  //     console.log(student);
  //   });
  // }



  // private modalService = inject(NgbModal);
  // openXl(content: TemplateRef<any>, student: Student | null) {
  //   this.modalService.open(content, { size: 'xl' });
  //   this.editStudent(student!);
  // }

  // editStudent(student: Student) {
  //   this.templateContext = {
  //     $implicit: student,
  //   };
  // }

  isLoggedIn: boolean = false;
  isAdmin: string;


  students: Student[] = [];
  totalItems: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;
  sortBy: string = 'name'; // default sorting field
  isDescending: boolean = false; // default sorting order
  student:Student | undefined;



  
  searchForm: FormGroup;
 
  

  searchDto: StudentSearchDto = {};

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder,
    private agePipe: AgePipe,
    public accountService: AccountService,
    private datePipe: DatePipe
  ) {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    this.isAdmin = "false";
    this.searchForm = this.fb.group({
      search: [''],
    });
  }
  // searchStudents() {
  //   this.studentService.searchStudents(this.searchDto).subscribe((response) => {
  //     this.students = response;
  //   });
  // }
  // reset() {
  //   this.searchDto = {
  //     name: '',
  //     ageFrom: null,
  //     ageTo: null,
  //     country: '',
  //     gender: '',
  //   };
  //   this.students = [];
  //   this.loadStudents();
  // }

  ngOnInit(): void {
    this.loadStudents();
  }

  errors: { [key: string]: string } | null = null;
  

  loadStudents() {
    this.studentService.getAllStudents(this.sortBy, this.isDescending, this.pageIndex, this.pageSize).subscribe({
      next: (response: StudentResponse) => {
        if (response.isSucceeded) {
          console.log('Students retrieved successfully');
          this.errors = null;
          this.students = response.studentDtos.data;
          this.totalItems = response.studentDtos.count;
        } else {
          console.error('Student retrieval failed', response.errors);
          this.errors = response.errors;
        }
      },
      error: (err) => {
        console.error('An error occurred while retrieving students', err);
        this.errors = { general: 'An error occurred while retrieving students.' };
      }
    });
  }
  

  toggleSort(field: string) {
    if (this.sortBy === field) {
      this.isDescending = !this.isDescending;
    } else {
      this.sortBy = field;
      this.isDescending = false; // default to ascending on new sort field
    }
    this.loadStudents();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadStudents();
  }
  

onPageSizeChange(): void {
  this.pageIndex = 1; 
  this.loadStudents();
}


  delete(studentId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentService.deleteStudent(studentId).subscribe({
          next: (response: AccountResponse) => {
            if (response.isSucceeded) {
              Swal.fire({
                title: 'Deleted!',
                text: 'Student has been deleted.',
                icon: 'success',
              });
              console.log('Student deleted successfully');
              this.loadStudents();
            } else {
              console.error('Student deletion failed', response.errors);
              this.errors = response.errors;
            }
          },
          error: (err) => {
            console.error('An error occurred while deleting the student', err);
            this.errors = { general: 'An error occurred while deleting the student.' };
          }
        });
      }
    });
  }
  
  

  show(studentId: number): void {
    this.studentService.getStudent(studentId).subscribe({
      next: (response: StudentResponse) => {
        if (response.isSucceeded) {
          console.log('Students retrieved successfully');
          this.errors = null;
         this.student = response.studentDto;


         const age = this.agePipe.transform(this.student.birthDate);
         Swal.fire({
           title: 'Student Information',
           html: `
             <p><strong>Name:</strong> ${this.student.firstName} ${
              this.student.lastName
           }</p>
             <p><strong>Email:</strong> ${this.student.email}</p>
             <p><strong>Gender:</strong> ${
              this.student.gender === 0 ? 'Male' : 'Female'
             }</p>
             <p><strong>Age:</strong> ${age}</p>
             <p><strong>Country:</strong> ${this.student.country}</p>
           `,
         });
        } else {
          console.error('Student retrieval failed', response.errors);
          this.errors = response.errors;
        }
      },
      error: (err) => {
        console.error('An error occurred while retrieving students', err);
        this.errors = { general: 'An error occurred while retrieving students.' };
      }
    });
  }


  // showLogs(studentId: number): void {
  //   this.studentService.showStudentLogs(studentId).subscribe(
  //     (studentLogs: StudentLogs[]) => {
  //       const logsHtml = studentLogs
  //         .map(
  //           (std) => `
  //         <p><strong>Operation:</strong> ${std.operation}</p>
  //         <p><strong>Operation Time:</strong> ${this.datePipe.transform(
  //           std.operationTime,
  //           'd/M/y'
  //         )}</p>
  //         <p><strong>User Name:</strong> ${std.userName}</p>
  //         <hr>
  //       `
  //         )
  //         .join('');

  //       Swal.fire({
  //         title: 'Student Logs',
  //         html: logsHtml,
  //         width: '600px', // Optional: Adjust the width if needed
  //         showCloseButton: true,
  //         focusConfirm: false,
  //         confirmButtonText: 'Close',
  //       });
  //     },
  //     (error) => {
  //       console.error('Error fetching student logs', error);
  //     }
  //   );
  // }


  getCurrentRange(): string {
    if (this.totalItems === 0) {
      return 'No entries';
    }
    const start = (this.pageIndex - 1) * this.pageSize + 1;
    const end = Math.min(this.pageIndex * this.pageSize, this.totalItems);

    return `Showing ${start} to ${end} from ${this.totalItems} entries`;
  }

  goToFirstPage(): void {
    if (this.pageIndex !== 1) {
      this.pageIndex = 1;
      this.loadStudents();
    }
  }

  goToLastPage(): void {
    const lastPage = Math.ceil(this.totalItems / this.pageSize);
    if (this.pageIndex !== lastPage) {
      this.pageIndex = lastPage;
      this.loadStudents();
    }
  }


  UpdateTable(AddedStudent: Student) {
    const studentIndex = this.students.findIndex(
      (student) => AddedStudent.id === student.id
    );
    if (studentIndex != -1) {
      this.students[studentIndex] = AddedStudent;
    }
    this.students.push(AddedStudent);
  }
}
