import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly baseUrl: string = 'https://api.themoviedb.org/3';
  private readonly headers = new HttpHeaders({
    'Authorization': `Bearer ${environment.token}`
  });

  constructor(private httpClient: HttpClient) {}
  httpGet(endpoint: string, params?: { [key: string]: string | number | boolean }): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key].toString());
      });
    }

    return this.httpClient.get(`${this.baseUrl}/${endpoint}`, { headers: this.headers, params: httpParams })
      .pipe(
        catchError(this.handleError)
      );
  }

  searchMovies(query: string): Observable<any> {
    if (!query.trim()) {
      return throwError(() => new Error('Query string cannot be empty.'));
    }

    return this.httpGet('search/movie', {
      query: encodeURIComponent(query),
      include_adult: false,
      language: 'en-US',
      page: 1
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Failed to fetch movies. Please try again.'));
  }
}
