import { FastifyInstance } from 'fastify';
import { HttpErrors } from '@fastify/sensible/lib/httpError';
import { MemberTypeEntity } from '../utils/DB/entities/DBMemberTypes';
import DB from '../utils/DB/DB';

export default class MemberTypeController {
  private declare db: DB;
  private declare httpErrors: HttpErrors;

  constructor(fastify: FastifyInstance) {
    this.db = fastify.db;
    this.httpErrors = fastify.httpErrors;
  }

  async getAllMemberTypes(): Promise<MemberTypeEntity[]> {
    return await this.db.memberTypes.findMany();
  }

  async getMemberTypeById(id: string): Promise<MemberTypeEntity> {
    const memberType = await this.db.memberTypes.findOne({
      key: 'id',
      equals: id,
    });
    if (!memberType) {
      throw this.httpErrors.notFound('No memberTypes with such id');
    }
    return memberType;
  }

  async updateMemberType(
    id: string,
    memberTypeData: Partial<Omit<MemberTypeEntity, 'id'>>
  ): Promise<MemberTypeEntity> {
    if (!Object.keys(memberTypeData).length) {
      throw this.httpErrors.badRequest('Add fields you want to update');
    }
    return await this.db.memberTypes.change(id, memberTypeData);
  }
}
