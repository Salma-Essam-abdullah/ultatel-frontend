import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  NgForm,
} from '@angular/forms';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Student } from '../../models/student';
import {
  StudentService,
} from '../../Services/student.service';
import { AgePipe } from '../../pipes/age.pipe';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../core/navbar/navbar.component';
import { StudentResponse } from '../../Dtos/StudentResponse';
import { AccountResponse } from '../../Dtos/AccountResponse';
import { NgSelectModule } from '@ng-select/ng-select';
import { CountryService } from '../../Services/country.service';
import { ModalComponent } from '../modal/modal.component';
import { StudentLogs } from '../../models/student-logs';
import { AccountService } from '../../Services/core/account.service';

@Component({
  selector: 'app-student-table',
  standalone: true,
  imports: [
    DecimalPipe,
    CommonModule,
    AgePipe,
    NgbPaginationModule,
    FormsModule,
    NavbarComponent,
    NgSelectModule
  ],
  templateUrl: './student-table.component.html',
  providers: [StudentService, DecimalPipe],
  styleUrls: ['./student-table.component.css'],
})
export class StudentTableComponent implements OnInit {
  students: Student[] = [];
  totalItems: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;
  sortBy: string = 'name';
  isDescending: boolean = false;
  student: Student | undefined;
  studentLogs: StudentLogs | undefined;
  errors: { [key: string]: string } | null = null;
  countries: any[] = [];
  form: any = {};
  isSearching: boolean = false;
  isSuperAdmin: string;

  genders = [
    { name: 'male' },
    { name: 'female' }
  ];

  constructor(
    private studentService: StudentService,
    private agePipe: AgePipe,
    private countryService: CountryService,
    private modalService: NgbModal,
    private accountService: AccountService,
    private datePipe: DatePipe
  ) {
    this.isSuperAdmin = this.accountService.getClaims().IsSuperAdmin;
  }

  ngOnInit(): void {
    this.loadStudents();
    this.countries = this.countryService.countries;
  }

  onSearch(form: NgForm) {
    this.isSearching = true;
    this.pageIndex = 1; // Reset to first page
    this.executeSearch();
  }

  executeSearch() {
    const searchParams = {
      ...this.form,
      sortBy: this.sortBy,
      isDescending: this.isDescending,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    };

    this.studentService.searchStudents(this.sortBy, this.isDescending, this.pageIndex, this.pageSize, searchParams).subscribe({
      next: (response: StudentResponse) => {
        if (response.isSucceeded) {
          this.errors = null;
          this.students = response.studentDtos.data;
          this.pageIndex = response.studentDtos.pageIndex;
          this.pageSize = response.studentDtos.pageSize;
          this.totalItems = response.studentDtos.count;
        } else {
          this.errors = response.errors;
        }
      },
      error: (err) => {
        this.errors = { general: 'An error occurred while searching for students.' };
      }
    });
  }

  loadStudents() {
    if (this.isSearching) {
      this.executeSearch();
    } else {
      this.studentService.getAllStudents(this.sortBy, this.isDescending, this.pageIndex, this.pageSize).subscribe({
        next: (response: StudentResponse) => {
          if (response.isSucceeded) {
            this.errors = null;
            this.students = response.studentDtos.data;
            this.totalItems = response.studentDtos.count;
          } else {
            this.errors = response.errors;
          }
        },
        error: (err) => {
          this.errors = { general: 'An error occurred while retrieving students.' };
        }
      });
    }
  }

  toggleSort(field: string) {
    if (this.sortBy === field) {
      this.isDescending = !this.isDescending;
    } else {
      this.sortBy = field;
      this.isDescending = false;
    }
    this.pageIndex = 1;
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

  delete(studentId: string) {
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
              this.loadStudents();
            } else {
              this.errors = response.errors;
            }
          },
          error: (err) => {
            this.errors = { general: 'An error occurred while deleting the student.' };
          }
        });
      }
    });
  }

  show(studentId: string): void {
    this.studentService.getStudent(studentId).subscribe({
      next: (response: StudentResponse) => {
        if (response.isSucceeded) {
          this.errors = null;
          this.student = response.studentDto;

          const age = this.agePipe.transform(this.student.birthDate);
          Swal.fire({
            title: 'Student Information',
            html: `
              <p><strong>Name:</strong> ${this.student.firstName} ${this.student.lastName}</p>
              <p><strong>Email:</strong> ${this.student.email}</p>
              <p><strong>Gender:</strong> ${this.student.gender === 0 ? 'Male' : 'Female'}</p>
              <p><strong>Age:</strong> ${age}</p>
              <p><strong>Country:</strong> ${this.student.country}</p>
            `,
          });
        } else {
          this.errors = response.errors;
        }
      },
      error: (err) => {
        this.errors = { general: 'An error occurred while retrieving students.' };
      }
    });
  }

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

  resetSearch(): void {
    this.form = {};
    this.isSearching = false;
    this.pageIndex = 1;
    this.loadStudents();
  }

  onAddStudent() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.isEditMode = false;

    modalRef.result.then(
      (result) => {
        if (result.isSucceeded) {
          this.loadStudents();
          Swal.fire('Success', 'Student added successfully', 'success');
        }
      },
      (reason) => {
        console.log('Dismissed');
      }
    );
  }

  onEditStudent(student: Student) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.isEditMode = true;
    modalRef.componentInstance.studentData = student;

    modalRef.result.then(
      (result) => {
        if (result.isSucceeded) {
          this.loadStudents();
          Swal.fire('Success', 'Student updated successfully', 'success');
        }
      },
      (reason) => {
        console.log('Modal dismissed');
      }
    ).catch((error) => {
      console.error('Error during modal handling:', error);
    });
  }

  showLogs(studentId: string): void {
    this.studentService.showStudentLogs(studentId).subscribe({
      next: (logs) => {
        Swal.fire({
          title: 'Student Logs Information',
          html: `
            <p><strong>Created By:</strong> ${logs.createUserName}</p>
            <p><strong>Created At:</strong> ${this.formatDate(logs.createTimeStamps)}</p>
            <p><strong>Last Updated By:</strong> ${logs.updateUserName || 'N/A'}</p>
            <p><strong>Updated At:</strong> ${this.formatDate(logs.updateTimeStamps) || 'N/A'}</p>
          `
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'Failed to load student logs. Please try again later.',
          icon: 'error'
        });
      }
    });
  }

  formatDate(dateString: string | null): string | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm');
  }
}
