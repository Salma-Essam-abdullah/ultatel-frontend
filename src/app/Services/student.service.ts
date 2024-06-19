import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Student } from '../models/student';
import { catchError, debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from '../directives/sortable.directive';
import { DecimalPipe } from '@angular/common';

export interface StudentResponse {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: Student[];
}


@Injectable({
  providedIn: 'root'
})


export class StudentService {
  private baseurl = "http://localhost:5017/api/Student";
 
  constructor(private http: HttpClient, private pipe: DecimalPipe) {

  }
 

  showStudents():Observable<Student>{
    const url = `${this.baseurl}/ShowAllStudents`;
    return this.http.get<Student>(url);
  }

  showStudentsByUserId(userId: string, pageIndex: number = 1, pageSize: number = 10): Observable<StudentResponse> {
    const url = `${this.baseurl}/ShowAllStudents/${userId}`;
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<StudentResponse>(url, { params });
  }
  deleteStudent(studentId: number): Observable<void> {
    const url = `${this.baseurl}/DeleteStudent/${studentId}`;
    return this.http.delete<void>(url);
  }
  showStudent(studentId: number): Observable<Student> {
    const url = `${this.baseurl}/ShowStudent/${studentId}`;
    return this.http.get<Student>(url);
  }
  addStudent(userId: string, student: Student): Observable<any> {
    const url = `${this.baseurl}/addStudent/${userId}`;
    return this.http.post<any>(url,student).pipe(
      map((response) => {
        console.log(response);
        return response;
      }),
      catchError((error) => {
        console.error("Error occurred during adding student:", error);
        return of(null);
      })
    );
  }  
  editStudent(id: number, student: Student):  Observable<any> {
    const url = `${this.baseurl}/updateStudent/${id}`;
    return this.http.patch<any>(url,student).pipe(
      map((response) => {
        console.log(response);
        return response;
      }),
      catchError((error) => {
        console.error("Error occurred during updating student:", error);
        return of(null);
      })
    );
  }
}