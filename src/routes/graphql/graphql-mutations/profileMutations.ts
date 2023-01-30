import { FastifyInstance } from 'fastify';
import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql/type';
import { ProfileType } from '../graphql-queries/profileQueries';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';
import ProfileController from '../../../controllers/profileController';

export const addProfileMutation = {
  type: ProfileType,
  args: {
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (
    source: any,
    args: Omit<ProfileEntity, 'id'>,
    context: FastifyInstance
  ) => {
    return new ProfileController(context).createNewProfile(args);
  },
};

export const updateProfileMutation = {
  type: ProfileType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
  },
  resolve: async (
    source: any,
    args: Omit<ProfileEntity, 'userId'>,
    context: FastifyInstance
  ) => {
    return new ProfileController(context).updateProfile(args.id, {
      avatar: args.avatar,
      sex: args.sex,
      birthday: args.birthday,
      country: args.country,
      street: args.street,
      city: args.city,
      memberTypeId: args.memberTypeId,
    });
  },
};
