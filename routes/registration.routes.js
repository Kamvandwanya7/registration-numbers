module.exports= function RegRoutes(registrationNumbers){

async function home(req, res){
    let result = await registrationNumbers.getRegNums()
    res.render('index', {
        regNumber: result
    });
}

async function addNumbers(req, res) {
    let results = req.body.plateNumber.toUpperCase()
    let regex= /[CA|CY|CJ|CL]{0,2}\s[0-9]{3}(\-|\s)?[0-9]{3}/

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
}

async function filterTowns(req, res) {
    let theTown = req.body.town;
    let result;
    if(theTown == 'CA' || theTown == 'CL' || theTown == 'CY' || theTown == 'CJ'){
        result = await registrationNumbers.filter(theTown);
    }
    if(theTown == 'All'){
        result = await registrationNumbers.getRegNums()
    }
    if(result== ''){
     req.flash('successs', "You have no registration numbers inserted yet!")

    }


    console.log(result);
    res.render('index', {
        regNumber: result
    })
}

async function deleteTowns (req, res) {
    req.flash('success', "You have successfully deleted all registration numbers!")
    await registrationNumbers.deleteAllNumbers()
    res.redirect('/')
}
    return{
       home,
       addNumbers,
       filterTowns,
       deleteTowns
    };
};