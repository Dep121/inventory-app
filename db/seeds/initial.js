const crypto = require('crypto');
const bcrypt = require('bcrypt');
const orderedTableNames = require('../../src/constants/orderedTableNames');
const tableNames = require('../../src/constants/tableNames');
const Knex = require('knex');


/**
 * @param {Knex} knex
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries

  await orderedTableNames
    .reduce(async (promise, table_name) => {
      await promise;
      console.log('Clearing', table_name);
      return knex(table_name).del();
    });

  // Inserts seed entries

  const password = crypto.randomBytes(15).toString('hex');
  const user = {
    email: 'dep@null.computer',
    name: 'dep',
    password: bcrypt.hash(password, 12),
  }

  const [createdUser] = await knex(tableNames.user)
    .insert(user)
    .returning('*');

  console.log('User created:', {
    password,
  }, createdUser);

  await knex(tableNames.country)
    .insert([{
      name: 'IN',
    }, {
      name: 'US',
    }, {
      name: 'NO',
    }, {
      name: 'BE',
    }, {
      name: 'RO',
    }, {
      name: 'DE',
    }, {
      name: 'UK',
    },]);

  await knex(tableNames.state)
    .insert([{
      name: 'Delhi',
    }]);
};

// node -e "console.log(require('crypto').randomBytes(30).toString('hex'))"