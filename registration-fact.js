module.exports = function RegistrationNumbers(db) {

    var outputs = {};
   regex= /^A-Z{2}\d{6}/

    async function setRegNums(registrationNum) {
        var townTag = registrationNum.slice(0, 2)
        let output= await db.manyOrNone('SELECT platenumber FROM registration Where platenumber= $1', [registrationNum])
        //   console.log(output.length + '  gggggggggg')

        let results=  await db.oneOrNone('SELECT id from my_town where town_code = $1', [townTag])
        if(output.length===0){

            await db.none('INSERT INTO registration (platenumber,town_id) VALUES($1, $2)', [registrationNum, results.id])
        }
      
        }

        const checkDuplicate = async number => {
            let output= await db.manyOrNone('SELECT platenumber FROM registration Where platenumber= $1', [number])
            return output.length === 1 ? true : false 
        }

    async function getRegNums() {
        let output = await db.manyOrNone('SELECT platenumber FROM registration')
        console.log(output)
        return output;
    }

    async function deleteAllNumbers() {
        await db.none('DELETE FROM registration')
        // console.log(outputss)
        // return outputs;
    }

    async function capeTownReg() {
        await db.one('SELECT FROM my_town WHERE platenumber LIKE "CA%" ')
        return "Cape Town";
    }


    async function stellenboschReg() {
        await db.one('SELECT FROM my_town WHERE platenumber LIKE "CJ%" ')
        return "Stellenbosch";
    }

    async function paarlReg() {
        await db.one('SELECT FROM my_town WHERE platenumber LIKE "CL%" ')
        return "Paarl";
    }

    async function belvilleReg() {
        await db.one('SELECT FROM my_town WHERE platenumber LIKE "CY%" ')
        return "Belville";
    }

    return {
        setRegNums,
        getRegNums,
        deleteAllNumbers,
        capeTownReg,
        stellenboschReg,
        paarlReg,
        belvilleReg,
        checkDuplicate
    }
}
