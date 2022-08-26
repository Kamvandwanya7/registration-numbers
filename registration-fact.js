module.exports= function RegistrationNumbers (db){

var regEntered= [];


async function setRegNums(registrationNum){
    let results= await db.manyOrOne('INSERT INTO registration (platenumber) VALUES($1)', [registrationNum, 1])
    return results;   
 }                                   

//  let results = await db.one('SELECT platenumber FROM registration')
//  if (results.count == 0) {
//      await db.none('INSERT INTO registration (platenumber) VALUES($1)', [registrationNum, 1])
//   }


function getRegNums(){
    return regEntered;
}

function registration(){
    if(registrationNum && town){
    setRegNums(registrationNum)
}
}
function delftReg(){
   if (registrationNum.startsWith("CA")){
    return "Cape Town";
   }
}

function stellenboschReg(){
    if(registrationNum.startsWith("CJ")){
      return "Stellenbosch"
    }
}
return{
    setRegNums,
    getRegNums,
    registration,
    delftReg,
    stellenboschReg
}
}