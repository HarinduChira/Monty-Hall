import { Injectable } from '@angular/core';
import { MontyHallResult } from './monty-hall-result'; // Ensure this path is correct

@Injectable({
  providedIn: 'root'
})
export class MontyHallService {
  private apiUrl = 'http://localhost:5097/api/MontyHall'; // Your API URL

  async addResult(result: MontyHallResult): Promise<MontyHallResult> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result)
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }

  async getAllResults(): Promise<MontyHallResult[]> {
    const response = await fetch(this.apiUrl);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }

  async getResultsByChoice(choice: string): Promise<MontyHallResult[]> {
    const response = await fetch(`${this.apiUrl}/choice/${choice}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }

  async deleteAllResults(): Promise<void> {
    const response = await fetch(this.apiUrl, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  }
}
