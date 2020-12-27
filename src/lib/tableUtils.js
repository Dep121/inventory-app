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

function createReference(table, foreignTableName, notNullable = true, columnName) {
  const definition = table
    .integer(`${columnName || foreignTableName}_id`)
    .unsigned()
    .references('id')
    .inTable(foreignTableName)
    .onDelete('cascade');

  if (notNullable) {
    definition.notNullable();
  }

  return definition;
}

function url(table, columnName) {
  table.string(columnName, 2000);
}

function email(table, columnName) {
  return table.string(columnName, 254);
}

module.exports = {
  addDefaultColumns,
  createNameTable,
  createReference,
  url,
  email,
};
