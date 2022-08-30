const express = require('express');
const RegistrationNumbers = require('./registration-fact');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const pgp = require("pg-promise")();
const flash = require('express-flash')
const session = require('express-session')
const app = express();


const DATABASE_URL = process.env.DATABASE_URL || "postgresql://maker:kv123@localhost:5432/my_registration";

const config = {
    connectionString: DATABASE_URL
}


const db = pgp(config);

const registrationNumbers = RegistrationNumbers(db);


if (process.env.NODE_ENV == 'production') {
    config.ssl = {
        rejectUnauthorized: false
    }
}

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

app.get('/', async function (req, res) {
    let result = await registrationNumbers.getRegNums()
    // console.log(result + "gghggggggg")
    res.render('index', {
        regNumber: result
    });
})

app.post('/add', async function (req, res) {
    let results = req.body.plateNumber
    if (results == '') {
        req.flash('error', "Please insert a plate number below!")
    } else if (results !== '') {
        await registrationNumbers.setRegNums(
            req.body.plateNumber
        )
        req.flash('error', "Plate number already exists!")
    }


    res.redirect('/')
})

app.get('/delete', async function (req, res) {
    req.flash('error', "You have deleted all registration numbers")
    await registrationNumbers.deleteAllNumbers()
    //  if (dlt== true){
    //  }
    res.redirect('/')
});


const PORT = process.env.PORT || 2016;

app.listen(PORT, function () {
    console.log('App started at port:')
})