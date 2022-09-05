module.exports = function RegistrationNumbers(db) {

    var outputs = {};


    async function setRegNums(registrationNum) {
        var townTag = registrationNum.slice(0, 2)
        let output = await db.manyOrNone('SELECT platenumber FROM registration Where platenumber= $1', [registrationNum])
        //   console.log(output.length + '  gggggggggg')

        let results = await db.oneOrNone('SELECT id from my_town where town_code = $1', [townTag])
        if (output.length === 0) {

            await db.none('INSERT INTO registration (platenumber,town_id) VALUES($1, $2)', [registrationNum, results.id])
        }

    }
    //  console.log
    const checkDuplicate = async number => {
        let output = await db.manyOrNone('SELECT platenumber FROM registration Where platenumber= $1', [number])
        return output.length ===  1 ? true : false
    }

    async function getRegNums() {
        let output = await db.manyOrNone('SELECT platenumber FROM registration')
        return output;
    }


    async function deleteAllNumbers() {
        await db.none('DELETE FROM registration')
    }

    function regex() {
        regex.test(registrationNum)
    }


    async function filter(theTown) {
        let selectId = await db.any('select id from my_town where town_code = $1', [theTown]);

        let results = await db.manyOrNone('SELECT platenumber FROM registration WHERE town_id = $1', [selectId[0].id]);

        return results;
    }

    return {
        setRegNums,
        getRegNums,
        deleteAllNumbers,
        checkDuplicate,
        filter,
        regex,
    }
}
