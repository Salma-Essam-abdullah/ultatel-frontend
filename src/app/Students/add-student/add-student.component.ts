// import { CommonModule, formatDate } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import {
//   FormControl,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { StudentService } from '../../Services/student.service';
// import { Student } from '../../models/student';
// import { AccountService } from '../../Services/core/account.service';
// import { NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
// import Swal from 'sweetalert2';
// import { Subscription } from 'rxjs';
// import { Router } from '@angular/router';
// @Component({
//   selector: 'app-add-student',
//   standalone: true,
//   imports: [
//     CommonModule,
//     HttpClientModule,
//     ReactiveFormsModule,
    
//     NgbDatepickerModule,
//   ],
//   templateUrl: './add-student.component.html',
//   styleUrls: ['./add-student.component.css'],
// })
// export class AddStudentComponent implements OnInit {
//   @Output() studentAdded = new EventEmitter<Student>();
//   @Input() student!: Student;
//   addStudentComponent: AddStudentComponent | undefined;
//   errorMessage: string = '';
//   model!: NgbDateStruct;
//   addForm: FormGroup;
//   // items = [{ name: 'male' }, { name: 'female' }];
//   userId: string;

//   sub: Subscription | null = null;
//   constructor(
//     public studentService: StudentService,
//     public accountService: AccountService,
//     public router: Router
//   ) {
//     this.userId = "";
//     this.addForm = new FormGroup({
//       firstName: new FormControl('', [Validators.required]),
//       lastName: new FormControl('', [Validators.required]),
//       email: new FormControl('', [Validators.required, Validators.email]),
//       gender: new FormControl('', [Validators.required]),
//       birthDate: new FormControl('', [Validators.required]),
//       country: new FormControl('', [Validators.required]),
//       appUserId: new FormControl(this.userId, [Validators.required]),
//     });
//   }
//   ngOnInit(): void {
//     if (this.student) {
//       this.addForm.patchValue({
//         firstName: this.student.firstName,
//         lastName: this.student.lastName,
//         birthDate: this.formatDateForPicker(this.student.birthDate),
//         email: this.student.email,
//         gender: this.student.gender,
//         country: this.student.country,
//         appUserId:""
//       });
//     }
//   }
//   formatDateForPicker(date: string): any {
//     const dateParts = date.split('-');
//     return {
//       year: parseInt(dateParts[0], 10),
//       month: parseInt(dateParts[1], 10),
//       day: parseInt(dateParts[2], 10)
//     };
//   }

//   addStudent() {
//     if (this.addForm.valid) {
//       const birthDate = this.addForm.get('birthDate')?.value;
//       const formattedBirthDate = formatDate(
//         new Date(birthDate.year, birthDate.month - 1, birthDate.day),
//         'yyyy-MM-dd',
//         'en-US'
//       );

//       const student = new Student(
//         this.addForm.get('id')?.value,
//         this.addForm.get('firstName')?.value,
//         this.addForm.get('lastName')?.value,
//         this.addForm.get('email')?.value,
//         this.addForm.get('gender')?.value,
//         formattedBirthDate,
//         this.addForm.get('country')?.value,
//         this.addForm.get('appUserId')?.value
//       );
//       console.log(this.student);
//       if (this.student) {
//         this.sub = this.studentService
//           .editStudent(this.student.id, student)
//           .subscribe((result) => {
//             if (!result) {
//             }
//             console.log(result.std ? 'Updated successful' : 'Updated failed');
//             Swal.fire({
//               title: 'Great!',
//               text: 'Student Updated Succesfully!',
//               icon: 'success',
//             });
//             this.studentAdded.emit(result.std);
//           });
//       } else {
//         this.sub = this.studentService
//           .addStudent(this.userId, student)
//           .subscribe((result) => {
//             console.log(result.std ? 'Added successful' : 'Added failed');
//             Swal.fire({
//               title: 'Great!',
//               text: 'Student Added Succesfully!',
//               icon: 'success',
//             });
//             this.studentAdded.emit(result.std);
//           });
//       }
//     } else {
//       console.log('Form is not valid');
//       this.errorMessage = 'Please fill out all required fields correctly.'; // Set error message for display
//     }
//   }
//   ngOnDestroy() {
//     this.sub?.unsubscribe;
//   }
// }
