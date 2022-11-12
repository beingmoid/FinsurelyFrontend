import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDetailService extends GenericApiService {

  constructor(private httpClient: HttpClient) {
    super(httpClient);
   }
}
