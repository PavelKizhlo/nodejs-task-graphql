import { FastifyInstance } from 'fastify';
import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql/type';
import { MemberTypeType } from '../graphql-queries/memberTypeQueries';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes';
import MemberTypeController from '../../../controllers/memberTypeController';

export const updateMemberTypeMutation = {
  type: MemberTypeType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
  resolve: async (
    source: any,
    args: MemberTypeEntity,
    context: FastifyInstance
  ) => {
    return new MemberTypeController(context).updateMemberType(args.id, {
      discount: args.discount,
      monthPostsLimit: args.monthPostsLimit,
    });
  },
};
