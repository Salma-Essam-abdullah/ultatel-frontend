import { CommonModule, formatDate } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { StudentService } from '../../Services/student.service';
import { Student } from '../../models/student';
import { AccountService } from '../../Services/core/account.service';
import { NgbActiveModal, NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, NgSelectModule, NgbDatepickerModule],
  templateUrl: './edit-student.component.html',
  styleUrl: './edit-student.component.css'
})
export class EditStudentComponent implements OnInit {
  @Input() studentId!: number;
  @Output() studentEdited = new EventEmitter<Student>();
  model!: NgbDateStruct;
  editForm: FormGroup;
  items = [{ name: 'male' }, { name: 'female' }];
  userId: string;

  constructor(
    public studentService: StudentService,
    public accountService: AccountService,
    public activeModal: NgbActiveModal
  ) {
    this.userId = this.accountService.getClaims().UserId;
    this.editForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      gender: new FormControl('', [Validators.required]),
      birthDate: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      appUserId: new FormControl(this.userId, [Validators.required])
    });
  }

  ngOnInit() {
    if (this.studentId) {
      this.studentService.showStudent(this.studentId).subscribe(student => {
        this.editForm.patchValue({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          gender: student.gender,
          birthDate: {
            year: new Date(student.birthDate).getFullYear(),
            month: new Date(student.birthDate).getMonth() + 1,
            day: new Date(student.birthDate).getDate()
          },
          country: student.country
        });
      });
    }
  }

  editStudent() {
    if (this.editForm.valid) {
      const birthDate = this.editForm.get('birthDate')?.value;
      const formattedBirthDate = formatDate(new Date(birthDate.year, birthDate.month - 1, birthDate.day), 'yyyy-MM-dd', 'en-US');
      const student = new Student(
        this.studentId,
        this.editForm.get('firstName')?.value,
        this.editForm.get('lastName')?.value,
        this.editForm.get('email')?.value,
        this.editForm.get('gender')?.value,
        formattedBirthDate,
        this.editForm.get('country')?.value,
        this.editForm.get('appUserId')?.value,
      );

      this.studentService.editStudent(student.id, student).subscribe(result => {
        if (result) {
          console.log("Edit successful");
          this.studentEdited.emit(student); // Emit event with updated student
          this.activeModal.close(result);
        } else {
          console.log("Edit failed");
        }
      });
    } else {
      console.log("Form is not valid");
    }
  }
}
