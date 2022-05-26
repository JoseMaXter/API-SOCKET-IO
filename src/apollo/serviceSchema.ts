import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Gasto {
    nombre: String
    precio: Int
  }

  enum Mes {
    enero
    febrero
    marzo
    abril
    junio
  }

  type typeReporte {
    mes: Mes
    gastos: [Gasto]
  }

  input InputGasto {
    nombre: String
    precio: Int
  }

  type Mutation {
    uploadFiles(file: Upload!): File!
  }

  type Query {
    uploads: [File]
    getReportes: [Gasto]
  }

  type Mutation {
    createGasto(data: InputGasto): Gasto
  }
`
