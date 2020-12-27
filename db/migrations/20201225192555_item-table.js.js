const Knex = require('knex');

const {
  addDefaultColumns,
  createNameTable,
  createReference,
  url,
  email,
} = require('../../src/lib/tableUtils');

const tableNames = require('../../src/constants/tableNames');

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  await knex.schema.table(tableNames.state, (table) => {
    table.string('code');
    createReference(table, tableNames.country);
  });

  await knex.schema.table(tableNames.country, (table) => {
    table.string('code');
  });

  await knex.schema.createTable(tableNames.size, (table) => {
    table.increments();
    table.string('name').notNullable();
    table.float('length');
    table.float('width');
    table.float('height');
    table.float('volume');
    createReference(table, tableNames.shape);
    addDefaultColumns(table);
  });

  await knex.schema.createTable(tableNames.item, (table) => {
    table.increments();
    createReference(table, tableNames.user);
    table.string('name');
    createReference(table, tableNames.item_type);
    table.text('description');
    createReference(table, tableNames.company);
    createReference(table, tableNames.size);
    table.string('sku', 42);
    table.boolean('spark_joy').defaultTo(true);
    addDefaultColumns(table);
  });

  await knex.schema.createTable(tableNames.item_info, (table) => {
    table.increments();
    createReference(table, tableNames.item);
    createReference(table, tableNames.user);
    table.dateTime('purchase_date').notNullable();
    table.dateTime('expiration_date');
    createReference(table, tableNames.company, false, 'retailer');
    table.dateTime('last_used');
    table.float('purchase_price').notNullable().defaultTo(0);
    table.float('msrp').notNullable().defaultTo(0);
    createReference(table, tableNames.inventory_location);
    addDefaultColumns(table);
  });

  await knex.schema.createTable(tableNames.item_image, (table) => {
    table.increments();
    createReference(table, tableNames.item);
    addDefaultColumns(table);
    url(table, 'image_url');
  });

  await knex.schema.createTable(tableNames.related_item, (table) => {
    table.increments();
    createReference(table, tableNames.item);
    createReference(table, tableNames.item, false, 'related_item_id');
  });
};

/**
 * @param {Knex} knex
 */

exports.down = async (knex) => {
  [
    tableNames.size,
    tableNames.item,
    tableNames.item_info,
    tableNames.item_image,
    tableNames.related_item,
  ].reverse()
    .map((name) => knex.schema.dropTableIfExists(name));
};
