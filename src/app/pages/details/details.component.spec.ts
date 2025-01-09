import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DetailsComponent } from './details.component';
import { MovieService } from '../../shared/service/movie.service';
import { Endpoints } from '../../shared/constant/Endpoints';
import { DetailBannerComponent } from "../../shared/components/detail-banner/detail-banner.component";
import { RateChipComponent } from "../../shared/components/rate-chip/rate-chip.component";
import { Genre, MovieDetailData } from '../../shared/interfaces/models/movie-detail.interface';
import { TVDetailData } from '../../shared/interfaces/models/tv-detail.interface';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let movieService: jasmine.SpyObj<MovieService>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  const mockMovieData: MovieDetailData = {
    backdrop_path: '/movie_backdrop.jpg',
    original_title: 'Test Movie',
    tagline: 'Test Tagline',
    overview: 'Test movie description',
    vote_average: 8.5,
    poster_path: '/movie_poster.jpg',
    release_date: '2025-01-01',
    runtime: 120,
    genres: [{ id: 1, name: 'Drama' }, { id: 2, name: 'Action' }],
    adult: false,
    belongs_to_collection: null,
    budget: 10000000,
    homepage: 'https://example.com',
    id: 1,
    imdb_id: 'tt1234567',
    original_language: 'en',
    popularity: 150,
    production_companies: [],
    production_countries: [],
    revenue: 50000000,
    spoken_languages: [],
    status: 'Released',
    video: false,
    vote_count: 1000,
  };

  const mockTvData: TVDetailData = {
    backdrop_path: '/tv_backdrop.jpg',
    name: 'Test TV Show',
    tagline: 'Test TV Tagline',
    overview: 'Test TV description',
    vote_average: 9.0,
    poster_path: '/tv_poster.jpg',
    genres: [{ id: 1, name: 'Comedy' }],
    status: 'Running',
    first_air_date: '2023-01-01',
    last_air_date: '2025-01-01',
    number_of_seasons: 3,
    number_of_episodes: 30,
    episode_run_time: [45],
    homepage: 'https://example-tv.com',
  };

  beforeEach(async () => {
    movieService = jasmine.createSpyObj('MovieService', ['httpGet']);
    activatedRouteStub = {
      paramMap: of({ params: { movie_id: '1' } }),
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        DetailBannerComponent,
        RateChipComponent,
      ],
      declarations: [DetailsComponent],
      providers: [
        { provide: MovieService, useValue: movieService },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movie details on initialization', () => {
    movieService.httpGet.and.returnValue(of(mockMovieData));

    component.ngOnInit();

    expect(movieService.httpGet).toHaveBeenCalledWith(Endpoints.MOVIE_ID('1'));
    expect(component.bannerConfig).toEqual({
      img: `${Endpoints.IMAGE_BASE}/w1280/movie_backdrop.jpg`,
      pageName: 'Movies',
      path: 'movies',
      title: 'Test Movie',
    });
    expect(component.config).toEqual({
      img: `${Endpoints.IMAGE_BASE}w500/movie_poster.jpg`,
      subtitle: 'Test Tagline',
      description: 'Test movie description',
      rate: 8.5,
      isVertical: true,
      detailCards: [
        { title: 'Type', description: 'Movie' },
        { title: 'Release date', description: '2025-01-01' },
        { title: 'Run time', description: '120' },
        { title: 'Genres', description: 'Drama, Action' },
      ],
    });
  });

  it('should load TV show details on initialization', () => {
    activatedRouteStub.paramMap = of({ params: { series_id: '10' } });
    movieService.httpGet.and.returnValue(of(mockTvData));

    component.ngOnInit();

    expect(movieService.httpGet).toHaveBeenCalledWith(Endpoints.TV_SHOW_ID('10'));
    expect(component.bannerConfig).toEqual({
      img: `${Endpoints.IMAGE_BASE}/w1280/tv_backdrop.jpg`,
      pageName: 'TV Shows',
      path: 'tvshows',
      title: 'Test TV Show',
    });
    expect(component.config).toEqual({
      img: `${Endpoints.IMAGE_BASE}w500/tv_poster.jpg`,
      subtitle: 'Test TV Tagline',
      description: 'Test TV description',
      rate: 9.0,
      isVertical: false,
      detailCards: [
        { title: 'Type', description: 'TV Show' },
        { title: 'Status', description: 'Running' },
        { title: 'First air date', description: '2023-01-01' },
        { title: 'Last air date', description: '2025-01-01' },
        { title: 'No. of seasons', description: '3' },
        { title: 'No. of episodes', description: '30' },
        { title: 'Genres', description: 'Comedy' },
      ],
    });
  });

  it('should handle error when fetching movie details', () => {
    spyOn(console, 'error');
    movieService.httpGet.and.returnValue(throwError(() => new Error('Error')));

    component.getMovieById('1');

    expect(console.error).toHaveBeenCalledWith(new Error('Error'));
  });

  it('should handle error when fetching TV details', () => {
    spyOn(console, 'error');
    movieService.httpGet.and.returnValue(throwError(() => new Error('Error')));

    component.getTvShowById('10');

    expect(console.error).toHaveBeenCalledWith(new Error('Error'));
  });
});
