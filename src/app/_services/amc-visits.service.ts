import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AMCVisit } from '../_sales/_entity/deal-amc-visits/AMCVisit';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AMCVisitsService {

  constructor(private http: HttpClient, public auth: AuthService) { }

  saveAMCVisit(amcVisit: AMCVisit) {
    return this.http.post(environment.apiUrl + 'amc-visit/save-amc-visits', { amcVisits: [amcVisit] });
  }

  getAMCVisits(dealId: number) {
    return this.http.get(environment.apiUrl + 'amc-visit/get-amc-visit/' + dealId);
  }

  deleteAMCVisits(amcVisit: AMCVisit) {
    return this.http.post(environment.apiUrl + 'amc-visit/delete-amc-visit/', { amcVisits: [amcVisit] });
  }


}
