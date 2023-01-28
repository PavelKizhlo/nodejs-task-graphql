import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { NoRequiredEntity } from '../../utils/DB/errors/NoRequireEntity.error';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (!user) {
        throw reply.notFound('No users with such id');
      }
      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const newUser = await fastify.db.users.create(request.body);
      return newUser;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const user = await fastify.db.users.delete(request.params.id);
        const followers = await fastify.db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: user.id,
        });
        for (const follower of followers) {
          const updatedSubscribes = follower.subscribedToUserIds.filter(
            (id) => id !== user.id
          );
          await fastify.db.users.change(follower.id, {
            subscribedToUserIds: updatedSubscribes,
          });
        }
        return user;
      } catch (err) {
        throw err instanceof NoRequiredEntity
          ? reply.badRequest('No users with such id')
          : err;
      }
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });
      if (!user) {
        throw reply.badRequest('No users with such id');
      }
      const updatedSubscribes = [
        ...user.subscribedToUserIds,
        request.params.id,
      ];
      const updatedUser = await fastify.db.users.change(user.id, {
        subscribedToUserIds: updatedSubscribes,
      });
      return updatedUser;
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });
      if (!user) {
        throw reply.notFound('No users with such id');
      }
      if (!user.subscribedToUserIds.includes(request.params.id)) {
        throw reply.badRequest('User is not following received user');
      }
      const updatedSubscribes = user.subscribedToUserIds.filter(
        (id) => id !== request.params.id
      );
      const updatedUser = await fastify.db.users.change(user.id, {
        subscribedToUserIds: updatedSubscribes,
      });
      return updatedUser;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      if (!Object.keys(request.body).length) {
        throw reply.badRequest('Add fields you want to update');
      }
      const updatedUser = await fastify.db.users.change(
        request.params.id,
        request.body
      );
      return updatedUser;
    }
  );
};

export default plugin;
