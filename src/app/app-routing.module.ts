import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProjectScheduleComponent} from "./project-schedule/project-schedule.component";


const routes: Routes = [
  {path: '', component: ProjectScheduleComponent},
  {path: 'project-schedule', component: ProjectScheduleComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
