import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule,
  MdToolbarModule,
  MdIconModule,
  MdCardModule,
  MdInputModule,
  MdGridListModule,
  MdDatepickerModule,
  MdNativeDateModule,
  MdProgressSpinnerModule,
  MdSidenavModule,
  MdRadioModule,
  MdSelectModule,
  MdListModule
} from '@angular/material';

// Router
import { AppRoutingModule } from './app-routing.module';

// DB Express
import { DbService } from './db-service.service';

// Service App
import { AppService } from './app-service.service';

// Component
import { AppComponent } from './app.component';
import {
  SearchPatientComponent,
  DialogSettingComponent,
  DialogLabComponent
 } from './search-patient/search-patient.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchPatientComponent,
    DialogSettingComponent,
    DialogLabComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    MdButtonModule,
    MdToolbarModule,
    MdIconModule,
    MdCardModule,
    MdInputModule,
    MdGridListModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdProgressSpinnerModule,
    MdSidenavModule,
    MdRadioModule,
    MdSelectModule,
    MdListModule
  ],
  entryComponents: [
    DialogSettingComponent,
    DialogLabComponent
  ],
  providers: [DbService, AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
