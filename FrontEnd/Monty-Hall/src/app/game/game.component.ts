import { Component , Output , EventEmitter, Input} from '@angular/core';
import { InstructionComponent } from "../instruction/instruction.component";
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MontyHallResult } from '../monty-hall-result';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [InstructionComponent, FormsModule, CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent {

  

}