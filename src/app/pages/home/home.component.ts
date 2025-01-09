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
  segments: SegmentedControlConfig[] = [{
    name: 'All',
    active: true
  },
  {
    name: 'Movies',
    active: false
  },
  {
    name: 'TV Shows',
    active: false,

  }]
  constructor(private _movieService: MovieService,
    private router: Router) { }
  ngOnInit(): void {
    this.segments.map((item: SegmentedControlConfig) => {
      item.onClick = () => {
        this.title = item.name;
        if (item.name.toLowerCase().includes('movie')) {
          this.getMovies();
        } else if (item.name.toLowerCase().includes('tv shows')) {
          this.getTVShows();
        } else {
          this.getAllTrending();
        }
      }
    })
    this.getAllTrending()
  }

  getAllTrending() {
    this._movieService.httpGet(Endpoints.TRENDS)
      .subscribe({
        next: (res: TrendData) => {
          console.log(res.results);

          this.movieCards = res.results.map((item: TrendsResult) => {
            return {
              img: Endpoints.IMAGE_BASE + `/w500${item.backdrop_path}`,
              movieName: item.original_title || item.original_name,
              rate: item.vote_average,
              onClick: () => {

                if (item.first_air_date) {
                  this.router.navigateByUrl(`tvshows/${item.id}`)
                } else {
                  this.router.navigateByUrl(`movie/${item.id}`)

                }

              }
            } as MovieCardConfig
          }).filter((item => item.movieName))
        },
        error: (error: any) => {
          console.error(error)
        }
      })
  }
  getTVShows() {
    this._movieService.httpGet(Endpoints.TV_SHOWS)
      .subscribe({
        next: (res: TVData) => {

          this.movieCards = res.results.map((item: TVResult) => {
            return {
              img: Endpoints.IMAGE_BASE + `/w500${item.backdrop_path}`,
              movieName: item.original_name,
              rate: item.vote_average,
              onClick: () => {
                console.log("Click : ", item)

                this.router.navigateByUrl(`tvshow/${item.id}`)


              }
            } as MovieCardConfig
          }).filter((item => item.movieName))
        },
        error: (error: any) => {
          console.error(error)
        }
      })
  }

  getMovies() {
    this._movieService.httpGet(Endpoints.MOVIES)
      .subscribe({
        next: (res: MoviesData) => {

          this.movieCards = res.results.map((item: MovieResult) => {
            return {
              img: Endpoints.IMAGE_BASE + `/w500${item.backdrop_path}`,
              movieName: item.original_title,
              rate: item.vote_average,
              onClick: () => {

                this.router.navigateByUrl(`movie/${item.id}`)


              }
            } as MovieCardConfig
          }).filter((item => item.movieName))
        },
        error: (error: any) => {
          console.error(error)
        }
      })
  }

  search(e: any): void {
    this._movieService.searchMovies(e.target.value)
    .subscribe({
      next: (res: MoviesData) => {

        this.movieCards = res.results.map((item: MovieResult) => {
          return {
            img: Endpoints.IMAGE_BASE + `/w500${item.backdrop_path}`,
            movieName: item.original_title,
            rate: item.vote_average,
            onClick: () => {

              this.router.navigateByUrl(`movie/${item.id}`)


            }
          } as MovieCardConfig
        }).filter((item => item.movieName))
      },
      error: (error: any) => {
        console.error(error)
      }
    })
  }
}
