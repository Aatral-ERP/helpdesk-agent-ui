import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NeededService {

  constructor(private http: HttpClient) { }

  loadNeeded(needed: Array<string>) {
    return this.http.post(environment.apiUrl + 'needed/load-needed', { needed: needed });
  }

}
