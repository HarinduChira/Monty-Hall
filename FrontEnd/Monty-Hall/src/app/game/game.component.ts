import { Component , Output , EventEmitter, Input} from '@angular/core';
import { InstructionComponent } from "../instruction/instruction.component";
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MontyHallResult } from '../monty-hall-result';
import { MontyHallService } from '../monty-hall.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [InstructionComponent, FormsModule, CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent {

  gameStatus : number = 0; // 0 = Not Started, 1 = Started, 2 = Ended

  numOfGames = 0; // Number of games to be played


  selectedDoor : number = 0; // Door selected by the player
  carDoor : number = 0; // Door with the car behind it
  openDoor : number = 0; // Door opened by the host

  switchedDoor : number = 0; // Door selected by the player after switching

  goat01 : number = 0; // Door with a goat behind it
  goat02 : number = 0; // Door with a goat behind it
  goat03 : number = 0; // Door with a goat behind it

  choice : string = ""; // Player's choice to switch or not to switch
  status : string = ""; // Player's status (win or lose)

  switchWinPercentage: number = 0; // Percentage of wins when switching doors
  stayWinPercentage: number = 0; // Percentage of wins when staying with the initial choice

  Results : MontyHallResult [] = []; // Array of results


  startGame(){    
    if(this.numOfGames == 0){
      Swal.fire({
        title: 'Oops...',
        text: 'Please enter the number of games to be played',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
            confirmButton: 'btn btn-primary px-4'
        },
        buttonsStyling: false,
        allowOutsideClick: false
            
        });
    }else{
    this.displayDoors();
    }
  }


  displayDoors(){

    this.gameStatus = 1;

    // Randomly assign a car behind one of the doors
    this.carDoor = Math.floor(Math.random() * 3) + 1;

  }

  selectDoor(door : number){

    this.selectedDoor = door;

    this.openDoorByHost();
  }

  openDoorByHost(){


    const doors = [1, 2, 3];

    // Remove the door with the car behind it
    doors.splice(doors.indexOf(this.carDoor), 1);

    // Remove the door selected by the player
    doors.splice(doors.indexOf(this.selectedDoor), 1);

    // Randomly select a door with a goat behind it
    this.openDoor = doors[Math.floor(Math.random() * doors.length)];


    this.displayGoats();

  }

  displayGoats(){

    if(this.openDoor == 1){
      this.goat01 = 1;
    }
    else if(this.openDoor == 2){
      this.goat02 = 1;
    }
    else{
      this.goat03 = 1;
    }

    this.playerChoice();

  }

  playerChoice(){

    Swal.fire({
      title: 'Do you want to switch doors?',
      showDenyButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.choice = "switch";
        this.changeDoor();        
      } else if (result.isDenied) {
        this.choice = "stay";
        this.checkStatus();
      }
    })
  }

  changeDoor()
  {
    if(this.choice == "switch"){
      if(this.selectedDoor == 1 && this.openDoor == 2){
        this.switchedDoor = 3;
        this.checkStatus();
      }
      else if(this.selectedDoor == 1 && this.openDoor == 3){
        this.switchedDoor = 2;
        this.checkStatus();
      }
      else if(this.selectedDoor == 2 && this.openDoor == 1){
        this.switchedDoor = 3;
        this.checkStatus();
      }
      else if(this.selectedDoor == 2 && this.openDoor == 3){
        this.switchedDoor = 1;
        this.checkStatus();
      }
      else if(this.selectedDoor == 3 && this.openDoor == 1){
        this.switchedDoor = 2;
        this.checkStatus();
      }
      else if(this.selectedDoor == 3 && this.openDoor == 2){
        this.switchedDoor = 1;
        this.checkStatus();
      }
    }
  }

  checkStatus(){

    if(this.switchedDoor == this.carDoor){
      this.status = "win";
      Swal.fire('Congratulations! You won a car!');
      this.passResult();
      
    }
    else{
      this.status = "lose";
      Swal.fire('Sorry! You won a goat!');
      this.passResult();
    }

  }

  constructor(private montyHallService: MontyHallService) {}

  async passResult() {
    const result: MontyHallResult = {
      selectedDoor: this.selectedDoor,
      openedDoor: this.openDoor,
      prizeDoor: this.carDoor,
      choice: this.choice,
      status: this.status
    }

    console.log('Adding result:', result);

    try {
      await this.montyHallService.addResult(result);

      this.numOfGames--;

      this.nextround();

    } catch (error) {
      console.error('Error adding result:', error);
    }
  }

  nextround(){

    if (this.numOfGames > 0) {
      this.selectedDoor = 0;
      this.carDoor = 0;
      this.openDoor = 0;
      this.goat01 = 0;
      this.goat02 = 0;
      this.goat03 = 0;
      this.choice = "";
      this.status = "";
      this.displayDoors();
    } else {
      this.getResults();
      this.gameStatus = 2;
    }
  }

  async deleteAllResults() {
    try {
      await this.montyHallService.deleteAllResults();

    } catch (error) {
      console.error('Error deleting results:', error);
    }
  }

  resetGame(){

    this.deleteAllResults();

    this.numOfGames = 0;
    this.selectedDoor = 0;
    this.carDoor = 0;
    this.openDoor = 0;
    this.goat01 = 0;
    this.goat02 = 0;
    this.goat03 = 0;
    this.choice = "";
    this.status = ""; 

    this.Results = [];

    this.gameStatus = 0;
  }

  
  
  ngOnInit(): void {
    this.getResults();
  }
  async getResults() {
    try {
      const results = await this.montyHallService.getAllResults();

      for (const result of results) {
        this.Results.push(result);
      }
      
      this.calculateWinningPercentages();
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  }


  calculateWinningPercentages() {

    const switchWins = this.Results.filter(result => result.choice === 'switch' && result.status === 'win').length;

    const stayWins = this.Results.filter(result => result.choice === 'stay' && result.status === 'win').length;

    const switchTotal = this.Results.filter(result => result.choice === 'switch').length;
    
    const stayTotal = this.Results.filter(result => result.choice === 'stay').length;

    this.switchWinPercentage = switchTotal > 0 ? (switchWins / switchTotal) * 100 : 0;
    this.stayWinPercentage = stayTotal > 0 ? (stayWins / stayTotal) * 100 : 0;
  }




}