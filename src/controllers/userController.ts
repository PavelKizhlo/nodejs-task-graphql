import { FastifyInstance } from 'fastify';
import { HttpErrors } from '@fastify/sensible/lib/httpError';
import { UserEntity } from '../utils/DB/entities/DBUsers';
import DB from '../utils/DB/DB';
import { NoRequiredEntity } from '../utils/DB/errors/NoRequireEntity.error';

export default class UserController {
  private declare db: DB;
  private declare httpErrors: HttpErrors;

  constructor(fastify: FastifyInstance) {
    this.db = fastify.db;
    this.httpErrors = fastify.httpErrors;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.db.users.findMany();
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.db.users.findOne({
      key: 'id',
      equals: id,
    });
    if (!user) {
      throw this.httpErrors.notFound('No users with such id');
    }
    return user;
  }

  async createNewUser(
    userData: Omit<UserEntity, 'id' | 'subscribedToUserIds'>
  ): Promise<UserEntity> {
    return await this.db.users.create(userData);
  }

  async deleteUser(id: string): Promise<UserEntity> {
    try {
      const user = await this.db.users.delete(id);
      const followers = await this.db.users.findMany({
        key: 'subscribedToUserIds',
        inArray: user.id,
      });
      for (const follower of followers) {
        const updatedSubscribes = follower.subscribedToUserIds.filter(
          (id) => id !== user.id
        );
        await this.db.users.change(follower.id, {
          subscribedToUserIds: updatedSubscribes,
        });
      }
      const userPosts = await this.db.posts.findMany({
        key: 'userId',
        equals: user.id,
      });
      if (userPosts.length) {
        for (const userPost of userPosts) {
          await this.db.posts.delete(userPost.id);
        }
      }
      const userProfile = await this.db.profiles.findOne({
        key: 'userId',
        equals: user.id,
      });
      if (userProfile) {
        await this.db.profiles.delete(userProfile.id);
      }
      return user;
    } catch (err) {
      throw err instanceof NoRequiredEntity
        ? this.httpErrors.badRequest('No users with such id')
        : err;
    }
  }

  async subscribeToUser(
    userId: string,
    subscribeTo: string
  ): Promise<UserEntity> {
    const user = await this.db.users.findOne({
      key: 'id',
      equals: userId,
    });
    if (!user) {
      throw this.httpErrors.badRequest('No users with such id');
    }
    const updatedSubscribes = [...user.subscribedToUserIds, subscribeTo];
    return await this.db.users.change(user.id, {
      subscribedToUserIds: updatedSubscribes,
    });
  }

  async unsubscribeFromUser(
    userId: string,
    unsubscribeFrom: string
  ): Promise<UserEntity> {
    const user = await this.db.users.findOne({
      key: 'id',
      equals: userId,
    });
    if (!user) {
      throw this.httpErrors.notFound('No users with such id');
    }
    if (!user.subscribedToUserIds.includes(unsubscribeFrom)) {
      throw this.httpErrors.badRequest('User is not following received user');
    }
    const updatedSubscribes = user.subscribedToUserIds.filter(
      (id) => id !== unsubscribeFrom
    );
    return await this.db.users.change(user.id, {
      subscribedToUserIds: updatedSubscribes,
    });
  }

  async updateUser(
    id: string,
    userData: Partial<Omit<UserEntity, 'id'>>
  ): Promise<UserEntity> {
    if (!Object.keys(userData).length) {
      throw this.httpErrors.badRequest('Add fields you want to update');
    }
    return await this.db.users.change(id, userData);
  }
}
