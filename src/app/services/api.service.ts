import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, delay, Observable, retry, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly baseUrl = 'https://675aa756099e3090dbe57669.mockapi.io/atm';

    constructor(private _http: HttpClient) {}

    get<T>(url: string): Observable<T> {
        return this._http.get<T>(`${this.baseUrl}/${url}`).pipe(
          retry(3),
          catchError(this.handleError)
        );
    }
    
    post<T>(url: string, body: any): Observable<T> {
        return this._http.post<T>(`${this.baseUrl}/${url}`, body).pipe(
          catchError(this.handleError)
        );
    }
    
    put<T>(url: string, body: any): Observable<T> {
        return this._http.put<T>(`${this.baseUrl}/${url}`, body).pipe(
          catchError(this.handleError)
        );
    }
    
    delete<T>(url: string): Observable<T> {
        return this._http.delete<T>(`${this.baseUrl}/${url}`).pipe(
          catchError(this.handleError)
        );
    }
    
    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An unknown error occurred!';
        if (error?.error instanceof ErrorEvent) {
          errorMessage = `Client error: ${error?.error.message}`;
        } else {
          errorMessage = `Server error: ${error?.status} - ${error?.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}