import { connect, Error } from 'mongoose'

export const connectDB = async () => {
  await connect('mongodb://localhost:27017', {})
    .then(() => console.log('Database is connect'))
    .catch((error: Error) => console.log(error.message))
}
