import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DbService } from '../db-service.service';
import { AppService } from '../app-service.service';

// Model
import { PatientInterface } from '../interface/patientInterface';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search-patient.component.html',
  styleUrls: ['./search-patient.component.css']
})
export class SearchPatientComponent implements OnInit {
  maxDate = new Date();
  minDate = new Date();
  amountPatient: Number = 0;

  patients: Array<PatientInterface>;
  quering: Boolean = false;

  subscription;

  constructor(
    private dbService: DbService,
    private appService: AppService
  ) {

  }

  ngOnInit() {
  }

  onDtpStartChange(obj) {
    this.minDate = obj.value;
  }
  onDtpEndChange(obj) {
    this.maxDate = obj.value;
  }


  doSearch(objForm) {
    if (objForm.invalid) {
      return;
    }
    this.patients = [];
    this.quering = true;
    this.setQueryStatus(true);

    // prepare data
    const hn = objForm.value.inpHN;
    let dt: Date = new Date(objForm.value.dtpStart);
    // tslint:disable-next-line:max-line-length
    const dtpStart: String = `${dt.getFullYear().toString()}-${this.appService.padZero(dt.getMonth(), 2)}-${this.appService.padZero(dt.getDate(), 2)} 00:00:00`;
    dt = new Date(objForm.value.dtpEnd);
    // tslint:disable-next-line:max-line-length
    const dtpEnd: String = `${dt.getFullYear().toString()}-${this.appService.padZero(dt.getMonth(), 2)}-${this.appService.padZero(dt.getDate(), 2)} 23:59:59`;

    // set URL for express
    const url: String = `${hn}/${dtpStart}/${dtpEnd}`;

    // Send !
    this.subscription = this.dbService.getSearchPatient(url).subscribe((data) => {
      if (data.length !== 0) {
        this.patients = data;
        this.amountPatient = data.length;
      }
      this.setQueryStatus(false);
    });
  }

  setQueryStatus(flg: boolean) {
    this.quering = flg;
  }

  showDate(date): String {
    return this.appService.showDate(date);
  }


}
