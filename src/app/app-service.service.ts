import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
  doctorID: String;

  padZero(num, size): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }
}
