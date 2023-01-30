import { FastifyInstance } from 'fastify';
import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql/type';
import { PostType } from '../graphql-queries/postQueries';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';
import PostController from '../../../controllers/postController';

export const addPostMutation = {
  type: PostType,
  args: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (
    source: any,
    args: Omit<PostEntity, 'id'>,
    context: FastifyInstance
  ) => {
    return new PostController(context).createNewPost(args);
  },
};

export const updatePostMutation = {
  type: PostType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
  resolve: async (
    source: any,
    args: Omit<PostEntity, 'userId'>,
    context: FastifyInstance
  ) => {
    return new PostController(context).updatePost(args.id, {
      title: args.title,
      content: args.content,
    });
  },
};
