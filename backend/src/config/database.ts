import mongoose from 'mongoose'

let isConnected = false

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    return
  }

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker'

    const conn = await mongoose.connect(mongoURI)

    isConnected = !!conn.connections[0].readyState
    console.log(`MongoDB Connected: ${conn.connection.host}`)

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
      isConnected = false
    })

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
      isConnected = false
    })

  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}

export default connectDB


