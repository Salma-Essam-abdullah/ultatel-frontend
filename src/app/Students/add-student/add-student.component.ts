import { CommonModule, formatDate } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { StudentService } from '../../Services/student.service';
import { Student } from '../../models/student';
import { AccountService } from '../../Services/core/account.service';
import { NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, NgSelectModule, NgbDatepickerModule],
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent {
  model!: NgbDateStruct;
  addForm: FormGroup;
  items = [{ name: 'male' }, { name: 'female' }];
  userId: string;

  constructor(public studentService: StudentService, public accountService: AccountService) {
    this.userId = this.accountService.getClaims().UserId;
    this.addForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      gender: new FormControl('', [Validators.required]),
      birthDate: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      appUserId: new FormControl(this.userId, [Validators.required])
    });
  }

  
  addStudent() {
    if (this.addForm.valid) {
      const birthDate = this.addForm.get('birthDate')?.value;
      const formattedBirthDate = formatDate(new Date(birthDate.year, birthDate.month - 1, birthDate.day), 'yyyy-MM-dd', 'en-US');

      const student = new Student(
        this.addForm.get('id')?.value,
        this.addForm.get('firstName')?.value,
        this.addForm.get('lastName')?.value,
        this.addForm.get('email')?.value,
        this.addForm.get('gender')?.value,
        formattedBirthDate,
        this.addForm.get('country')?.value,
        this.addForm.get('appUserId')?.value
      );
      this.studentService.addStudent(this.userId, student).subscribe(result => {
        
        console.log(result ? "Added successful" : "Added failed");
        Swal.fire({
          title: "Great!",
          text: "Student Added Succesfully!",
          icon: "success"
        });
      });
    } else {
      console.log("Form is not valid");
    }
  }
}
