import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityAction, ActivityTargetType, IActivityLog } from '../interfaces/activityLog.interface';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('activity_logs')
export class ActivityLog implements IActivityLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id', type: 'int', nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.activityLogs)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'action', type: 'enum', enum: ActivityAction, nullable: false })
  action: ActivityAction;

  @Column({ name: 'target_id', type: 'int', nullable: false })
  targetId: number;

  @Column({ name: 'target_type', type: 'enum', enum: ActivityTargetType, nullable: false })
  targetType: ActivityTargetType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
