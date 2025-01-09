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

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private _movieService: MovieService) { }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((res) => {
      console.log(res)
      this.title = res[0].path.includes('movie') ?
        'Movies' : 'TV Shows';
      if (this.title === 'Movies') {
        this.getAllMovies();
      } else if (this.title === 'TV Shows') {
        this.getAllTvShows();
      } else {
        this.router.navigateByUrl('')
      }
    })
  }


  getAllMovies() {
    this._movieService.httpGet(Endpoints.MOVIES)
      .subscribe({
        next: (res: MoviesData) => {
          this.movieCards = res.results.map((item: MovieResult) => {
            return {
              img: Endpoints.IMAGE_BASE + `/w500${item.backdrop_path}`,
              movieName: item.original_title,
              rate: item.vote_average,
              onClick: () => {
                this.router.navigateByUrl(`movie/${item.id}`);

              }
            } as MovieCardConfig
          })

        },
        error: (err: any) => {
          console.error(err)
        }
      }
      )
  }


  getAllTvShows() {

    this._movieService.httpGet(Endpoints.TV_SHOWS)
      .subscribe({
        next: (res: TVData) => {
          this.movieCards = res.results.map((item: TVResult) => {
            return {
              img: Endpoints.IMAGE_BASE + `/w500${item.backdrop_path}`,
              movieName: item.original_name,
              rate: item.vote_average,
              onClick: () => {

                this.router.navigateByUrl(`tvshow/${item.id}`)


              }
            } as MovieCardConfig
          })

        },
        error: (err: any) => {
          console.error(err)
        }
      }
      )

  }
}
