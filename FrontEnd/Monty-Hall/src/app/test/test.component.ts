import { Component, OnInit } from '@angular/core';
import { MontyHallService } from '../monty-hall.service';
import { MontyHallResult } from '../monty-hall-result';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  results: MontyHallResult[] = [];
  
  selectedDoor!: number;
  openedDoor!: number;
  prizeDoor!: number;
  choice!: string;
  status!: string;

  constructor(private montyHallService: MontyHallService) {}

  ngOnInit(): void {
    this.getAllResults();
  }

  async addResult() {
    const result: MontyHallResult = {
      SelectedDoor: this.selectedDoor,
      OpenedDoor: this.openedDoor,
      PrizeDoor: this.prizeDoor,
      Choice: this.choice,
      Status: this.status
    }

    console.log('Adding result:', result);

    try {
      await this.montyHallService.addResult(result);
      await this.getAllResults();
      this.clearForm();
    } catch (error) {
      console.error('Error adding result:', error);
    }
  }

  async getAllResults() {
    try {
      this.results = await this.montyHallService.getAllResults();
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  }

  async getResultsByChoice(choice: string) {
    try {
      this.results = await this.montyHallService.getResultsByChoice(choice);
    } catch (error) {
      console.error('Error fetching results by choice:', error);
    }
  }

  async deleteAllResults() {
    try {
      await this.montyHallService.deleteAllResults();
      await this.getAllResults();
    } catch (error) {
      console.error('Error deleting results:', error);
    }
  }

  clearForm() {
    this.selectedDoor = 0;
    this.openedDoor = 0;
    this.prizeDoor = 0;
    this.choice = '';
    this.status = '';
  }
}
