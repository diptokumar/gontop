const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const fileupload = require('express-fileupload'); 

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/UserRoute/userRoutes');
const gameRouter = require('./routes/GameRoutes/gameRoute');
const categoryRouter = require('./routes/GameRoutes/categoryRoute');
const productRouter = require('./routes/GameRoutes/productRoute');
const adsRouter = require('./routes/AdsRoutes/adsRoutes');
const announcementRouter = require('./routes/AnnouncementRoutes/announcementRoutes');

const notificationRouter = require('./routes/NotificationRoutes/notificationRoute');
const sellerProductRouter = require('./routes/AssignSellerProductRoute/sellerProductRoutes');
const supplyRouter = require('./routes/SupplyRoutes/supplyRoute');
const chatRouter = require('./routes/ChateRoutes/chatRoutes');
const friendRouter = require('./routes/FriendsRoutes/friendsRoute');
const walletRouter = require('./routes/WalletRoutes/walletRoute');
const orderRouter = require('./routes/OrderRoutes/orderRoute');






const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const healthcheck = require('./routes/healtcheckRouter');
const app = express();

// 1) GLOBAL MIDDLEWARES
app.use(cors());
app.options('*', cors());
// Set security HTTP headers
app.use(helmet());

// Development logging
// if (process.env.NODE_ENV === 'development') {
  
// }
app.use(morgan('dev'));
// Limit requests from same API

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '50MB' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(fileupload({useTempFiles: true}))

// Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsQuantity',
//       'ratingsAverage',
//       'maxGroupSize',
//       'difficulty',
//       'price'
//     ]
//   })
// );

// Serving static files
// app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use('/', healthcheck);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/games', gameRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/ads', adsRouter);
app.use('/api/v1/announcement', announcementRouter);

app.use('/api/v1/notification', notificationRouter);
app.use('/api/v1/seller-product', sellerProductRouter);
app.use('/api/v1/supply-router', supplyRouter);
app.use('/api/v1/chat-router', chatRouter);
app.use('/api/v1/friend-router', friendRouter);
app.use('/api/v1/wallet-router', walletRouter);
app.use('/api/v1/order-router', orderRouter);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
