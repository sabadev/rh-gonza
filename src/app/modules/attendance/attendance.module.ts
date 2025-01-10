import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceLogComponent } from './attendance-log/attendance-log.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from '../shared/menu/menu.component';
import { SharedModule } from '../shared/shared.module';
import { AttendanceGeneralReportComponent } from './attendance-general-report/attendance-general-report.component';


const routes: Routes = [
  { path: '', component: AttendanceLogComponent },
  { path: 'report', component: AttendanceGeneralReportComponent }

];

@NgModule({
  declarations: [AttendanceLogComponent,AttendanceGeneralReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    IonicModule,
    SharedModule
  ],
})
export class AttendanceModule { }
