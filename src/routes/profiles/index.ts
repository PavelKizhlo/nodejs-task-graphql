import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { NoRequiredEntity } from '../../utils/DB/errors/NoRequireEntity.error';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return await fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (!profile) {
        throw reply.notFound('No profiles with such id');
      }
      return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const allowedMemberType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: request.body.memberTypeId,
      });
      const userAlreadyHasProfile = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: request.body.userId,
      });
      if (userAlreadyHasProfile) {
        throw reply.badRequest('User with this id already have a profile');
      }
      if (!allowedMemberType) {
        throw reply.badRequest("No such member id's");
      }
      const profile = fastify.db.profiles.create(request.body);
      return profile;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        const profile = await fastify.db.profiles.delete(request.params.id);
        return profile;
      } catch (err) {
        throw err instanceof NoRequiredEntity
          ? reply.badRequest('No profiles with such id')
          : err;
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      if (!Object.keys(request.body).length) {
        throw reply.badRequest('Add fields you want to update');
      }
      const updatedProfile = await fastify.db.profiles.change(
        request.params.id,
        request.body
      );
      return updatedProfile;
    }
  );
};

export default plugin;
