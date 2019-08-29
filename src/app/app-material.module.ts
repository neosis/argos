import {NgModule} from "@angular/core";
import {MatButtonModule, MatIconModule, MatToolbarModule, MatTreeModule} from "@angular/material";

@NgModule({
  imports: [MatToolbarModule, MatIconModule, MatTreeModule, MatButtonModule],
  exports: [MatToolbarModule, MatIconModule, MatTreeModule, MatButtonModule]
})
export class AppMaterialModule {}
