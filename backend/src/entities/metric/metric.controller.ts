import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MetricService } from './metric.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { Metric } from './metric.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateMetricDto } from './dto/update-metric.dto';

@ApiTags('Metricas')
@Controller('metrics')
export class MetricController {

  constructor(private readonly metricService: MetricService){}

  @Post()
  @ApiOperation({ summary: 'Crea una nueva métrica' })
  @ApiResponse({ status: 201, description: 'Métrica creada correctamente' })
  @ApiResponse({ status: 500, description: 'Error al crear la métrica' })
  async createMetric(@Body() metric: CreateMetricDto): Promise<Metric> {
    return this.metricService.createMetric(metric);
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene todas las métricas' })
  @ApiResponse({ status: 200, description: 'Métricas obtenidas correctamente' })
  @ApiResponse({ status: 500, description: 'Error al obtener las métricas' })
  async getMetrics(): Promise<Metric[]> {
    return this.metricService.getMetrics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una métrica por su ID' })
  @ApiResponse({ status: 200, description: 'Métrica obtenida correctamente' })
  @ApiResponse({ status: 500, description: 'Error al obtener la métrica' })
  async getMetricById(@Param('id') id: string): Promise<Metric> {
    return this.metricService.getMetricById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza una métrica' })
  @ApiResponse({ status: 200, description: 'Métrica actualizada correctamente' })
  @ApiResponse({ status: 500, description: 'Error al actualizar la métrica' })
  async updateMetric(@Param('id') id: string, @Body() metric: UpdateMetricDto): Promise<Metric> {
    return this.metricService.updateMetric(id, metric);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una métrica' })
  @ApiResponse({ status: 200, description: 'Métrica eliminada correctamente' })
  @ApiResponse({ status: 500, description: 'Error al eliminar la métrica' })
  async deleteMetric(@Param('id') id: string): Promise<void> {
    return this.metricService.deleteMetric(id);
  }
}
