import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
  ) {}

  async create(createEmployeeDto: Prisma.EmployeeCreateInput) {
    return this.databaseService.employee.create({
      data: createEmployeeDto,
    });
  }

  async findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    if (role)
      return this.databaseService.employee.findMany({
        where: {
          role,
        },
      });

    return this.databaseService.employee.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.employee.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    const employee = await this.findOne(id);
    if (!employee) throw new Error('Employee not found');
    
    const updatedEmployee = await this.databaseService.employee.update({
      where: { id },
      data: updateEmployeeDto
    });

    if (updateEmployeeDto.role && updateEmployeeDto.role !== employee.role) {
      await this.mailService.sendRoleChangeNotification(
        updatedEmployee.email,
        updatedEmployee.name,
        updateEmployeeDto.role as string
      );
    }

    return updatedEmployee;
  }

  async remove(id: number) {
    return this.databaseService.employee.delete({
      where: {
        id,
      },
    });
  }
}
