import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { corsConfig } from './config/cors'
import productRoutes from './routes/ProductRoutes'
import userRoutes from './routes/UserRoutes'
import entityRoutes from './routes/EntityRoutes'

dotenv.config()

const app = express()
// app.use(cors(corsConfig))

// Logging
app.use(morgan('dev'))
app.use(express.json())

// Routes
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/entities', entityRoutes)

export default app
