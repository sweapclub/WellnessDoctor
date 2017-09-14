import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DbService {
  private API = 'http://localhost:3000/api';
  // private API = 'http://10.125.63.141:3000/api';
  constructor(private http: Http) { }

  getSearchPatient(url) {
    return this.http.get(`${this.API}/wellness/patient/${url}`)
      .map(res => res.json());
  }

  postLogin(objLogin) {
    return this.http.post(`${this.API}/bConnect/login`, objLogin)
      .map(res => res.json());
  }

  postAddEKGComment(objComment) {
    return this.http.post(`${this.API}/wellness/addEKGComment/`, objComment);
  }

  getEkgComment(doctorId: String) {
    return this.http.get(`${this.API}/wellness/ekgcomment/${doctorId}`)
      .map(res => res.json());
  }
  postDeleteEKGComment(objDel) {
    return this.http.post(`${this.API}/wellness/deleteEKGComment`, objDel);
  }

  postSaveResult(objEKG) {
    return this.http.post(`${this.API}/wellness/saveResult`, objEKG);
  }

  getHistoryResult(patientGUID: String) {
    return this.http.get(`${this.API}/wellness/historyResult/${patientGUID}`).map(res => res.json());
  }
}
