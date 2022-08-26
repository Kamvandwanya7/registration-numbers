const express= require('express');
const RegistrationNumbers= require('./registration-fact');
const registrationNumbers= RegistrationNumbers();
const bodyParser= require('body-parser');
const exphbs  = require('express-handlebars');
const pgp = require("pg-promise")();
const app= express();

// const db = pgp(config);

const DATABASE_URL= process.env.DATABASE_URL || "postgresql://localhost:5432/my_registration";

const config = { 
	connectionString : DATABASE_URL
}

if (process.env.NODE_ENV == 'production') {
	config.ssl = { 
		rejectUnauthorized : false
	}
}

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res){
    res.render('index', {
        regNumbers: registrationNumbers.getRegNums()
    });
})

app.post('/add', function(req, res){
    registrationNumbers.setRegNums({
        plateNumber: req.body.plateNumber,
    })
    res.redirect('/')
})

// console.log(registrationNumbers.getRegNums)


const PORT= process.env.PORT || 2016;

app.listen(PORT, function(){
    console.log('App started at port:')
})