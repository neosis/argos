import {Injectable} from "@angular/core";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable()
export class IconService {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer){}
  init(){
    this.matIconRegistry.addSvgIcon('calendar-svg',this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/calendar.svg"));
  }
}
