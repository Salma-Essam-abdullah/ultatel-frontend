import { Student } from "../models/student";

export interface StudentResponse {
  message: string;
  isSucceeded: boolean;
  errors: {
    [key: string]: string;
  } | null;
  studentDtos: {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: Student[];
  } ;
  studentDto: Student;
}
