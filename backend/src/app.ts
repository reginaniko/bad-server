import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import path from 'path'
import { DB_ADDRESS, PORT, ORIGIN_ALLOW } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'
import rateLimit from './middlewares/rate-limit'
import { doubleCsrfProtection } from './middlewares/csrf-handler'

const app = express()

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(cookieParser())
app.use(rateLimit)

app.use(cors({ origin: ORIGIN_ALLOW, credentials: true }));
app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true }))
// app.use(doubleCsrfProtection)
app.use(json())

app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
