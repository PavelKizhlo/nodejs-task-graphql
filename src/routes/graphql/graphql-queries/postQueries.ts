import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type';
import { FastifyInstance } from 'fastify';
import PostController from '../../../controllers/postController';

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLID },
  }),
});

export const postQuery = {
  type: PostType,
  args: { id: { type: GraphQLID } },
  resolve: async (
    source: any,
    args: { id: string },
    context: FastifyInstance
  ) => {
    return new PostController(context).getPostById(args.id);
  },
};
export const postsQuery = {
  type: new GraphQLList(PostType),
  resolve: async (source: any, args: undefined, context: FastifyInstance) => {
    return new PostController(context).getAllPosts();
  },
};
