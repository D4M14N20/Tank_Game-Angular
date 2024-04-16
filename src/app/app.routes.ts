import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import {MenuComponent} from "./menu/menu.component";

export const routes: Routes = [
    {
      path: '',
      component: GameComponent,
      title: 'Home page'
    },
    {
      path: 'menu',
      component: MenuComponent,
      title: 'menu'
    },
  ];
