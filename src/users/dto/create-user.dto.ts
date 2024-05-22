import { IsEmail, IsEnum, IsString, IsNotEmpty} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsEnum(['INTERN', 'ENGINEER', 'ADMIN'], {
        message: 'Role must be one of the following values: INTERN, ENGINEER, ADMIN'
    })
    role: 'INTERN' | 'ENGINEER' | 'ADMIN';
}