
const RegistrationNumbers = require('./registration-fact');
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
    let results = req.body.plateNumber.toUpperCase()
    let regex= /[A-Z]{0,2}\s[0-9]{3}(\-|\s)?[0-9]{3}/

    if (results == '') {
        req.flash('error', "Please insert a plate number below!")

    }
    else if(regex.test(results)== false){
        req.flash('error', "Registration number is not valid!")
    }
    else if (results !== '') {
        if (await registrationNumbers.checkDuplicate(results) === true) {
            req.flash('error', "Duplicate number!")
        }  else {
            await registrationNumbers.setRegNums(
                req.body.plateNumber
            )
            req.flash('success', "You successfully added a registration number!")
        }
    }
    res.redirect('/')
}) 


app.post('/filter', async function (req, res) {
    let theTown = req.body.town;
    let result;
    if(theTown == 'CA' || theTown == 'CL' || theTown == 'CY' || theTown == 'CJ'){
        result = await registrationNumbers.filter(theTown);
    }
    if(theTown == 'All'){
        result = await registrationNumbers.getRegNums()
    }
    if(result== ''){
     req.flash('success', "You have no registration numbers inserted yet!")

    }


    console.log(result);
    res.render('index', {
        regNumber: result
    })
});

app.get('/delete', async function (req, res) {
    // alert('You are about to delete all registration numbers!')
    req.flash('success', "You have successfully deleted all registration numbers!")
    await registrationNumbers.deleteAllNumbers()
    res.redirect('/')
});



const PORT = process.env.PORT || 2016;

app.listen(PORT, function () {
    console.log('App started at port:')
})