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

    async function filter(){
        let results=  await db.oneOrNone('SELECT id from my_town where town_code = $1', [townTag])
        if(results.length===0){

            await db.none('INSERT INTO registration (platenumber,town_id) VALUES($1, $2)', [registrationNum, results.id])
        }
    }

    async function deleteAllNumbers() {
        await db.none('DELETE FROM registration')
        // console.log(outputss)
        // return outputs;
    }


    return {
        setRegNums,
        getRegNums,
        deleteAllNumbers,
        checkDuplicate,
        filter,
    }
}
