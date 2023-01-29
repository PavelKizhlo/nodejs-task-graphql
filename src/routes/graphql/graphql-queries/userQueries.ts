import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type';
import { FastifyInstance } from 'fastify';
import UserController from '../../../controllers/userController';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
  }),
});

export const userQuery = {
  type: UserType,
  args: { id: { type: GraphQLID } },
  resolve: async (
    source: any,
    args: { id: string },
    context: FastifyInstance
  ) => {
    return new UserController(context).getUserById(args.id);
  },
};

export const usersQuery = {
  type: new GraphQLList(UserType),
  resolve: async (source: any, args: undefined, context: FastifyInstance) => {
    return new UserController(context).getAllUsers();
  },
};
