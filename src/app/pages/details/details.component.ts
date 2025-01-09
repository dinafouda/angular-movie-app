import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DetailBannerConfig } from '../../shared/interfaces/ui-config/detail-banner-config.interface';
import { DetailConfig } from '../../shared/interfaces/ui-config/detail-config.interface';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../shared/service/movie.service';
import { Endpoints } from '../../shared/constant/Endpoints';
import { Genre, MovieDetailData } from '../../shared/interfaces/models/movie-detail.interface';
import { TVDetailData } from '../../shared/interfaces/models/tv-detail.interface';
import { DetailBannerComponent } from "../../shared/components/detail-banner/detail-banner.component";
import { RateChipComponent } from "../../shared/components/rate-chip/rate-chip.component";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NgClass, DetailBannerComponent, RateChipComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  bannerConfig!: DetailBannerConfig;
  config!: DetailConfig;

  constructor(
    private activatedRoute: ActivatedRoute,
    private movieService: MovieService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: any) => {
      if (paramMap.params.movie_id) {
        this.getMovieById(paramMap.params.movie_id);
      } else if (paramMap.params.series_id) {
        this.getTvShowById(paramMap.params.series_id);
      }
    });
  }

  getMovieById(id: string) {
    this.movieService.httpGet(Endpoints.MOVIE_ID(id)).subscribe({
      next: (res: MovieDetailData) => {
        this.setupMovieDetails(res);
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  getTvShowById(id: string) {
    this.movieService.httpGet(Endpoints.TV_SHOW_ID(id)).subscribe({
      next: (res: TVDetailData) => {
        this.setupTvDetails(res);
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  private setupMovieDetails(res: MovieDetailData) {
    this.bannerConfig = {
      img: Endpoints.IMAGE_BASE + `/w1280${res.backdrop_path}`,
      pageName: 'Movies',
      path: 'movies',
      title: res.original_title,
    };

    const genres = res.genres.map((item) => item.name).join(', ');

    this.config = {
      img: Endpoints.IMAGE_BASE + `w500${res.poster_path}`,
      subtitle: res.tagline,
      description: res.overview,
      rate: res.vote_average,
      isVertical: true,
      detailCards: [
        { title: 'Type', description: 'Movie' },
        { title: 'Release date', description: res.release_date },
        { title: 'Run time', description: res.runtime.toString() },
        { title: 'Genres', description: genres },
      ],
    };
  }

  private setupTvDetails(res: TVDetailData) {
    this.bannerConfig = {
      img: Endpoints.IMAGE_BASE + `/w1280${res.backdrop_path}`,
      pageName: 'TV Shows',
      path: 'tvshows',
      title: res.name,
    };

    const genres = res.genres.map((item) => item.name).join(', ');

    this.config = {
      img: Endpoints.IMAGE_BASE + `w500${res.poster_path}`,
      subtitle: res.tagline,
      description: res.overview,
      rate: res.vote_average,
      isVertical: false,
      detailCards: [
        { title: 'Type', description: 'TV Show' },
        { title: 'Status', description: res.status },
        { title: 'First air date', description: res.first_air_date },
        { title: 'Last air date', description: res.last_air_date },
        { title: 'No. of seasons', description: res.number_of_seasons.toString() },
        { title: 'No. of episodes', description: res.number_of_episodes.toString() },
        { title: 'Genres', description: genres },
      ],
    };
  }
}
