import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate,  } from 'class-validator';

export class CreateMetricDto {
  @ApiProperty({ description: 'Temperatura' })
  @IsNumber()
  @IsNotEmpty()
  temperature: number;

  @ApiProperty({ description: 'Humedad' })
  @IsNumber()
  @IsNotEmpty()
  humidity: number;

  @ApiProperty({ description: 'Consumo de energía' })
  @IsNumber()
  @IsNotEmpty()
  power_consumption: number;

  @ApiProperty({ description: 'RMS promedio' })
  @IsNumber()
  @IsNotEmpty()
  average_rms: number;

  @ApiProperty({ description: 'Calidad del aire' })
  @IsNumber()
  @IsNotEmpty()
  air_quality: number;

  @ApiProperty({ description: 'Fecha de creación' })
  @IsDate()
  @IsNotEmpty()
  creation_date: Date;
}