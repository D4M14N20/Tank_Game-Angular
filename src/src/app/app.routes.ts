import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import {MenuComponent} from "./menu/menu.component";

export const routes: Routes = [
    {
      path: '',
      component: MenuComponent,
      title: 'Home page'
    },
    {
      path: 'game',
      component: GameComponent,
      title: 'game'
    },
  ];
