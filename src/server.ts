import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes'
import organizerRoutes from './routes/organizerRoutes'
import eventRoutes from './routes/eventRoutes'

dotenv.config()
const app = express()

app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/organizer', organizerRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})

app.use('/api/events', eventRoutes)
