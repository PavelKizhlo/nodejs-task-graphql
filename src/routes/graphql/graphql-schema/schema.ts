import { GraphQLObjectType, GraphQLSchema } from 'graphql/type';
import { userQuery, usersQuery } from '../graphql-queries/userQueries';
import { postQuery, postsQuery } from '../graphql-queries/postQueries';
import { profileQuery, profilesQuery } from '../graphql-queries/profileQueries';
import {
  memberTypeQuery,
  memberTypesQuery,
} from '../graphql-queries/memberTypeQueries';
import {
  addUserMutation,
  subscribeToUserMutation,
  unsubscribeFromUserMutation,
  updateUserMutation,
} from '../graphql-mutations/userMutations';
import {
  addProfileMutation,
  updateProfileMutation,
} from '../graphql-mutations/profileMutations';
import {
  addPostMutation,
  updatePostMutation,
} from '../graphql-mutations/postMutations';
import { updateMemberTypeMutation } from '../graphql-mutations/memberTypeMutations';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    user: userQuery,
    users: usersQuery,
    profile: profileQuery,
    profiles: profilesQuery,
    post: postQuery,
    posts: postsQuery,
    memberType: memberTypeQuery,
    memberTypes: memberTypesQuery,
  }),
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => ({
    addUser: addUserMutation,
    updateUser: updateUserMutation,
    subscribeToUser: subscribeToUserMutation,
    unsubscribeFromUser: unsubscribeFromUserMutation,
    addProfile: addProfileMutation,
    updateProfile: updateProfileMutation,
    addPost: addPostMutation,
    updatePost: updatePostMutation,
    updateMemberType: updateMemberTypeMutation,
  }),
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
