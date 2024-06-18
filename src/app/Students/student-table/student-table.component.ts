  import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
  import { Component, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
  import { Observable, of, switchMap } from 'rxjs';
  import { FormsModule } from '@angular/forms';
  import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
  import { Student } from '../../models/student';
  import { StudentService } from '../../Services/student.service';
  import { NgbdSortableHeader, SortEvent } from '../../directives/sortable.directive';
  import { AgePipe } from '../../pipes/age.pipe';
  import Swal from 'sweetalert2'
  @Component({
    selector: 'app-student-table',
    standalone: true,
    imports: [DecimalPipe, FormsModule, AsyncPipe, NgbHighlight, NgbdSortableHeader, NgbPaginationModule,CommonModule,AgePipe],
    templateUrl: './student-table.component.html',
    providers: [StudentService, DecimalPipe],
    
    styleUrls: ['./student-table.component.css']
  })




  
  export class StudentTableComponent implements AfterViewInit {
    students$: Observable<Student[]>;
    total$: Observable<number>;

    @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;


    constructor(public service: StudentService,private agePipe: AgePipe ) {
      this.students$ = service.students$;
      this.total$ = service.total$;
    }

    ngAfterViewInit() {
      this.headers.changes.subscribe(() => {
        this.initializeHeaders();
      });
      this.initializeHeaders();
    }

    initializeHeaders() {
      this.headers.forEach(header => {
        header.direction = '';
      });
    }

    onSort({ column, direction }: SortEvent) {
    
      this.headers.forEach((header) => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });

      this.service.sortColumn = column;
      this.service.sortDirection = direction;
    }

    trackByStudentId(index: number, student: Student): number {
      return student.id; 
    }
  
delete(studentId: number) {
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
      this.service.deleteStudent(studentId).subscribe(
        () => {
          if (this.students$) {
            this.students$ = this.students$.pipe(
              switchMap(students => {
                if (students) {
                  return of(students.filter(student => student.id !== studentId));
                } else {
                  return of([]);
                }
              })
            );
          } else {
            console.error('students$ Observable is null or undefined.');
          }
        },
        error => {
          console.error('Error deleting student', error);
        }
      );
      Swal.fire({
        title: "Deleted!",
        text: "Student has been deleted.",
        icon: "success"
      });
    }
  });

 
}

show(studentId: number) {
  this.service.showStudent(studentId).subscribe(
    (student: Student) => {
      const age = this.agePipe.transform(student.birthDate);
      Swal.fire({
        title: 'Student Information',
        html: `
          <p><strong>Name:</strong> ${student.firstName} ${student.lastName}</p>
          <p><strong>Email:</strong> ${student.email}</p>
          <p><strong>Gender:</strong> ${student.gender}</p>
          <p><strong>Age:</strong> : ${age}</p>
          <p><strong>Country:</strong> ${student.country}</p>
        `,
      
      });
    },
    error => {
      console.error('Error fetching student', error);
    }
  );
}
  }

