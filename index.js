
const RegistrationNumbers = require('./registration-fact');
const RegRoutes= require('./routes/registration.routes')
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const pgp = require("pg-promise")();
const flash = require('express-flash')
const session = require('express-session')
const express = require('express');
const app = express();


const DATABASE_URL = process.env.DATABASE_URL || "postgresql://maker:kv123@localhost:5432/my_registration";

const config = {
    connectionString: DATABASE_URL
}

if (process.env.NODE_ENV == 'production') {
    config.ssl = {
        rejectUnauthorized: false
    }
}
const db = pgp(config);

const registrationNumbers = RegistrationNumbers(db);
const registrationRoutes= RegRoutes(registrationNumbers)
app.use(flash());

app.use(session({
    secret: 'this is my longest string that is used to test my registration with routes app for browser',
    resave: false,
    saveUninitialized: true
}));


app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', registrationRoutes.home)

app.post('/add', registrationRoutes.addNumbers) 


app.post('/filter',registrationRoutes.filterTowns);

app.get('/delete', registrationRoutes.deleteTowns);



const PORT = process.env.PORT || 2016;

app.listen(PORT, function () {
    console.log('App started at port:')
})