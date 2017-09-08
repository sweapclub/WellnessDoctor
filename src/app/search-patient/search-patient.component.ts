import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DbService } from '../db-service.service';
import { AppService } from '../app-service.service';

// Model
import { PatientInterface } from '../interface/patientInterface';
import { LabComment } from '../interface/labComment.interface';

// Dialog
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';


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
    private appService: AppService,
    public dialog: MdDialog
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

  openSettingDialog(obj): void {
    const dialogRef = this.dialog.open(DialogSettingComponent, {
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openLabDialog(): void {
    const dialogRef = this.dialog.open(DialogLabComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'app-dialog-setting',
  // template: `<p> Hello </p>`,
  templateUrl: './dialog/dialog-setting.component.html',
  styleUrls: ['./search-patient.component.css']
})
export class DialogSettingComponent {
  otherLabComment = [
    { comID: 'C01', comText: 'มีค่าที่ต้องเฝ้าระวัง และกรุณาพบแพทย์' },
    { comID: 'C02', comText: 'มีค่าที่ต้องเฝ้าระวัง และติดตามอาการในอีกสองสัปดาห์' },
    { comID: 'C03', comText: 'ความตรวจสอบกับนักรังสีวิทยาทันที' }
  ];

  constructor(
    public dialogRef: MdDialogRef<SearchPatientComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addOtherComment(objForm) {
    console.log(objForm.value.otherComment);
    if (!objForm.value.otherComment) {
      return;
    }

    const pos = this.otherLabComment.findIndex((char) => {
      return char.comID === objForm.value.otherComment.comID;
    });

    if (pos !== -1) {
      return;
    }

    const newComment = {
      comID: 'Gen New !',
      comText: objForm.value.otherComment
    };

    this.otherLabComment.push(newComment);
    objForm.reset();
  }

}

@Component({
  selector: 'app-lab-setting',
  // template: `<p> Hello </p>`,
  templateUrl: './dialog/dialog-lab.component.html',
  styleUrls: ['./search-patient.component.css']
})
export class DialogLabComponent {
  otherLabComment = [
    { comID: 'C01', comText: 'มีค่าที่ต้องเฝ้าระวัง และกรุณาพบแพทย์' },
    { comID: 'C02', comText: 'มีค่าที่ต้องเฝ้าระวัง และติดตามอาการในอีกสองสัปดาห์' },
    { comID: 'C03', comText: 'ความตรวจสอบกับนักรังสีวิทยาทันที' }
  ];

  normalLabComment = [
    { comID: 'N01', caption: 'ปกติ', comText: 'ค่าแปลผล ปกติ' },
    { comID: 'N02', caption: 'กราฟไฟฟ้าต่างจากคนทั่วไปเล็กน้อย', comText: 'ค่าแปลผล กราฟไฟฟ้าต่างจากคนทั่วไปเล็กน้อย' },
    { comID: 'N03', caption: 'ผิดปกติ', comText: 'ค่าแปลผล ผิดปกติ' },
    { comID: 'N04', caption: 'ผิดปกติ พบแพทย์ทันที', comText: 'ค่าแปลผล ผิดปกติ พบแพทย์ทันที' },
  ];

  normalLabSelected: LabComment;

  comments: LabComment[] = [];
  labAutoComment: LabComment;

  constructor(
    public dialogRef: MdDialogRef<SearchPatientComponent>,
    @Inject(MD_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addOtherComment(objForm) {

    if (!objForm.value.otherComment) {
      return;
    }

    const pos = this.comments.findIndex((char) => {
      return char.comID === objForm.value.otherComment.comID;
    });

    if (pos !== -1) {
      return;
    }

    this.comments.push(objForm.value.otherComment);
    objForm.reset();
  }

}
