import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import MemberTypeController from '../../controllers/memberTypeController';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  const controller = new MemberTypeController(fastify);

  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return await controller.getAllMemberTypes();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      return await controller.getMemberTypeById(request.params.id);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      return await controller.updateMemberType(request.params.id, request.body);
    }
  );
};

export default plugin;
