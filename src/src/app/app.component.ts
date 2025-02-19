import {Component, ElementRef, inject} from '@angular/core';
import { RouterOutlet, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'projektAngular';
  element: ElementRef<any> = inject(ElementRef);
  full(){
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        this.element.nativeElement.requestFullscreen();
    }
  }
}
