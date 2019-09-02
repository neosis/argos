import {NgModule} from "@angular/core";
import {
  MatButtonModule, MatDatepickerModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule, MatSliderModule,
  MatToolbarModule,
  MatTreeModule
} from "@angular/material";
import {MatMomentDateModule} from "@angular/material-moment-adapter";

@NgModule({
  imports: [MatToolbarModule, MatIconModule, MatTreeModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatDatepickerModule,MatMomentDateModule, MatSliderModule],
  exports: [MatToolbarModule, MatIconModule, MatTreeModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatMomentDateModule, MatSliderModule]
})
export class AppMaterialModule {}
