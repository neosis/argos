import { Component } from '@angular/core';
import {IconService} from "./service/icon.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Argos - God of many eyes';
  constructor(private iconService: IconService){
    this.iconService.init();
  }
}
