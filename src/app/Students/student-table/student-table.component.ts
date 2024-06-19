import {  CommonModule, DecimalPipe } from '@angular/common';
import { Component ,inject, TemplateRef } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Student } from '../../models/student';
import { StudentResponse, StudentService } from '../../Services/student.service';
import { AgePipe } from '../../pipes/age.pipe';
import Swal from 'sweetalert2'
import { AddStudentComponent } from '../add-student/add-student.component';
import { EditStudentComponent } from '../edit-student/edit-student.component';
import { AccountService } from '../../Services/core/account.service';
import { NavbarComponent } from '../../core/navbar/navbar.component';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-student-table',
  standalone: true,
  imports: [DecimalPipe, CommonModule,AgePipe,AddStudentComponent,EditStudentComponent,NgbPaginationModule,FormsModule,ReactiveFormsModule,NavbarComponent],
  templateUrl: './student-table.component.html',
  providers: [StudentService, DecimalPipe],
  
  styleUrls: ['./student-table.component.css']
})


export class StudentTableComponent {
  errorMessage: string = '';
 

  

  openEditModal(studentId: number) {
    const modalRef = this.modalService.open(EditStudentComponent, { size: 'xl' });
    modalRef.componentInstance.studentId = studentId;
  }


  private modalService = inject(NgbModal);
  openXl(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'xl' });    
  }

  isLoggedIn: boolean = false; 
  students: Student[] = [];
  totalItems: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;
  searchForm: FormGroup;
  userId: string = this.accountService.getClaims().UserId; 
  sortField: string = 'firstName';
  sortDirection: 'asc' | 'desc' = 'asc';
  

  constructor(private studentService: StudentService, private fb: FormBuilder,private agePipe: AgePipe ,public accountService:AccountService) {
    const token = localStorage.getItem("token");
    this.isLoggedIn = !!token; 
    this.searchForm = this.fb.group({
      search: ['']
    });
    
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.showStudentsByUserId(this.userId, this.pageIndex, this.pageSize)
      .pipe(
        catchError((error) => {


         this.errorMessage = 'Error loading students. Please try again later.';
          console.error('Error loading students:', error);
          return throwError(this.errorMessage);
        })
      )
      .subscribe((response: StudentResponse) => {
        this.students = response.data;
        this.totalItems = response.count;
      });
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadStudents();
  }

  onPageSizeChange(): void {
    this.pageIndex = 1;
    this.loadStudents();
  }

  onSearch(): void {
    this.pageIndex = 1;
    // Add search functionality here if applicable
    this.loadStudents();
  }

 
  delete(studentId: number): void {
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
        this.studentService.deleteStudent(studentId).subscribe(
          () => {
            this.students = this.students.filter(student => student.id !== studentId);
            Swal.fire({
              title: "Deleted!",
              text: "Student has been deleted.",
              icon: "success"
            });
          },
          error => {
            console.error('Error deleting student', error);
          }
        );
      }
    });
  }


  show(studentId: number): void {
    this.studentService.showStudent(studentId).subscribe(
      (student: Student) => {
        const age = this.agePipe.transform(student.birthDate);
        Swal.fire({
          title: 'Student Information',
          html: `
            <p><strong>Name:</strong> ${student.firstName} ${student.lastName}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Gender:</strong> ${student.gender === 0 ? 'Male' : 'Female'}</p>
            <p><strong>Age:</strong> ${age}</p>
            <p><strong>Country:</strong> ${student.country}</p>
          `
        });
      },
      error => {
        console.error('Error fetching student', error);
      }
    );
  }

  onStudentEdited(updatedStudent: Student): void {
    this.students = this.students.map(student => student.id === updatedStudent.id ? updatedStudent : student);
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
  
  
  sortData(field: keyof Student): void {
    if (field === this.sortField) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    // Perform sorting
    this.students.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue! < bValue!) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (aValue! > bValue!) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
  
  

}

