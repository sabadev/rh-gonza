import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private apiUrl: string;
  private apiDocsUrl: string;
  private apiAttendanceUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = `${this.configService.apiUrl}/employees`; // URL base para empleados
    this.apiDocsUrl = `${this.configService.apiUrl}/employee-documents`; // URL base para documentos
    this.apiAttendanceUrl = `${this.configService.apiUrl}/attendance`; // URL base para asistencia
  }

  // Métodos para empleados
  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getEmployeeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  createEmployee(employee: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, employee).pipe(catchError(this.handleError));
  }

  updateEmployee(id: string, employee: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, employee).pipe(catchError(this.handleError));
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  updatePassword(id: number, newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/update-password/${id}`;
    return this.http.put(url, { newPassword });
  }


  // Métodos para documentos
  getEmployeeDocuments(employeeId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiDocsUrl}/${employeeId}`).pipe(catchError(this.handleError));
  }

  uploadEmployeeDocument(employeeId: string, document: File, type: string): Observable<any> {
    const formData = new FormData();
    formData.append('document', document);
    formData.append('type', type);

    return this.http.post<any>(`${this.apiDocsUrl}/${employeeId}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  deleteEmployeeDocument(employeeId: string, type: string): Observable<any> {
    return this.http.delete<any>(`${this.apiDocsUrl}/${employeeId}/${type}`).pipe(
      catchError(this.handleError)
    );
  }

  // Métodos para asistencia
  uploadAttendancePhoto(employeeId: number, photo: File, logType: string): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('logType', logType);

    return this.http.post<any>(`${this.apiAttendanceUrl}/${employeeId}/photo`, formData).pipe(
      catchError(this.handleError)
    );
  }

  getAttendancePhotos(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiAttendanceUrl}/${employeeId}/photos`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en el servidor:', error);
    return throwError(() => new Error(error.error?.error || 'Error en el servidor, inténtalo más tarde.'));
  }

  saveAdjustments(employeeId: string, adjustments: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${employeeId}/adjustments`, adjustments).pipe(
      catchError(this.handleError)
    );
  }
}
