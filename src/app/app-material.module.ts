import {NgModule} from "@angular/core";
import {
  MatButtonModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatToolbarModule,
  MatTreeModule
} from "@angular/material";

@NgModule({
  imports: [MatToolbarModule, MatIconModule, MatTreeModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatInputModule],
  exports: [MatToolbarModule, MatIconModule, MatTreeModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatInputModule]
})
export class AppMaterialModule {}
