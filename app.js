const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// import routes
const stateRoutes = require('./api/routes/state');
const cityRoutes = require('./api/routes/city');
const subscriberRoutes = require('./api/routes/subscriber');
const mainCategoryRoutes = require('./api/routes/maincategory');
const subCategoryRoutes = require('./api/routes/subcategory');

// db connection  
mongoose.connect("mongodb+srv://developer:developer@cluster0-itjaq.mongodb.net/healthcare?retryWrites=true&w=majority", { useUnifiedTopology: true }).then(() => console.log("DB server connect"))
    .catch(e => console.log("DB error", e));
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
// app.use(bodyParser.urlencoded({ extended: false ,limit:1024*1024*20}));
// app.use(bodyParser.json());

app.use(bodyParser.json({
    limit: '50mb'
  }));
  
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
  }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//here is all the routes
app.use('/states', stateRoutes);
app.use('/city', cityRoutes);
app.use('/maincategory', mainCategoryRoutes);
app.use('/subCategory', subCategoryRoutes);
app.use('/',(req,res,next)=>{
    res.status(200).json({
        message:"Hello"
    });
});

app.use((req, res, next) => {

    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;