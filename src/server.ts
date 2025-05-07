import express from 'express'
import cors from 'cors'
import eventRoutes from './routes/event'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', eventRoutes)

app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000')
})
