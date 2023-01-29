import { FastifyInstance } from 'fastify';
import { HttpErrors } from '@fastify/sensible/lib/httpError';
import { ProfileEntity } from '../utils/DB/entities/DBProfiles';
import DB from '../utils/DB/DB';
import { NoRequiredEntity } from '../utils/DB/errors/NoRequireEntity.error';

export default class ProfileController {
  private declare db: DB;
  private declare httpErrors: HttpErrors;

  constructor(fastify: FastifyInstance) {
    this.db = fastify.db;
    this.httpErrors = fastify.httpErrors;
  }

  async getAllProfiles(): Promise<ProfileEntity[]> {
    return await this.db.profiles.findMany();
  }

  async getProfileById(id: string): Promise<ProfileEntity> {
    const profile = await this.db.profiles.findOne({
      key: 'id',
      equals: id,
    });
    if (!profile) {
      throw this.httpErrors.notFound('No profiles with such id');
    }
    return profile;
  }

  async createNewProfile(
    profileData: Omit<ProfileEntity, 'id'>
  ): Promise<ProfileEntity> {
    const allowedMemberType = await this.db.memberTypes.findOne({
      key: 'id',
      equals: profileData.memberTypeId,
    });
    const userAlreadyHasProfile = await this.db.profiles.findOne({
      key: 'userId',
      equals: profileData.userId,
    });
    if (userAlreadyHasProfile) {
      throw this.httpErrors.badRequest(
        'User with this id already have a profile'
      );
    }
    if (!allowedMemberType) {
      throw this.httpErrors.badRequest("No such member id's");
    }
    return await this.db.profiles.create(profileData);
  }

  async deleteProfile(id: string): Promise<ProfileEntity> {
    try {
      return await this.db.profiles.delete(id);
    } catch (err) {
      throw err instanceof NoRequiredEntity
        ? this.httpErrors.badRequest('No profiles with such id')
        : err;
    }
  }

  async updateProfile(
    id: string,
    profileData: Partial<Omit<ProfileEntity, 'id' | 'userId'>>
  ): Promise<ProfileEntity> {
    if (!Object.keys(profileData).length) {
      throw this.httpErrors.badRequest('Add fields you want to update');
    }
    return await this.db.profiles.change(id, profileData);
  }
}
