import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type';
import { FastifyInstance } from 'fastify';
import ProfileController from '../../../controllers/profileController';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: GraphQLID },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    userId: { type: GraphQLID },
  }),
});

export const profileQuery = {
  type: ProfileType,
  args: { id: { type: GraphQLID } },
  resolve: async (
    source: any,
    args: { id: string },
    context: FastifyInstance
  ) => {
    return new ProfileController(context).getProfileById(args.id);
  },
};
export const profilesQuery = {
  type: new GraphQLList(ProfileType),
  resolve: async (
    source: any,
    args: { id: string },
    context: FastifyInstance
  ) => {
    return new ProfileController(context).getAllProfiles();
  },
};
