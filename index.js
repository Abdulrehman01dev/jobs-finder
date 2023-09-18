
require('dotenv').config();
require('express-async-errors');


const express = require('express');
const app = express();

const notFoundMiddleware = require('./middlewares/notFound');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const accountRouter = require('./routes/account');
const jobsRouter = require('./routes/job');
const connectDB = require('./db/connect');
const authMiddleware = require('./middlewares/authentication');

const { rateLimit } = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');

/// Set limit on api for each user
app.set('trust proxy', 1)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})


app.use(express.json());
app.use('/assets', express.static('assets'));

app.use(helmet())
app.use(limiter);
app.use(cors({origin: '*', credentials:true,optionSuccessStatus:200}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next(); // Important
});
app.use(xss())


/// Routes
app.use('/api/v1/auth', accountRouter)
app.use('/api/v1/jobs', authMiddleware, jobsRouter)

app.get('/', (req, res) =>{
    res.send('<h1>Jobs Api Documentation</h1>'); 
})


/// Middlewares

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
    try { 
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => console.log(`Server is listening on port : ${port}`))
    } catch (error) {
        console.log(error);
    }
}

start();
