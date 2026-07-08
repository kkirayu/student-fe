import { IsString, IsNumber, IsEmail, IsIn, Min, Max } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  nim: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  class: string;

  @IsNumber()
  year: number;

  @IsNumber()
  @Min(0)
  @Max(4)
  gpa: number;

  @IsString()
  @IsIn(['active', 'graduated', 'dropout'])
  status: string;
}
