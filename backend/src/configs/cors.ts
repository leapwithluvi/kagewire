import cors from 'cors'

export const corsConfig = cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: process.env.CORS_ALLOWED_METHODS,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    exposedHeaders: ["Content-Length", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
    optionsSuccessStatus: 204,
})