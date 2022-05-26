import fs, { unlink, createWriteStream } from 'fs'
import { Stream } from 'stream'
import path from 'path'
import { v4 as UUID } from 'uuid'
import GraphQLUpload from 'graphql-upload'
import schedule from 'node-schedule'
import GastoModel, { IGasto } from '../models/Gasto'

interface File {
  filename: string
  mimetype: string
  encoding: string
  createReadStream: () => Stream
}

const folder = {
  png: 'images',
  pdf: 'pdf',
  jpeg: 'images'
}

const mimetypes = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/x-icon': 'ico',
  'image/svg+xml': 'svg',
  'application/msword': 'doc',
  'application/pdf': 'pdf'
}

export const resolvers = {
  Upload: GraphQLUpload,

  Mutation: {
    uploadFiles: async (_: any, { file }: { file: File }) => {
      const { createReadStream, filename, mimetype, encoding } = await file

      const stream = createReadStream()

      const upload = async () => {
        return new Promise((resolve, reject) => {
          const path = `public/img/${filename}`
          console.log({ path })

          const out = createWriteStream(path)

          stream.on('error', error => out.destroy(error))
          stream.pipe(out)

          console.log('Todo bien')

          out.on('finish', () => resolve({ path, filename, mimetype }))
          out.on('error', error => {
            unlink(path, () => {
              reject(error)
            })
          })
        })
      }
      await upload()
      return 'Probando upload'
    },
    createGasto: async (_: any, { data }: { data: IGasto }, ctx: any) => {
      const gasto = new GastoModel(data)
      await gasto.save()
      return gasto
    }
  },
  Query: {
    getReportes: async () => {
      const gastos = await GastoModel.find().sort({ _id: -1 }).limit(1)
      return gastos
    }
  }
}

// const rule = new schedule.RecurrenceRule()
// rule.hour = 14

// const job = schedule.scheduleJob(rule, () => {
//   console.log('Todo bien xD')
// })
