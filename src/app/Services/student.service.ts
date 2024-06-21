import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../models/student';
import { DecimalPipe } from '@angular/common';
import { AccountService } from './core/account.service';
import { StudentLogs } from '../models/student-logs';

export interface StudentSearchDto {
  name?: string;
  ageFrom?: number | null;
  ageTo?: number | null;
  country?: string;
  gender?: string;
}
export interface StudentResponse {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: Student[];
}
export interface AddResponse {
  std: Student;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private baseurl = 'http://localhost:5017/api/Student';

  constructor(
    private http: HttpClient,
  ) {}
  searchStudents(searchDto: StudentSearchDto): Observable<Student[]> {
    const url = `${this.baseurl}/Search`;
    return this.http.post<Student[]>(url, searchDto);
  }
  showStudents(
    pageIndex: number = 1,
    pageSize: number = 10
  ): Observable<StudentResponse> {
    const url = `${this.baseurl}`;
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<StudentResponse>(url, { params });
  }
  showStudentsByUserId(
    userId: string,
    pageIndex: number = 1,
    pageSize: number = 10
  ): Observable<StudentResponse> {
    const url = `${this.baseurl}/User/${userId}`;
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<StudentResponse>(url, { params });
  }
  deleteStudent(studentId: number): Observable<void> {
    const url = `${this.baseurl}/${studentId}`;
    return this.http.delete<void>(url);
  }
  showStudent(studentId: number): Observable<Student> {
    const url = `${this.baseurl}/${studentId}`;
    return this.http.get<Student>(url);
  }
  addStudent(userId: string, student: Student): Observable<AddResponse> {
    const url = `${this.baseurl}/${userId}`;
    return this.http.post<AddResponse>(url, student);
  }
  editStudent(id: number, student: Student): Observable<AddResponse> {
    const url = `${this.baseurl}/${id}`;
    return this.http.patch<AddResponse>(url, student);
  }

  showStudentLogs(studentId: number): Observable<StudentLogs[]> {
    const url = `${this.baseurl}/Logs/${studentId}`;
    return this.http.get<StudentLogs[]>(url);
  }
}
