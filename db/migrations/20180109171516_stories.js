
exports.up = function(knex, Promise) {
    return knex.schema.createTable('stories', table => {
        table.increments()
        table.string('headline').notNullable()
        table.text('content').notNullable()
        table.string('author').defaultTo('Anonymous')
    })
};

exports.down = function(knex, Promise) {
    return knex.droptable('stories')
};
