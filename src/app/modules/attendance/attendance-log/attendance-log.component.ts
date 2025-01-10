import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttendanceService } from 'src/app/services/attendance.service';
import { AuthService } from 'src/app/services/auth.service';

interface AttendanceLog {
  log_type: string;
  log_time: string;
}

@Component({
  selector: 'app-attendance-log',
  templateUrl: './attendance-log.component.html',
  styleUrls: ['./attendance-log.component.scss'],
})
export class AttendanceLogComponent implements OnInit {
  employeeId: number | null = null;
  recentLogs: AttendanceLog[] = [];
  hasEntry = false;
  hasExit = false;
  loading = false;
  message = '';
  photo: File | null = null;

  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Componente AttendanceLog inicializado.');
    this.loadEmployeeId();
    if (this.employeeId) {
      console.log(`Empleado ID cargado: ${this.employeeId}`);
      this.getRecentLogs();
    } else {
      console.error('No se pudo obtener el ID del empleado.');
    }
  }

  private loadEmployeeId(): void {
    console.log('Intentando cargar employeeId desde el localStorage...');
    const storedEmployeeId = localStorage.getItem('employeeId');
    if (storedEmployeeId) {
      this.employeeId = parseInt(storedEmployeeId, 10);
      console.log(`Employee ID encontrado en localStorage: ${this.employeeId}`);
    } else {
      console.error('No se encontró employeeId en el localStorage.');
    }
  }

  getRecentLogs(): void {
    if (!this.employeeId) {
      console.error('No se puede cargar logs sin un ID de empleado.');
      return;
    }

    console.log(`Obteniendo logs recientes para employeeId: ${this.employeeId}`);
    this.attendanceService.getRecentLogs(this.employeeId).subscribe({
      next: (data: AttendanceLog[]) => {
        console.log('Logs recientes obtenidos:', data);
        this.recentLogs = data;

        const today = new Date().toISOString().split('T')[0];
        this.hasEntry = data.some(
          (log) => log.log_type === 'entry' && log.log_time.startsWith(today)
        );
        this.hasExit = data.some(
          (log) => log.log_type === 'exit' && log.log_time.startsWith(today)
        );

        console.log(`Estado de entrada: ${this.hasEntry}, estado de salida: ${this.hasExit}`);
      },
      error: (error) => {
        console.error('Error al obtener logs recientes:', error);
      },
    });
  }




  async compressImage(file: File): Promise<Blob> {
    console.log('Iniciando compresión de la imagen...', file);
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        img.src = event.target.result;
        img.onload = () => {
          console.log('Imagen cargada para compresión.');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          console.log('Dibujando imagen en canvas para compresión...');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                console.log('Compresión de imagen exitosa.', blob);
                resolve(blob);
              } else {
                reject(new Error('No se pudo comprimir la imagen.'));
              }
            },
            'image/jpeg',
            0.8 // Calidad de compresión
          );
        };
      };
      reader.onerror = (error) => {
        console.error('Error al leer la imagen:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  async capturePhoto(event: any): Promise<void> {
    const file = event.target.files[0];
    console.log('Foto capturada:', file);
    if (file) {
      try {
        console.log('Iniciando compresión de la foto...');
        const compressedPhoto = await this.compressImage(file);
        this.photo = new File([compressedPhoto], file.name, { type: 'image/jpeg' });
        console.log('Foto comprimida lista para enviar:', this.photo);
      } catch (error) {
        console.error('Error al comprimir la foto:', error);
      }
    }
  }

  registerAttendanceWithPhoto(logType: string): void {
    if (!this.employeeId) {
      console.error('No se puede registrar asistencia sin un ID de empleado.');
      return;
    }

    if (!this.photo) {
      console.error('Se requiere una foto para registrar asistencia.');
      return;
    }

    console.log('Preparando para registrar asistencia...');
    this.loading = true;

    const formData = new FormData();
    formData.append('employee_id', this.employeeId!.toString());
    formData.append('log_type', logType);
    formData.append('photo', this.photo);

    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    console.log('FormData construido (antes de enviar):', {
      employee_id: this.employeeId,
      log_type: logType,
      photo: this.photo,
    });

    this.attendanceService.registerLogWithPhoto(formData).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor al registrar asistencia:', response);
        this.message = response.message;
        this.loading = false;
        this.getRecentLogs();
      },
      error: (error) => {
        console.error('Error al registrar asistencia:', error);
        console.log('FormData que causó error:', formData);
        this.message = error.error?.error || 'Error al registrar asistencia.';
        this.loading = false;
      },
    });
  }


  logout(): void {
    console.log('Cerrando sesión...');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
