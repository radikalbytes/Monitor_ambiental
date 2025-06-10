import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Metric } from './metric.entity';
import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';

@Injectable()
export class MetricService {
  constructor(@InjectRepository(Metric) private metricRepository: Repository<Metric>) {}

  /*
    Crea una nueva métrica
    @param Nueva métrica a crear
    @returns Métrica creada
  */
  async createMetric(metric: CreateMetricDto): Promise<Metric> {
    return this.metricRepository.save(metric);
  }

  /*
    Obtiene todas las métricas
    @returns Lista de métricas
  */
  async getMetrics(): Promise<Metric[]> {
    return this.metricRepository.find();
  }

  /*
    Obtiene una métrica por su ID
    @param ID de la métrica
    @returns Métrica encontrada
  */
  async getMetricById(id: string): Promise<Metric> {
    return this.metricRepository.findOne({ where: { id } });
  }
  
  /*
    Actualiza una métrica
    @param ID de la métrica
    @param Métrica a actualizar
    @returns Métrica actualizada
  */
  async updateMetric(id: string, metric: UpdateMetricDto): Promise<Metric> {
    await this.metricRepository.update(id, metric);
    return this.metricRepository.findOne({ where: { id } });
  }

  /*
    Elimina una métrica
    @param ID de la métrica
    @returns void
  */
  async deleteMetric(id: string): Promise<void> {
    await this.metricRepository.delete(id);
  }
}