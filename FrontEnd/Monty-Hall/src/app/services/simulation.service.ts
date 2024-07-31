import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { result } from '../../models/result'; 
import { BrowserModule } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private baseUrl: string = 'http://localhost:8000'; 

  constructor(private http: HttpClient) { }

  addResult(result: result): Observable<any> {
    return this.http.post(`${this.baseUrl}/add_result`, result); 
  }

  getResults(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_result`); 
  }
}
