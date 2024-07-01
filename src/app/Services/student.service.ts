import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Student } from '../models/student';
import { StudentResponse } from '../Dtos/StudentResponse';
import { AccountResponse } from '../Dtos/AccountResponse';
import { Search } from '../models/search';
import { StudentForm } from '../models/student-form';
import { StudentLogs } from '../models/student-logs';


@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private baseurl = 'http://ultatel-students.us-east-2.elasticbeanstalk.com/api/Student';
  constructor(
    private http: HttpClient,
  ) {}

  getAllStudents(sortBy: string = 'name', isDescending: boolean = false, pageIndex: number = 1, pageSize: number = 10): Observable<StudentResponse> {
    const url = `${this.baseurl}`;
    let params = new HttpParams()
      .set('sortBy', sortBy)
      .set('isDescending', isDescending.toString())
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
  
    return this.http.get<StudentResponse>(url, { params }).pipe(
      map((response: StudentResponse) => {
        return {
          message: response.message,
          isSucceeded: response.isSucceeded,
          errors: response.errors,
          studentDtos: {
            pageIndex: response.studentDtos.pageIndex,
            pageSize: response.studentDtos.pageSize,
            count: response.studentDtos.count,
            data: response.studentDtos.data,
          },
       
          studentDto: response.studentDto
        };
      })
    );
  }

  searchStudents(sortBy: string = 'name', isDescending: boolean = false, pageIndex: number = 1, pageSize: number = 10,search: Search): Observable<StudentResponse> {
    const url = `${this.baseurl}/Search`;
    let params = new HttpParams()
    .set('sortBy', sortBy)
    .set('isDescending', isDescending.toString())
    .set('pageIndex', pageIndex.toString())
    .set('pageSize', pageSize.toString());
    return this.http.post<StudentResponse>(url,search,{ params }).pipe(
      map((response: StudentResponse) => {
        return {
          message: response.message,
          isSucceeded: response.isSucceeded,
          errors: response.errors,
          studentDtos: {
            pageIndex: response.studentDtos.pageIndex,
            pageSize: response.studentDtos.pageSize,
            count: response.studentDtos.count,
            data: response.studentDtos.data,
          },
        
          studentDto: response.studentDto
        };
      })
    );
  }

  deleteStudent(studentId: string): Observable<AccountResponse> {
    const url = `${this.baseurl}/${studentId}`;
    return this.http.delete<AccountResponse>(url).pipe(
      catchError((error) => {
        const accountResponse: AccountResponse = {
          message: error.error.message || 'An error occurred while deleting the student.',
          isSucceeded: false,
          errors: error.error.errors || null,
        };
        return of(accountResponse);
      })
    );
  }
  
  getStudent(id:string): Observable<StudentResponse> {
    const url = `${this.baseurl}/${id}`;
   
    return this.http.get<StudentResponse>(url).pipe(
      map((response: StudentResponse) => {
        return {
          message: response.message,
          isSucceeded: response.isSucceeded,
          errors: response.errors,
          studentDtos: response.studentDtos,
          studentDto: response.studentDto
        };
      })
    );
  }
  addStudent(student: StudentForm ): Observable<StudentResponse | AccountResponse> {
    const url = `${this.baseurl}`;
    return this.http.post<StudentResponse>(url, student).pipe(
      map((response: StudentResponse) => ({
        message: response.message,
        isSucceeded: response.isSucceeded,
        errors: response.errors,
        studentDtos: response.studentDtos,
        studentDto: response.studentDto
      })),
      catchError((error) => {
        const accountResponse: AccountResponse = {
          message: error.error.message || 'Validation Error',
          isSucceeded: false,
          errors: error.error.errors || null,
        };
        return of(accountResponse);
      })
    );
  }
  
  editStudent(id: number, student: StudentForm): Observable<StudentResponse | AccountResponse> {
    const url = `${this.baseurl}/${id}`;
    console.log('Sending PATCH request to:', url); // Debugging log
    console.log('Student data being sent:', student); // Debugging log

    return this.http.patch<StudentResponse>(url, student).pipe(
      map((response: StudentResponse) => {
        console.log('PATCH response:', response); // Debugging log
        return {
          message: response.message,
          isSucceeded: response.isSucceeded,
          errors: response.errors,
          studentDtos: response.studentDtos,
          studentDto: response.studentDto
        };
      }),
      catchError((error) => {
        console.error('Error occurred:', error); // Debugging log
        const accountResponse: AccountResponse = {
          message: error.error.message || 'Validation Error',
          isSucceeded: false,
          errors: error.error.errors || null,
        };
        return of(accountResponse);
      })
    );
  }
  showStudentLogs(studentId: string): Observable<StudentLogs> {
    const url = `${this.baseurl}/Logs/${studentId}`;
    return this.http.get<StudentLogs>(url);
  }

}