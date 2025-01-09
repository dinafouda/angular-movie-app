import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CategoryComponent } from './category.component';
import { MovieService } from '../../shared/service/movie.service';
import { Endpoints } from '../../shared/constant/Endpoints';
import { ActivatedRoute } from '@angular/router';
import { MovieResult, MoviesData } from '../../shared/interfaces/models/movies.interface';
import { TVResult, TVData } from '../../shared/interfaces/models/tv.interface';
import { UrlSegment } from '@angular/router';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let movieService: jasmine.SpyObj<MovieService>;

  let activatedRouteStub: Partial<ActivatedRoute> = {
    url: of([new UrlSegment('movie', {})]),
  };

  const mockMoviesData: MoviesData = {
    page: 1,
    total_pages: 1,
    total_results: 1,
    results: [
      {
        id: 1,
        backdrop_path: '/movie_backdrop.jpg',
        original_title: 'Test Movie',
        vote_average: 8.5,
      } as MovieResult,
    ],
  };


  const mockTvData: TVData = {
    page: 1,
    total_pages: 1,
    total_results: 1,
    results: [
      {
        id: 1,
        backdrop_path: '/tv_backdrop.jpg',
        original_name: 'Test TV Show',
        vote_average: 9.0,
      } as TVResult,
    ],
  };

  beforeEach(async () => {
    movieService = jasmine.createSpyObj('MovieService', ['httpGet']);


    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [CategoryComponent],
      providers: [
        { provide: MovieService, useValue: movieService },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies data on initialization', () => {
    movieService.httpGet.and.returnValue(of(mockMoviesData));

    component.ngOnInit();

    expect(movieService.httpGet).toHaveBeenCalledWith(Endpoints.MOVIES);
    expect(component.movieCards).toEqual([
      {
        img: `${Endpoints.IMAGE_BASE}/w500/movie_backdrop.jpg`,
        movieName: 'Test Movie',
        rate: 8.5,
        onClick: jasmine.any(Function),
      },
    ]);
  });

  it('should fetch TV data on initialization', () => {
    activatedRouteStub.url = of([new UrlSegment('tv', {})]);
    movieService.httpGet.and.returnValue(of(mockTvData));

    component.ngOnInit();

    expect(movieService.httpGet).toHaveBeenCalledWith(Endpoints.TV_SHOWS);
    expect(component.movieCards).toEqual([
      {
        img: `${Endpoints.IMAGE_BASE}/w500/tv_backdrop.jpg`,
        movieName: 'Test TV Show',
        rate: 9.0,
        onClick: jasmine.any(Function),
      },
    ]);
  });

  it('should handle error when fetching movies data', () => {
    spyOn(console, 'error');
    movieService.httpGet.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith(new Error('Error'));
  });

  it('should navigate to the correct path when onClick is triggered', () => {
    const navigateSpy = spyOn(component['router'], 'navigateByUrl');
    movieService.httpGet.and.returnValue(of(mockMoviesData));

    component.ngOnInit();
    if (component.movieCards[0]?.onClick) {
      component.movieCards[0].onClick();
    }

    expect(navigateSpy).toHaveBeenCalledWith('movie/1');
  });
});
