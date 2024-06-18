import { HttpClient } from '@angular/common/http';
import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Student } from '../models/student';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from '../directives/sortable.directive';
import { DecimalPipe } from '@angular/common';

interface SearchResult {
	students: Student[];
	total: number;
}

interface State {
	page: number;
	pageSize: number;
	searchTerm: string;
	sortColumn: SortColumn;
	sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(students: Student[], column: SortColumn, direction: string): Student[] {
	if (direction === '' || column === '') {
		return students;
	} else {
		return [...students].sort((a, b) => {
			const res = compare(a[column], b[column]);
			return direction === 'asc' ? res : -res;
		});
	}
}

function matches(student: Student, term: string, pipe: PipeTransform) {
	return (
		student.firstName.toLowerCase().includes(term.toLowerCase()) ||
    student.lastName.toLowerCase().includes(term.toLowerCase()) ||
    student.email.toLowerCase().includes(term.toLowerCase()) ||
    student.gender.toLowerCase().includes(term.toLowerCase()) ||
    student.country.toLowerCase().includes(term.toLowerCase()) ||
    pipe.transform(student.birthDate).includes(term)
	);
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseurl = "http://localhost:5017/api/Student";
  private _loading$ = new BehaviorSubject<boolean>(true);
	private _search$ = new Subject<void>();
	private _students$ = new BehaviorSubject<Student[]>([]);
	private _total$ = new BehaviorSubject<number>(0);

	private _state: State = {
		page: 1,
		pageSize: 4,
		searchTerm: '',
		sortColumn: '',
		sortDirection: '',
	};

  constructor(private http: HttpClient, private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false)),
    ).subscribe(result => {
      this._students$.next(result.students);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get students$() { return this._students$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    return this.http.get<Student[]>(`${this.baseurl}/ShowStudent`).pipe(
      switchMap(students => {
       
        let sortedStudents = sort(students, sortColumn, sortDirection);

        sortedStudents = sortedStudents.filter(student => matches(student, searchTerm, this.pipe));
        const total = sortedStudents.length;

        sortedStudents = sortedStudents.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({ students: sortedStudents, total });
      })
    );
  }

  showStudents():Observable<Student>{
    const url = `${this.baseurl}/ShowStudent`;
    return this.http.get<Student>(url);
  }
  deleteStudent(studentId: number): Observable<void> {
    const url = `${this.baseurl}/DeleteStudent/${studentId}`;
    return this.http.delete<void>(url);
  }
  showStudent(studentId: number): Observable<Student> {
    const url = `${this.baseurl}/ShowStudent/${studentId}`;
    return this.http.get<Student>(url);
  }
}
