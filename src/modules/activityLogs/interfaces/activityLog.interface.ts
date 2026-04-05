import { User } from 'src/modules/users/entities/user.entity';

export enum ActivityAction {
  // Common
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',

  // Project
  ARCHIVED = 'archived',
  RESTORED = 'restored',
  INVITED_MEMBERS = 'invited_members',

  //Task
  STATUS_CHANGED = 'status_changed',
  ASSIGNED = 'assigned',
  UNASSIGNED = 'unassigned',

  // Attachment
  UPLOAD = 'upload',
  UPDATE = 'update',
  DELETE = 'delete'
}

export enum ActivityTargetType {
  PROJECT = 'project',
  USER = 'user',
  TASK = 'task',
  ATTACHMENT = 'attachment',
  RISK = 'risk',
  ISSUE = 'issue'
}

export interface IActivityLog {
  id: number;
  userId: number;
  action: ActivityAction;
  user?: User;
  targetId: number;
  targetType: ActivityTargetType;
  createdAt: Date;
}
