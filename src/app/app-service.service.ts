import { Injectable } from '@angular/core';

@Injectable()
export class AppService {

  showDate(dateValue: String): String {
    if (dateValue.length < 10) {
      return null;
    }
    return dateValue.substring(0, 10);
  }

  padZero(num, size): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }
}
