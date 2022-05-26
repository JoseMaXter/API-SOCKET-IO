import { makeExecutableSchema } from 'graphql-tools'
import { typeDefs } from './serviceSchema'
import { resolvers } from './resolver'

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})
