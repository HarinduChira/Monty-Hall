import { Component } from '@angular/core';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { HeaderComponent } from './header/header.component';
import { InstructionComponent } from './instruction/instruction.component';
import { GameComponent } from './game/game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    GameComponent,
    CommonModule, 
    FormsModule,
    InstructionComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent {
  title = 'Monty-Hall';
}
