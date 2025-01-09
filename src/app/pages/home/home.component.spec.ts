import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { MovieService } from '../../shared/service/movie.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Endpoints } from '../../shared/constant/Endpoints';
import { SegmentedControlComponent } from '../../shared/components/segmented-control/segmented-control.component';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let movieService: jasmine.SpyObj<MovieService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const movieServiceSpy = jasmine.createSpyObj('MovieService', ['httpGet', 'searchMovies']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [HomeComponent, SegmentedControlComponent, MovieCardComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize segments and fetch trending movies on init', () => {
    const mockTrendingData = {
      results: [
        {
          id: 1,
          backdrop_path: '/path.jpg',
          original_title: 'Test Movie',
          vote_average: 8.5
        }
      ]
    };

    movieService.httpGet.and.returnValue(of(mockTrendingData));

    component.ngOnInit();

    expect(component.title).toBe('All');
    expect(component.movieCards.length).toBe(1);
    expect(component.movieCards[0].movieName).toBe('Test Movie');
  });

  it('should handle segment click and fetch movies', () => {
    const mockMoviesData = {
      results: [
        {
          id: 2,
          backdrop_path: '/movie.jpg',
          original_title: 'Test Movie 2',
          vote_average: 7.5
        }
      ]
    };

    movieService.httpGet.and.returnValue(of(mockMoviesData));
    const moviesSegment = component.segments[1];
    expect(moviesSegment).toBeDefined();
    expect(moviesSegment.onClick).toBeDefined();


    moviesSegment.onClick!();

    expect(component.title).toBe('Movies');
    expect(component.movieCards.length).toBe(1);
    expect(component.movieCards[0].movieName).toBe('Test Movie 2');
  });

  it('should handle search input and update movie cards', () => {
    const mockSearchData = {
      results: [
        {
          id: 3,
          backdrop_path: '/search.jpg',
          original_title: 'Searched Movie',
          vote_average: 9.0
        }
      ]
    };

    movieService.searchMovies.and.returnValue(of(mockSearchData));

    const searchEvent = { target: { value: 'Test' } } as any;
    component.search(searchEvent);

    expect(movieService.searchMovies).toHaveBeenCalledWith('Test');
    expect(component.movieCards.length).toBe(1);
    expect(component.movieCards[0].movieName).toBe('Searched Movie');
  });

  it('should handle error in fetching data', () => {
    movieService.httpGet.and.returnValue(throwError(() => new Error('Error fetching data')));

    component.getAllTrending();

    expect(component.movieCards.length).toBe(0);
  });

  it('should navigate to the correct detail page on card click', () => {
    const mockTrendingData = {
      results: [
        {
          id: 4,
          backdrop_path: '/detail.jpg',
          original_title: 'Detail Movie',
          vote_average: 8.0,
          first_air_date: null,
        },
      ],
    };

    movieService.httpGet.and.returnValue(of(mockTrendingData));

    component.getAllTrending();

    expect(component.movieCards.length).toBeGreaterThan(0);

    const movieCard = component.movieCards[0];
    expect(movieCard.onClick).toBeDefined();

    movieCard.onClick!(); 

    expect(router.navigateByUrl).toHaveBeenCalledWith('movie/4');
  });

});
