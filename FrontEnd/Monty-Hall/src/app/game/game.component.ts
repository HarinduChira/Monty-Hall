import { Component } from '@angular/core';
import { InstructionComponent } from "../instruction/instruction.component";
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { result } from '../../models/result';
import { SimulationService } from '../services/simulation.service'; 

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [InstructionComponent, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  numberOfGames: number = 0; // Total number of games to play
  changeDoor: boolean = false; // Flag to indicate if the player wants to change the door
  status: any; // Stores the win/loss status

  gameStatus: number = 0; // Current game status (0: initial, 1: in progress, 2: finished)

  goat01: number = 0; // State of Door 1 (0: closed, 1: open)
  goat02: number = 0; // State of Door 2
  goat03: number = 0; // State of Door 3

  selectedDoor: number = 0; // The door selected by the player
  openedDoor: number = 0; // The door opened by the host showing a goat
  prizeDoor: number = 0; // The door that has the prize (car)
  choice: string = ""; // Player's choice message (if needed)

  items: result[] = []; // Array to store the results of the games

  constructor(private simulationService: SimulationService) { } // Inject the simulation service

  // Method to handle door selection by the player
  selectDoor(door: number) {
    this.selectedDoor = door; // Set the selected door
    this.openGoat(); // Open the goat door immediately after selection
    this.checkWin(); // Check if the player wins or loses
    this.getChoices(); // Prompt to change the door
  }

  // Method to start the game
  startGame() {
    if (this.numberOfGames != 0) {
      this.gameStatus = 1; // Set game status to in progress
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

  // Method to prompt the player whether they want to change their door choice
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
      this.changeDoor = result.isConfirmed; // Set changeDoor based on user's choice
      this.finalResult(); // Check final result after the choice
    });
  }

  // Method to open a goat door after the player selects a door
  openGoat() {
    const doors = [1, 2, 3]; // Array of doors
    const doorIndex = doors.indexOf(this.selectedDoor); // Get the index of the selected door
    doors.splice(doorIndex, 1); // Remove the selected door from the array
    this.openedDoor = doors[Math.floor(Math.random() * doors.length)]; // Randomly open one of the remaining doors
    
    // Mark the opened goat door
    if (this.openedDoor === 1) this.goat01 = 1; // Door 1 opened
    else if (this.openedDoor === 2) this.goat02 = 1; // Door 2 opened
    else if (this.openedDoor === 3) this.goat03 = 1; // Door 3 opened
  }

  // Method to check if the player wins or loses
  checkWin() {
    this.prizeDoor = Math.floor(Math.random() * 3) + 1; // Randomly determine the prize door (1-3)
    this.status = this.selectedDoor === this.prizeDoor ? "win" : "lose"; // Set status based on selected door
  }

  // Method to finalize the result based on player's decision to change doors
  finalResult() {
    if (this.changeDoor) {
      // If player decides to switch doors, flip the win/lose status
      this.status = this.status === "win" ? "lose" : "win"; 
    }

    // Show the result to the player
    Swal.fire({
      title: this.status === "win" ? "You Have Won! Let's Play Again!" : "You Have Lost! Let's Play Again!",
      icon: this.status === "win" ? "success" : "error"
    }).then(() => {
      this.passResult(); // Store the result
    });

    this.numberOfGames--; // Decrease the number of remaining games

    if (this.numberOfGames === 0) {
      this.gameStatus = 2; // Set game status to finished
      // Optionally, fetch results from the backend
      this.simulationService.getResults().subscribe(data => {
        console.log(data); // Handle displaying the results
      });
    }
  }

  // Method to store the result of the game
  passResult() {
    const resultObj = new result(this.selectedDoor, this.openedDoor, this.prizeDoor, this.choice, this.status);
    this.items.push(resultObj); // Add the result to the items array
    
    // Send the result to the backend
    this.simulationService.addResult(resultObj).subscribe(response => {
      console.log(response); // Handle success message
    }, error => {
      console.error("Error adding result: ", error); // Handle error
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
    this.items = []; // Reset the items array
  }
}