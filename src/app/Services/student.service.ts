import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Student } from '../models/student';
import { StudentResponse } from '../Dtos/StudentResponse';
import { AccountResponse } from '../Dtos/AccountResponse';

export interface StudentSearchDto {
  name?: string;
  ageFrom?: number | null;
  ageTo?: number | null;
  country?: string;
  gender?: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private baseurl = 'http://localhost:5017/api/Student';

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
          students: response.students,
          studentDto: response.studentDto
        };
      })
    );
  }
  
  

  // searchStudents(searchDto: StudentSearchDto): Observable<StudentResponse> {
  //   const url = `${this.baseurl}/Search`;
  //   return this.http.post<Student[]>(url, searchDto);
  // }

  deleteStudent(studentId: number): Observable<AccountResponse> {
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
  
  getStudent(id:number): Observable<StudentResponse> {
    const url = `${this.baseurl}/${id}`;
   
    return this.http.get<StudentResponse>(url).pipe(
      map((response: StudentResponse) => {
        return {
          message: response.message,
          isSucceeded: response.isSucceeded,
          errors: response.errors,
          studentDtos: response.studentDtos,
          students: response.students,
          studentDto: response.studentDto
        };
      })
    );
  }
  // addStudent(userId: string, student: Student): Observable<Studegit push origin devntResponse> {
  //   const url = `${this.baseurl}/${userId}`;
  //   return this.http.post<StudentResponse>(url, student);
  // }
  // editStudent(id: number, student: Student): Observable<StudentResponse> {
  //   const url = `${this.baseurl}/${id}`;
  //   return this.http.patch<StudentResponse>(url, student);
  // }

  // showStudentLogs(studentId: number): Observable<StudentLogs[]> {
  //   const url = `${this.baseurl}/Logs/${studentId}`;
  //   return this.http.get<StudentLogs[]>(url);
  // }

}