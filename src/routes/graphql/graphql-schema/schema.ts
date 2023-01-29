import { GraphQLObjectType, GraphQLSchema } from 'graphql/type';
import { userQuery, usersQuery } from '../graphql-queries/userQueries';
import { postQuery, postsQuery } from '../graphql-queries/postQueries';
import { profileQuery, profilesQuery } from '../graphql-queries/profileQueries';
import {
  memberTypeQuery,
  memberTypesQuery,
} from '../graphql-queries/memberTypeQueries';

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

export default new GraphQLSchema({
  query: RootQuery,
});
