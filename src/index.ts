import express, { Application } from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { typeDefs } from './apollo/serviceSchema'
import { resolvers } from './apollo/resolver'
import { graphqlUploadExpress } from 'graphql-upload'
import { connectDB } from './db'
const notifications = []
//Cors
const corsOptions = {
  origin: true,
  credentials: true
}
// Server express
export const app: Application = express()
// Middleware de archivos o imagenes
app.use(
  graphqlUploadExpress({
    maxFieldSize: 10000000, // 10 MB
    maxFiles: 20
  })
)
// Server IO
const server = createServer(app)

const listenApollo = async () => {
  // Server graphql
  const serverGraphql = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer: server })]
  })
  // Iniciando sevidor graphql
  await serverGraphql.start()

  serverGraphql.applyMiddleware({ app, cors: corsOptions, path: '/graphql' })
  // Corriendo el servidor http
  server.listen(5000, () => {
    console.log('Server on port http://localhost:5000/graphql')
  })
}

const main = async () => {
  await listenApollo()
  await connectDB()

  const io = new Server(server, {
    cors: corsOptions
  })

  io.on('connection', socket => {
    console.log(`Cliente conectado: ${socket.id}`)

    socket.on('notification', notification => {
      notifications.push(notification)
      io.emit('notification', notifications)
    })

    socket.on('joinUser', () => {
      io.emit('notification', notifications)
    })

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`)
    })
  })
}

main()
