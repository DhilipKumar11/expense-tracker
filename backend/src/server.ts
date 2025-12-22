import app from './app'
import { connectDB } from './config/database'
import { config } from './config/env'

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDB()

    // Start server
    const server = app.listen(config.port, () => {
      console.log(`
🚀 Server running in ${config.nodeEnv} mode
📡 Port: ${config.port}
🌐 CORS Origin: ${config.corsOrigin}
📊 Database: Connected
      `)
    })

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: Error, promise) => {
      console.log(`Error: ${err.message}`)
      // Close server & exit process
      server.close(() => {
        process.exit(1)
      })
    })

    // Handle uncaught exceptions
    process.on('uncaughtException', (err: Error) => {
      console.log(`Error: ${err.message}`)
      console.log('Shutting down the server due to Uncaught Exception')
      process.exit(1)
    })

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully')
      server.close(() => {
        console.log('Process terminated')
      })
    })

  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()


