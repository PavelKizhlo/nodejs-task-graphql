import { FastifyInstance } from 'fastify';
import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql/type';
import { UserType } from '../graphql-queries/userQueries';
import UserController from '../../../controllers/userController';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';

export const addUserMutation = {
  type: UserType,
  args: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (
    source: any,
    args: Omit<UserEntity, 'id' | 'subscribedToUserIds'>,
    context: FastifyInstance
  ) => {
    return new UserController(context).createNewUser(args);
  },
};

export const subscribeToUserMutation = {
  type: UserType,
  args: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
    subscribedTo: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (
    source: any,
    args: { userId: string; subscribeTo: string },
    context: FastifyInstance
  ) => {
    return new UserController(context).subscribeToUser(
      args.userId,
      args.subscribeTo
    );
  },
};

export const unsubscribeFromUserMutation = {
  type: UserType,
  args: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
    unsubscribeFrom: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (
    source: any,
    args: { userId: string; unsubscribeFrom: string },
    context: FastifyInstance
  ) => {
    return new UserController(context).unsubscribeFromUser(
      args.userId,
      args.unsubscribeFrom
    );
  },
};

export const updateUserMutation = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
  },
  resolve: async (source: any, args: UserEntity, context: FastifyInstance) => {
    return new UserController(context).updateUser(args.id, {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      subscribedToUserIds: args.subscribedToUserIds,
    });
  },
};
