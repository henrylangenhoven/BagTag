import { Routes } from '@angular/router';
import { AboutPageComponent } from './pages/about-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { LoginPageComponent } from './pages/login-page.component';
import { NotFoundPageComponent } from './pages/not-found-page.component';
import { OwnerPageComponent } from './pages/owner-page.component';
import { PublicTagPageComponent } from './pages/public-tag-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'about',
    component: AboutPageComponent,
  },
  {
    path: 'owner',
    component: OwnerPageComponent,
  },
  {
    path: 't/:publicId',
    component: PublicTagPageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
