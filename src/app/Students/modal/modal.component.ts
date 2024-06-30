import { Component, Input, OnInit, Injectable } from '@angular/core';
import { StudentService } from '../../Services/student.service';
import { AccountResponse } from '../../Dtos/AccountResponse';
import { StudentResponse } from '../../Dtos/StudentResponse';
import { NgbActiveModal, NgbModule, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { CountryService } from '../../Services/country.service';

@Injectable()
export class NgbDateCustomAdapter extends NgbDateAdapter<string> {
  fromModel(value: string | null): NgbDateStruct | null {
    if (!value) return null;
    const parts = value.split('-');
    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      day: parseInt(parts[2], 10),
    };
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}` : null;
  }
}

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
    if (!value) return null;
    const parts = value.split('-');
    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      day: parseInt(parts[2], 10),
    };
  }

  format(date: NgbDateStruct | null): string {
    return date ? `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}` : '';
  }
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, NgbModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateCustomAdapter },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class ModalComponent implements OnInit {
  @Input() studentData: any;
  @Input() isEditMode: boolean = false;

  form = {
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    birthDate: '',
    country: ''
  };

  genders = [
    { name: 'male' },
    { name: 'female' }
  ];

  countries: any[] = [];
  errors: { [key: string]: string } | null = null;
  passwordFieldType: string = 'password';

  constructor(
    public activeModal: NgbActiveModal,
    private studentService: StudentService,
    private countryService: CountryService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {

        this.countries = this.countryService.countries;
        if (this.isEditMode && this.studentData) {
          this.form = {
            firstName: this.studentData.firstName,
            lastName: this.studentData.lastName,
            email: this.studentData.email,
            gender: this.studentData.gender == '0' ?'Male' :'Female',
            birthDate: this.studentData.birthDate,
            country: this.studentData.country
          };
        }
  }

  closeModal(): void {
    this.activeModal.dismiss();
  }

  onSubmit(): void {
    const student = { ...this.form };
    const transformedDate = this.datePipe.transform(student.birthDate, 'yyyy-MM-dd');
    student.birthDate = transformedDate ? transformedDate : '';
  
    if (this.isEditMode && this.studentData) {
      this.studentService.editStudent(this.studentData.id, student).subscribe(
        (response: AccountResponse | StudentResponse) => {
          if (response.isSucceeded) {
            this.errors = null;
            this.activeModal.close(response); // Pass the response back to the parent component
          } else {
            this.errors = response.errors;
          }
        },
        (error) => {
          this.errors = { general: 'An error occurred while updating the student.' };
        }
      );
    } else {
      this.studentService.addStudent(student).subscribe(
        (response: AccountResponse | StudentResponse) => {
          if (response.isSucceeded) {
            this.errors = null;
            this.activeModal.close(response); // Pass the response back to the parent component
          } else {
            this.errors = response.errors;
          }
        },
        (error) => {
          this.errors = { general: 'An error occurred while adding the student.' };
        }
      );
    }
  }
  

  
}
