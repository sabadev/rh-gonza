import { Component, OnInit } from '@angular/core';
import { EmployeesService } from 'src/app/services/employees.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
})
export class EmployeesListComponent implements OnInit {
  employees: any[] = [];

  constructor(
    private employeesService: EmployeesService,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeesService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data.filter((employee) => employee.username); // Filtrar empleados con usuario
        console.log('Empleados cargados:', this.employees);
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
      },
    });
  }


  async confirmDelete(employee: any): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de eliminar a ${employee.name}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => this.deleteEmployee(employee.id),
        },
      ],
    });

    await alert.present();
  }

  deleteEmployee(id: string): void {
    this.employeesService.deleteEmployee(id).subscribe({
      next: () => this.loadEmployees(),
      error: (error) => console.error('Error al eliminar empleado:', error),
    });
  }
}
