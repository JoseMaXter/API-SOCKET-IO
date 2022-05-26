import { Schema, model } from 'mongoose'

export interface IGasto {
  nombre: String
  precio: number
}

const Gasto = new Schema({
  nombre: {
    type: String
  },
  precio: {
    type: Number
  }
})

export default model<IGasto>('gastoModel', Gasto)
