import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import {MenuComponent} from "./menu/menu.component";

export const routes: Routes = [
    {
      path: '',
      component: MenuComponent,
      title: 'd4m14n-gh/Tank_Game-Angular'
    },
    {
      path: 'game',
      component: GameComponent,
      title: 'd4m14n-gh/Tank_Game-Angular'
    },
  ];
