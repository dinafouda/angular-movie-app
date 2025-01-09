import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { environment } from '../../../environments/environment.development';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });
    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a movie search', () => {
    const mockResponse = { results: [{ title: 'Test Movie' }] };
    const query = 'test';
    service.searchMovies(query).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/search/movie?query=test&include_adult=false&language=en-US&page=1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${environment.token}`);
    req.flush(mockResponse);
  });

  it('should throw an error if query is empty', () => {
    service.searchMovies('').subscribe({
      next: () => fail('Expected an error'),
      error: (error) => expect(error.message).toBe('Query string cannot be empty.')
    });
  });

  it('should handle HTTP errors', () => {
    const query = 'test';
    service.searchMovies(query).subscribe({
      next: () => fail('Expected an error'),
      error: (error) => expect(error.message).toBe('Failed to fetch movies. Please try again.')
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/search/movie?query=test&include_adult=false&language=en-US&page=1`);
    req.error(new ErrorEvent('Network error'));
  });
});
