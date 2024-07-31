import { Component } from '@angular/core';
import { InstructionComponent } from "../instruction/instruction.component";
import Swal from 'sweetalert2';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [InstructionComponent,FormsModule,CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

  numberOfGames : number = 0;
  changeDoor : boolean = false;
  result : any;
  selectedDoor : number = 0;
  gameStaus : number = 0;
  gameResult : any = [];
  goat01 : number = 1;
  goat02 : number = 0;
  goat03 : number = 0;

  constructor() { }


  selectDoor(door : number) {
    this.selectedDoor = door;

    this.getChoices();
  }


  startGame() {

    if(this.numberOfGames != 0) {

      this.gameStaus = 1;

    }
    else {
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
          },
      }).then((result) => {
        if (result.isConfirmed) {
          this.changeDoor = true;
        } else {
          this.changeDoor = false;
        }
      });

      this.openGoat();

      this.checkWin();
    }

  openGoat() {
      
    if(this.selectedDoor == 1) {
      this.goat01 = 0;




    }else if(this.selectedDoor == 2) {
      this.goat02 = 0;



    }else if(this.selectedDoor == 3) {
      this.goat03 = 0;


    }   else {
      this.goat01 = 0;
      this.goat02 = 0;
      this.goat03 = 0;
    }

  }


  checkWin() {

    let win = Math.floor(Math.random() * 3) + 1;

    if(this.selectedDoor == win) {
      this.result = "win";
    }
    else {
      this.result = "lose";
    }

    if(this.changeDoor) {
      if(this.result == "win") {
        this.result = "lose";
      }
      else {
        this.result = "win";
      }
    }

    if(this.result == "win") {

      Swal.fire({
        title: "You Have Won! Lets Play Again!",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url(/images/trees.png)",
        backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `
      });
     
    }else{
      Swal.fire({
        title: "You Have Lost! Lets Play Again!",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url(/images/trees.png)",
      });
    }

    this.numberOfGames = this.numberOfGames - 1;

    if(this.numberOfGames == 0) {
      this.gameStaus = 2;
    }



  }


}
