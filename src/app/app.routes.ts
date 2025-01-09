import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetailsComponent } from './pages/details/details.component';
import { CategoryComponent } from './pages/category/category.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'tvshow/:series_id',
    component: DetailsComponent
  },
  {
    path: 'movie/:movie_id',
    component: DetailsComponent
  },
  {
    path: 'movies',
    component: CategoryComponent
  },
  {
    path: 'tvshows',
    component: CategoryComponent
  },
  { path: '**', redirectTo: '' }
];
