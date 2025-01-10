import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-attendance-general-report',
  templateUrl: './attendance-general-report.component.html',
  styleUrls: ['./attendance-general-report.component.scss'],
})
export class AttendanceGeneralReportComponent  {

  startDate: string = '';
  endDate: string = '';
  report: any[] = [];

  constructor(private attendanceService: AttendanceService) {

  }

  getReport() {
    if (!this.startDate || !this.endDate) {
      alert('Por favor selecciona un rango de fechas.');
      return;
    }

    this.attendanceService.getGeneralReport(this.startDate, this.endDate).subscribe({
      next: (data) => (this.report = data),
      error: (err) => console.warn('Error al obtener reporte:', err),
    });
  }
}





