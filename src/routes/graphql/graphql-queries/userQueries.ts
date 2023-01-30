import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type';
import { FastifyInstance } from 'fastify';
import UserController from '../../../controllers/userController';
import { PostType } from './postQueries';
import PostController from '../../../controllers/postController';
import { ProfileType } from './profileQueries';
import ProfileController from '../../../controllers/profileController';
import { MemberTypeType } from './memberTypeQueries';
import MemberTypeController from '../../../controllers/memberTypeController';

export const UserType: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (
        parent: any,
        args: undefined,
        context: FastifyInstance
      ) => {
        return new PostController(context).getUserPosts(parent.id);
      },
    },
    profile: {
      type: ProfileType,
      resolve: async (
        parent: any,
        args: undefined,
        context: FastifyInstance
      ) => {
        return new ProfileController(context).getUsersProfile(parent.id);
      },
    },
    memberType: {
      type: MemberTypeType,
      resolve: async (
        parent: any,
        args: undefined,
        context: FastifyInstance
      ) => {
        const profile = await new ProfileController(context).getUsersProfile(
          parent.id
        );
        return await new MemberTypeController(context).getMemberTypeById(
          profile.memberTypeId
        );
      },
    },
    subscribes: {
      type: new GraphQLList(UserType),
      resolve: async (
        parent: any,
        args: undefined,
        context: FastifyInstance
      ) => {
        return await new UserController(context).getUserSubscribes(
          parent.subscribedToUserIds
        );
      },
    },
    followers: {
      type: new GraphQLList(UserType),
      resolve: async (
        parent: any,
        args: undefined,
        context: FastifyInstance
      ) => {
        return await new UserController(context).getUserFollowers(parent.id);
      },
    },
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
