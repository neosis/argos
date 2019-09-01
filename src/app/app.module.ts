import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectScheduleComponent } from './project-schedule/project-schedule.component';
import {AppMaterialModule} from "./app-material.module";
import {HttpClientModule} from "@angular/common/http";
import {IconService} from "./service/icon.service";
import {FlexLayoutModule} from "@angular/flex-layout";
import {SplitModule} from "../../split/split.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";



@NgModule({
  declarations: [
    AppComponent,
    ProjectScheduleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    SplitModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [IconService],
  bootstrap: [AppComponent]
})
export class AppModule { }
