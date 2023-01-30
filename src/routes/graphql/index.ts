import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, validate, parse } from 'graphql';
import * as depthLimit from 'graphql-depth-limit';
import { graphqlBodySchema } from './schema';
import schema from './graphql-schema/schema';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const source = request.body.query!;
      const documentNode = parse(source);
      const validationRules = [depthLimit(5)];

      const depthErrors = validate(schema, documentNode, validationRules);

      if (depthErrors.length) reply.send({ data: null, errors: depthErrors });

      return await graphql({
        schema,
        source,
        variableValues: request.body.variables,
        contextValue: fastify,
      });
    }
  );
};

export default plugin;
