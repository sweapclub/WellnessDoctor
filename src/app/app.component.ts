import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { DbService } from './db-service.service';

// ng2-cookies
import { Cookie } from 'ng2-cookies';

export interface LoginIF {
  FullName: String;
  UID: String;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cookieLogin: LoginIF;

  subscription;

  constructor(private dbService: DbService) {
    this.cookieLogin = Cookie.getAll();
  }


  checkLoginStatus(): boolean {
    // console.log(this.cookieLogin.FullName);
    if (this.cookieLogin.FullName) {
      // console.log('check true');
      return true;
    }
    // console.log('check false');
    return false;
  }

  doLogin(objForm) {
    if (objForm.invalid) {
      return;
    }

    const objLogin = {
      id: objForm.value.inpUserName,
      pwd: objForm.value.inpPassword
    };

    this.subscription = this.dbService.postLogin(objLogin).subscribe((data) => {
      if (data.length !== 0) {

        Cookie.set('FullName', data[0].FullName, 1);
        Cookie.set('UID', data[0].UID, 1);

        this.cookieLogin = Cookie.getAll();
        console.log(this.cookieLogin);
      }
    });

    // Cookie.set('LoginName', objForm.value.inpUserName, 1);
    // this.cookieLogin = Cookie.getAll();
  }

  logOut() {
    Cookie.deleteAll();
    this.cookieLogin = Cookie.getAll();
  }


}
