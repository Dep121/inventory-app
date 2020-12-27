const Knex = require('knex');

const tableNames = require('../../src/constants/tableNames');
const {
  addDefaultColumns,
  createNameTable,
  createReference,
  url,
  email,
} = require('../../src/lib/tableUtils');

/**
 * @param {Knex} knex
 */

exports.up = async (knex) => {
  await Promise.all([
    knex.schema.createTable(tableNames.user, (table) => {
      table.increments().notNullable();
      email(table, 'email').notNullable().unique();
      table.string('name').notNullable();
      table.string('password', 127).notNullable();
      table.datetime('last_login');
      addDefaultColumns(table);
    }),
    createNameTable(knex, tableNames.item_type),
    createNameTable(knex, tableNames.state),
    createNameTable(knex, tableNames.country),
    createNameTable(knex, tableNames.shape),
    knex.schema.createTable(tableNames.inventory_location, (table) => {
      table.increments().notNullable();
      table.string('name').notNullable().unique();
      table.string('description', 1000);
      url(table, 'image_url');
    }),
  ]);

  await knex.schema.createTable(tableNames.address, (table) => {
    table.increments().notNullable();
    table.string('street_address_1', 50).notNullable();
    table.string('street_address_2', 50);
    table.string('city', 50).notNullable();
    table.string('zipcode', 15).notNullable();
    table.float('latitude').notNullable();
    table.float('longitude').notNullable();
    createReference(table, tableNames.state, false);
    createReference(table, tableNames.country);
  });

  await knex.schema.createTable(tableNames.company, (table) => {
    table.increments().notNullable();
    table.string('name').notNullable();
    url(table, 'logo_url');
    table.string('description', 1000);
    url(table, 'website_url');
    email(table, 'email');
    createReference(table, tableNames.address);
  });
};

/**
 * @param {Knex} knex
 */

exports.down = async (knex) => {
  // await knex.schema.dropTable(tableNames.user);
  await Promise.all([
    tableNames.company,
    tableNames.address,	// delete reference tables before other table
    tableNames.user,
    tableNames.item_type,
    tableNames.state,
    tableNames.country,
    tableNames.shape,
    tableNames.inventory_location,
  ].map((tableName) => knex.schema.dropTableIfExists(tableName)));
};
