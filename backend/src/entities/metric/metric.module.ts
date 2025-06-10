import { Module } from '@nestjs/common';
import { MetricService } from './metric.service';
import { MetricController } from './metric.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Metric } from './metric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Metric])],
  providers: [MetricService],
  controllers: [MetricController],
  exports: [MetricService]
})
export class MetricModule {}
