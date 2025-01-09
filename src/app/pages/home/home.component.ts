import { Component, OnInit } from '@angular/core';
import { SegmentedControlComponent } from "../../shared/components/segmented-control/segmented-control.component";
import { MovieCardComponent } from "../../shared/components/movie-card/movie-card.component";
import { InputComponent } from "../../shared/components/input/input.component";
import { Endpoints } from '../../shared/constant/Endpoints';
import { MovieCardConfig } from '../../shared/interfaces/ui-config/movie-card-config.interface';
import { MovieResult, MoviesData } from '../../shared/interfaces/models/movies.interface';
import { TrendData, TrendsResult } from '../../shared/interfaces/models/trends.interface';
import { TVData, TVResult } from '../../shared/interfaces/models/tv.interface';
import { SegmentedControlConfig } from '../../shared/interfaces/ui-config/segmented-control-config.interface';
import { MovieService } from '../../shared/service/movie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SegmentedControlComponent, MovieCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  title: string = 'All';
  movieCards: MovieCardConfig[] = [];
  segments: SegmentedControlConfig[] = [
    { name: 'All', active: true },
    { name: 'Movies', active: false },
    { name: 'TV Shows', active: false }
  ];

  constructor(private movieService: MovieService, private router: Router) { }

  ngOnInit(): void {
    this.initializeSegments();
    this.getAllTrending();
  }

  initializeSegments(): void {
    this.segments.forEach(segment => {
      segment.onClick = () => {
        this.title = segment.name;
        if (segment.name === 'Movies') {
          this.getMovies();
        } else if (segment.name === 'TV Shows') {
          this.getTVShows();
        } else {
          this.getAllTrending();
        }
      };
    });
  }

  getAllTrending(): void {
    this.fetchData(Endpoints.TRENDS, item => ({
      img: `${Endpoints.IMAGE_BASE}/w500${item.backdrop_path}`,
      movieName: item.original_title || item.original_name,
      rate: item.vote_average,
      onClick: () => this.navigateToDetail(item)
    }));
  }

  getMovies(): void {
    this.fetchData(Endpoints.MOVIES, item => ({
      img: `${Endpoints.IMAGE_BASE}/w500${item.backdrop_path}`,
      movieName: item.original_title,
      rate: item.vote_average,
      onClick: () => this.router.navigateByUrl(`movie/${item.id}`)
    }));
  }

  getTVShows(): void {
    this.fetchData(Endpoints.TV_SHOWS, item => ({
      img: `${Endpoints.IMAGE_BASE}/w500${item.backdrop_path}`,
      movieName: item.original_name,
      rate: item.vote_average,
      onClick: () => this.router.navigateByUrl(`tvshow/${item.id}`)
    }));
  }

  search(event: any): void {
    const query = event.target.value;
    this.movieService.searchMovies(query).subscribe(
      res => this.updateMovieCards(res.results, item => ({
        img: `${Endpoints.IMAGE_BASE}/w500${item.backdrop_path}`,
        movieName: item.original_title,
        rate: item.vote_average,
        onClick: () => this.router.navigateByUrl(`movie/${item.id}`)
      })),
      error => console.error(error)
    );
  }

  private fetchData(endpoint: string, mapFn: (item: any) => MovieCardConfig): void {
    this.movieService.httpGet(endpoint).subscribe(
      res => this.updateMovieCards(res.results, mapFn),
      error => console.error(error)
    );
  }

  private updateMovieCards(items: any[], mapFn: (item: any) => MovieCardConfig): void {
    this.movieCards = items
      .map(mapFn)
      .filter(item => item.movieName);
  }

  private navigateToDetail(item: TrendsResult): void {
    const route = item.first_air_date ? `tvshow/${item.id}` : `movie/${item.id}`;
    this.router.navigateByUrl(route);
  }
}
