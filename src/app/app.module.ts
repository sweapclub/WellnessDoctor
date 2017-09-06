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
  MdProgressSpinnerModule
} from '@angular/material';

// Router
import { AppRoutingModule } from './app-routing.module';

// DB Express
import { DbService } from './db-service.service';

// Service App
import { AppService } from './app-service.service';

// Component
import { AppComponent } from './app.component';
import { SearchPatientComponent } from './search-patient/search-patient.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchPatientComponent
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
    MdProgressSpinnerModule
  ],
  providers: [DbService, AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
