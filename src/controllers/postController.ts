import { FastifyInstance } from 'fastify';
import { HttpErrors } from '@fastify/sensible/lib/httpError';
import { PostEntity } from '../utils/DB/entities/DBPosts';
import DB from '../utils/DB/DB';
import { NoRequiredEntity } from '../utils/DB/errors/NoRequireEntity.error';

export default class PostController {
  private declare db: DB;
  private declare httpErrors: HttpErrors;

  constructor(fastify: FastifyInstance) {
    this.db = fastify.db;
    this.httpErrors = fastify.httpErrors;
  }

  async getAllPosts(): Promise<PostEntity[]> {
    return await this.db.posts.findMany();
  }

  async getPostById(id: string): Promise<PostEntity> {
    const post = await this.db.posts.findOne({
      key: 'id',
      equals: id,
    });
    if (!post) {
      throw this.httpErrors.notFound('No posts with such id');
    }
    return post;
  }

  async createNewPost(postData: Omit<PostEntity, 'id'>): Promise<PostEntity> {
    return await this.db.posts.create(postData);
  }

  async deletePost(id: string): Promise<PostEntity> {
    try {
      return await this.db.posts.delete(id);
    } catch (err) {
      throw err instanceof NoRequiredEntity
        ? this.httpErrors.badRequest('No posts with such id')
        : err;
    }
  }

  async updatePost(
    id: string,
    postData: Partial<Omit<PostEntity, 'id' | 'userId'>>
  ): Promise<PostEntity> {
    if (!Object.keys(postData).length) {
      throw this.httpErrors.badRequest('Add fields you want to update');
    }
    return await this.db.posts.change(id, postData);
  }
}
