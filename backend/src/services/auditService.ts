import { auditRepository } from '../repositories/commonRepository.js';
import type { AuditLog, AuditActor, AuditStatus } from '../types/index.js';

export const auditService = {
  async log(params: {
    actor: AuditActor;
    actorId?: string;
    event: string;
    status: AuditStatus;
    relatedOrderId?: string;
    relatedOrderNumber?: string;
    relatedProductId?: string;
    relatedProductName?: string;
    metadata?: Record<string, unknown>;
  }): Promise<AuditLog> {
    return auditRepository.create(params);
  },
};
