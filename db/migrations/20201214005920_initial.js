const Knex = require('knex');

const tableNames = require('../../src/constants/tableNames');

function addDefaultColumns(table) {
  table.timestamps(false, true);
  table.datetime('deleted_at');
}

function createNameTable(knex, tableName) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments().notNullable();
    table.string('name').notNullable().unique();
    addDefaultColumns(table);
  });
}

function createReference(table, foreignTableName) {
	table
	.integer(`${foreignTableName}_id`)
	.unsigned()
	.references('id')
	.inTable(foreignTableName)
	.onDelete('cascade');
}

function url(table, columnName) {
  table.string(columnName, 2000);
}

function email(table, columnName) {
  return table.string(columnName, 254);
}

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
    knex.schema.createTable(tableNames.location, (table) => {
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
    createReference(table, tableNames.state);
    createReference(table, tableNames.country);
  });

  await knex.schema.createTable(tableNames.manufacturer, (table) => {
    table.increments().notNullable();
    table.string('name').notNullable();
    url(table, 'logo_url');
    table.string('description', 1000);
    url(table, 'website_url');
    email(table, 'email');
		createReference(table, tableNames.address);
		// `address_id` int,
  });
};

exports.down = async (knex) => {
  // await knex.schema.dropTable(tableNames.user);
  await Promise.all([
		tableNames.manufacturer,
    tableNames.address,	// delete reference tables before other table
    tableNames.user,
    tableNames.item_type,
    tableNames.state,
    tableNames.country,
    tableNames.shape,
    tableNames.location,
  ].map((tableName) => knex.schema.dropTable(tableName)));
};
