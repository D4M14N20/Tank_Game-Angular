import {Component, inject, ViewChild} from '@angular/core';
import {RouterLink} from "@angular/router";
import {GameEngineService} from "../gameEngine/game-engine.service";

@Component({
  selector: 'app-menu',
  standalone: true,
    imports: [
        RouterLink,
    ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
    @ViewChild("nameInput") input: any;
    game: GameEngineService = inject(GameEngineService);
    setName(){
        let name: string = this.input.nativeElement.value;
        this.game.setName(name);
    }
}
