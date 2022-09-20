const assert = require("assert");
const RegistrationNumbers = require('../registration-fact');

const pgp = require("pg-promise")();

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:codex123@localhost:5432/reg_tests";

const config = {
    connectionString: DATABASE_URL
};

const db = pgp(config);


describe('My database tests', async function () {
    this.beforeEach(async function () {
        await db.none('DELETE FROM registration')
    });
    it('It should be able to count 3 registration numbers entered on database', async function () {
        let registNumber = RegistrationNumbers(db);
        await registNumber.setRegNums("CA 234 542");
        await registNumber.setRegNums("CL 234 222");
        await registNumber.setRegNums("CY 665 111");

        assert.deepEqual([{ platenumber: 'CA 234 542' }, { platenumber: 'CL 234 222' }, { platenumber: 'CY 665 111' }], await registNumber.getRegNums());
    });

    it('It should be able to return one registration number if a registration number is a duplicate in database', async function () {
        let registNumber = RegistrationNumbers(db);
        await registNumber.setRegNums("CA 234 542");
        await registNumber.setRegNums("CA 234 542");
        await registNumber.setRegNums("CA 234 542");

        assert.deepEqual([{
            platenumber: 'CA 234 542'
        }]
            , await registNumber.getRegNums());
    });


    it('It should be able to filter registration numbers for Cape Town only', async function () {
        let registNumber = RegistrationNumbers(db);
        await registNumber.filter("CA")
        await registNumber.setRegNums('CA 231 111');
        await registNumber.setRegNums("CA 234 542")

        assert.deepEqual([{ "platenumber": "CA 231 111" }, { "platenumber": "CA 234 542" }],  await registNumber.getRegNums({ "platenumber": "CA 231 111" }, { "platenumber": "CA 234 542" }));
    });


    it('It should be able to filter registration numbers for Stellenbosch only', async function () {
        let registNumber = RegistrationNumbers(db);
        await registNumber.filter("CY")
        await registNumber.setRegNums('CY 231 111');

        assert.deepEqual([{ "platenumber": "CY 231 111" }],  await registNumber.getRegNums({ "platenumber": "CY 231 111" }));
    });

    it('It should be able to clear registration numbers entered', async function () {
        let registNumber = RegistrationNumbers(db);
        await registNumber.setRegNums("CA 234 542")
        await registNumber.setRegNums("CL 234 542")
        await registNumber.setRegNums("CY 234 542")

        assert.equal(null, await registNumber.deleteAllNumbers());
    });

    it('It should be able to return list of registration numbers', async function () {
        let registNumber = RegistrationNumbers(db);
        await registNumber.setRegNums("CY 234 542")
        await registNumber.setRegNums("CL 234 542")
        await registNumber.setRegNums("CA 234 542")
        assert.deepEqual([{ "platenumber": "CY 234 542" }, { "platenumber": "CL 234 542" }, { "platenumber": "CA 234 542" }], await registNumber.getRegNums([{ "regNum": "CY 234 542" }, { "regNum": "CL 234 542" }, { "regNum": "CL 234 542" }]));
    });

 
});

