import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {DatePipe} from '@angular/common';

import { DbService } from '../db-service.service';
import { AppService } from '../app-service.service';

// Model
import { PatientInterface } from '../interface/patientInterface';
// import { LabComment } from '../interface/labComment.interface';
import { EkgComment } from '../interface/ekgComment.interface';

// Dialog
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

// ng2-cookie
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search-patient.component.html',
  styleUrls: ['./search-patient.component.css'],
  providers: [DatePipe]
})

export class SearchPatientComponent implements OnInit {
  maxDate = new Date();
  minDate = new Date();
  amountPatient: Number = 0;
  patients: Array<PatientInterface>;
  quering: Boolean = false;
  subscription;

  url: String;

  constructor(
    private dbService: DbService,
    private appService: AppService,
    public dialog: MdDialog,
    private datepipe: DatePipe
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


  doSearch(objForm: any) {
    if (objForm.invalid) {
      return;
    }
    this.patients = [];
    this.quering = true;
    this.setQueryStatus(true);

    // prepare data
    const hn = objForm.value.inpHN;
    let dt: Date = new Date(objForm.value.dtpStart);
    const dtpStart: String = this.datepipe.transform(dt, 'yyyy-MM-dd');
    dt = new Date(objForm.value.dtpEnd);
    const dtpEnd: String = this.datepipe.transform(dt, 'yyyy-MM-dd');

    // set URL for express
    this.url = `${hn}/${dtpStart}/${dtpEnd}`;

    this.refreshTable();
  }

  setQueryStatus(flg: boolean) {
    this.quering = flg;
  }

  openSettingDialog(obj): void {
    const dialogRef = this.dialog.open(DialogSettingComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshTable();
    });
  }

  openLabDialog(obj): void {
    const dialogRef = this.dialog.open(DialogLabComponent, {
      width: '800px',
      data: { PatientGUID: obj.PatientGUID }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshTable();
    });
  }

  private refreshTable() {
    // Send !
    this.subscription = this.dbService.getSearchPatient(this.url).subscribe((data) => {
      if (data.length !== 0) {
        this.patients = data;
        this.amountPatient = data.length;
      }
      this.setQueryStatus(false);
    });
  }
}

////////////////////////////////////////////////////////////

@Component({
  selector: 'app-dialog-setting',
  templateUrl: './dialog/dialog-setting.component.html',
  styleUrls: ['./search-patient.component.css']
})
export class DialogSettingComponent {
  subscription;
  otherLabComment: EkgComment[];

  UID = Cookie.get('UID');

  constructor(
    public dialogRef: MdDialogRef<SearchPatientComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    public dbService: DbService) {

    this.refreshComment();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addOtherComment(objForm) {
    if (!objForm.value.otherComment) {
      return;
    }

    const pos = this.otherLabComment.findIndex((char) => {
      return char.ListName === objForm.value.otherComment.comID;
    });

    if (pos !== -1) {
      return;
    }

    const objComment = {
      ListName: objForm.value.otherComment,
      DoctorOwner: Cookie.get('UID')
    };

    this.subscription = this.dbService.postAddEKGComment(objComment).subscribe(() => {
      this.refreshComment();
    });

    objForm.reset();
  }

  deleteOtherComment(objComment: EkgComment) {
    const objDel = {
      RowID: objComment.RowID,
      DoctorOwner: objComment.DoctorOwner
    };
    this.subscription = this.dbService.postDeleteEKGComment(objDel).subscribe(() => {
      this.refreshComment();
    });
  }

  refreshComment(): void {
    this.subscription = this.dbService.getEkgComment(Cookie.get('UID')).subscribe((result) => {
      this.otherLabComment = result;
    });
  }
}


////////////////////////////////////////////////////////////////

@Component({
  selector: 'app-lab-setting',
  templateUrl: './dialog/dialog-lab.component.html',
  styleUrls: ['./search-patient.component.css']
})
export class DialogLabComponent {
  otherLabComment: EkgComment[];

  normalLabComment = [
    { comID: '0', caption: 'ปกติ', comText: 'ค่าแปลผล ปกติ' },
    { comID: '1', caption: 'กราฟไฟฟ้าต่างจากคนทั่วไปเล็กน้อย', comText: 'ค่าแปลผล กราฟไฟฟ้าต่างจากคนทั่วไปเล็กน้อย' },
    { comID: '2', caption: 'ผิดปกติ', comText: 'ค่าแปลผล ผิดปกติ' },
    { comID: '3', caption: 'ผิดปกติ พบแพทย์ทันที', comText: 'ค่าแปลผล ผิดปกติ พบแพทย์ทันที' },
  ];

  normalLabSelected;

  comments: String = '';
  subscription;

  constructor(
    public dialogRef: MdDialogRef<SearchPatientComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    public dbService: DbService
  ) {
    this.subscription = this.dbService.getEkgComment(Cookie.get('UID')).subscribe((result) => {
      this.otherLabComment = result;
      this.subscription = this.dbService.getHistoryResult(this.data.PatientGUID).subscribe((resultHistory) => {
        if (resultHistory.length !== 0) {

          this.comments = resultHistory[0].HEEKGInfoTH;
          const tmpComment = this.normalLabComment.filter((otherComment: any) => {
            return (otherComment.comID.indexOf(resultHistory[0].HEEKG) > -1);
          });

          if (tmpComment.length !== 0) {
            this.normalLabSelected = tmpComment[0];
          }
        }
      });
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveComment(): void {

    const objResult = {
      patientGUID: this.data.PatientGUID,
      HEEKG: this.normalLabSelected.comID,
      HEEKGInfoTH: this.comments
    };

    this.subscription = this.dbService.postSaveResult(objResult).subscribe(() => {
      this.dialogRef.close();
    });

  }

  onRadioResultClick(result) {
    this.normalLabSelected = result;
  }

  addOtherComment(comment) {
    // new !
    if (this.comments) {
      this.comments += '\n';
    }

    this.comments += comment;

  }
}
