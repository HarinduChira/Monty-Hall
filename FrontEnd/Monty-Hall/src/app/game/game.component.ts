import { Component , Output , EventEmitter, Input} from '@angular/core';
import { InstructionComponent } from "../instruction/instruction.component";
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { results } from '../../models/results';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [InstructionComponent, FormsModule, CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent {

  numberOfGames: number = 0;
  changeDoor: boolean = false; 
  status: any;

  gameStatus: number = 0; // Current game status (0: initial, 1: in progress, 2: finished)

  goat01: number = 0; // State of Door 1 (0: closed, 1: open)
  goat02: number = 0; // State of Door 2
  goat03: number = 0; // State of Door 3

  selectedDoor: number = NaN; // The door selected by the player
  openedDoor: number = NaN; // The door opened by the host showing a goat
  prizeDoor: number = NaN; // The door that has the prize (car)
  choice: string = ""; // Player's choice (change or Stay in the door)

  @Input() result: results[] = []; // Array to store the results of the game

  constructor() { }

  ngOnInit(): void {
    
  }

  @Output() items = new EventEmitter<results[]>();


    // Method to start the game
    startGame() {

      alert(this.numberOfGames);

      if (this.numberOfGames != 0) {

        this.gameStatus = 1; // Set game status to in progress
         
        this.gamePlay(this.numberOfGames); // Start the game
  
      } else {
        Swal.fire({
          title: 'Oops...',
          text: 'Please enter the number of games you want to play!',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-primary px-4'
          },
          buttonsStyling: false,
        });
      }
    }

    gamePlay(games: number) {

      for (let i = 0; i < games; i++) {
      
        this.openGoat(); // Open a goat door
  
        this.getChoices(); // Ask the player to change the door
  
        this.checkWin(); // Check if the player wins or loses
  
        this.restartGame(); // Restart the game
  
      }          


      this.gameStatus = 2; // Set game status to finished

      this.displayResults(); // Display the results of the game

      this.resetGame(); // Reset the game
    }

  
  selectDoor(door: number) {

    this.selectedDoor = door; // Set the selected door
  }


  getChoices() {

    Swal.fire({
      title: "Do you want to change the Door?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Change it!",
      cancelButtonText: "No, Keep it!",
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-4',
        cancelButton: 'btn btn-danger ms-2 px-4',
      }
    }).then((result) => {
      this.changeDoor = result.isConfirmed; 

      this.choice = this.changeDoor ? "Changed" : "stay";
      
    });


  }

  // Method to open a goat door after the player selects a door
  openGoat() {
 
    const doors = [1, 2, 3]; 
    const doorIndex = doors.indexOf(this.selectedDoor);
    doors.splice(doorIndex, 1); // Remove the selected door from the array
    this.openedDoor = doors[Math.floor(Math.random() * doors.length)]; // Randomly open one of the remaining doors
    
    if (this.openedDoor === 1) this.goat01 = 1; // Door 1 opened
    else if (this.openedDoor === 2) this.goat02 = 1; // Door 2 opened
    else if (this.openedDoor === 3) this.goat03 = 1; // Door 3 opened

    

  }

  // Method to check if the player wins or loses
  checkWin() {

    const doors = [1, 2, 3]; 
    const goatIndex = doors.indexOf(this.openedDoor);
    doors.splice(goatIndex, 1); // Remove the opened door from the array

    this.prizeDoor = doors[Math.floor(Math.random() * doors.length)]; // Randomly select the door with the prize

    this.status = this.selectedDoor === this.prizeDoor ? "win" : "lose"; // Set status based on selected door

    this.finalResult(); // Finalize the result
  }

  // Method to finalize the result based on player's decision to change doors
  finalResult() {

    // Show the result to the player
    Swal.fire({
      title: this.status === "win" ? "You Have Won! Let's Play Again!" : "You Have Lost! Let's Play Again!",
      icon: this.status === "win" ? "success" : "error"
    }).then(() => {
      this.passResult(); // Store the result
    });

  }

    // Method to store the result of the game
    passResult() {

      const resultObj = new results(this.selectedDoor, this.openedDoor, this.prizeDoor, this.choice, this.status);

      alert(resultObj);
      
      this.items.emit([resultObj]); // Emit the result to the parent component
      
    }

  // Method to restart the game
  restartGame() {

    this.goat01 = NaN; // Close Door 1
    this.goat02 = NaN; // Close Door 2
    this.goat03 =NaN; // Close Door 3
    this.selectedDoor = NaN; // Reset the selected door
    this.openedDoor = NaN; // Reset the opened door
    this.prizeDoor = NaN; // Reset the prize door
    this.choice = ""; // Reset the choice
    this.status = null; // Reset the status

  }

  // Method to display the results of the game
  displayResults() {

    Swal.fire({
      title: "Game Results",
      icon: "info",
      html: `<div class="text-center">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Game</th>
            <th>Selected Door</th>
            <th>Opened Door</th>
            <th>Prize Door</th>
            <th>Choice</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${this.result.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${item.selectedDoor}</td>
              <td>${item.openedDoor}</td>
              <td>${item.prizeDoor}</td>
              <td>${item.choice}</td>
              <td>${item.status}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>`,
      confirmButtonText: "OK",
      customClass: {
        confirmButton: 'btn btn-primary px-4'
      },
      buttonsStyling: false,
    });
  }





  // Method to reset the game
  resetGame() {
    this.numberOfGames = 0; // Reset the number of games
    this.changeDoor = false; // Reset the change door flag
    this.status = null; // Reset the status
    this.gameStatus = 0; // Reset the game status
    this.goat01 = 0; // Reset the state of Door 1
    this.goat02 = 0; // Reset the state of Door 2
    this.goat03 = 0; // Reset the state of Door 3
    this.selectedDoor = 0; // Reset the selected door
    this.openedDoor = 0; // Reset the opened door
    this.prizeDoor = 0; // Reset the prize door
    this.choice = ""; // Reset the choice message
    this.result = []; // Reset the items array
  }



}