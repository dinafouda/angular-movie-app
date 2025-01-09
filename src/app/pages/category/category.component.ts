import { Component, OnInit } from '@angular/core';
import { MovieCardComponent } from "../../shared/components/movie-card/movie-card.component";
import { InputComponent } from "../../shared/components/input/input.component";
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../shared/service/movie.service';
import { MovieCardConfig } from '../../shared/interfaces/ui-config/movie-card-config.interface';
import { Endpoints } from '../../shared/constant/Endpoints';
import { MovieResult, MoviesData } from '../../shared/interfaces/models/movies.interface';
import { TVData, TVResult } from '../../shared/interfaces/models/tv.interface';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MovieCardComponent, InputComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  title: string = '';
  movieCards: MovieCardConfig[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((segments) => {
      const path = segments[0]?.path || '';
      if (path.includes('movie')) {
        this.title = 'Movies';
        this.fetchData(Endpoints.MOVIES, this.mapMovieData);
      } else if (path.includes('tv')) {
        this.title = 'TV Shows';
        this.fetchData(Endpoints.TV_SHOWS, this.mapTvData);
      } else {
        this.router.navigateByUrl('');
      }
    });
  }

  private fetchData<T>(endpoint: string, mapFn: (data: T) => MovieCardConfig[]): void {
    this.movieService.httpGet(endpoint).subscribe({
      next: (res: T) => {
        this.movieCards = mapFn(res);
      },
      error: (err) => console.error(err),
    });
  }

  private mapMovieData(data: MoviesData): MovieCardConfig[] {
    return data.results.map((item: MovieResult) => ({
      img: `${Endpoints.IMAGE_BASE}/w500${item.backdrop_path}`,
      movieName: item.original_title,
      rate: item.vote_average,
      onClick: () => this.router.navigateByUrl(`movie/${item.id}`),
    }));
  }

  private mapTvData(data: TVData): MovieCardConfig[] {
    return data.results.map((item: TVResult) => ({
      img: `${Endpoints.IMAGE_BASE}/w500${item.backdrop_path}`,
      movieName: item.original_name,
      rate: item.vote_average,
      onClick: () => this.router.navigateByUrl(`tvshow/${item.id}`),
    }));
  }
}
