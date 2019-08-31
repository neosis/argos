import {NgModule} from "@angular/core";
import {MatButtonModule, MatDividerModule, MatIconModule, MatToolbarModule, MatTreeModule} from "@angular/material";

@NgModule({
  imports: [MatToolbarModule, MatIconModule, MatTreeModule, MatButtonModule, MatDividerModule, MatButtonModule],
  exports: [MatToolbarModule, MatIconModule, MatTreeModule, MatButtonModule, MatDividerModule, MatButtonModule]
})
export class AppMaterialModule {}
