import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('Metrics')
export class Metric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  temperature: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  humidity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  power_consumption: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  average_rms: number;

  @Column({ type: 'integer', nullable: false })
  air_quality: number;

  @CreateDateColumn({ type: 'timestamp' })
  creation_date: Date;
}
