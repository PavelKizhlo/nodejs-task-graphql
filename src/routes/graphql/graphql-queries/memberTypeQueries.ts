import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type';
import { FastifyInstance } from 'fastify';
import MemberTypeController from '../../../controllers/memberTypeController';

export const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: GraphQLString },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});

export const memberTypeQuery = {
  type: MemberTypeType,
  args: { id: { type: GraphQLString } },
  resolve: async (
    source: any,
    args: { id: string },
    context: FastifyInstance
  ) => {
    return new MemberTypeController(context).getMemberTypeById(args.id);
  },
};
export const memberTypesQuery = {
  type: new GraphQLList(MemberTypeType),
  resolve: async (source: any, args: undefined, context: FastifyInstance) => {
    return new MemberTypeController(context).getAllMemberTypes();
  },
};
