import { Component, ViewChild, inject, AfterViewInit, HostListener } from '@angular/core';
import { GameEngineService } from '../gameEngine/game-engine.service';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements AfterViewInit{
  gameService : GameEngineService = inject(GameEngineService);

  @ViewChild('gameCanvas') canvas: any;
  ngAfterViewInit(): void {
    this.gameService.setCanvas(this.canvas.nativeElement);
    this.gameService.init();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.gameService.keyDown(event.key);
  }
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent2(event: KeyboardEvent) {
    this.gameService.keyUp(event.key);
  }
  @HostListener('document:mousewheel', ['$event'])
  onScroll(event: WheelEvent) {
    this.gameService.scroll(event.deltaY);
  }
/*  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.gameService.setMousePosition(event.clientX, event.clientY);
  }*/
}
