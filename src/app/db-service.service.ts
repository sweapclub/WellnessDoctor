import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DbService {
  private API = 'http://localhost:3000/api';
  constructor(private http: Http) { }

  getSearchPatient(url) {
    return this.http.get(`${this.API}/wellness/patient/${url}`)
      .map(res => res.json());
  }

  postLogin(objLogin) {
    return this.http.post(`${this.API}/bConnect/login`, objLogin)
    .map(res => res.json());
  }
}
