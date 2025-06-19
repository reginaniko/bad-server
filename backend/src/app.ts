import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import csurf from 'csurf'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'
import { ORIGIN_ALLOW } from './config'

const { PORT = 3000 } = process.env
const app = express()

app.use(cookieParser())

app.use(cors())
app.use(cors({ 
    origin: ORIGIN_ALLOW, 
    credentials: true,
}));
// app.use(express.static(path.join(__dirname, 'public')));

//app.use(serveStatic(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.use(urlencoded({ extended: true }))
app.use(json())

const csrfProtection = csurf({
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    },
})
app.use(csrfProtection)
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() })
})

app.options('*', cors())
app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error('Failed to start server:', error)
    }
}

bootstrap()
