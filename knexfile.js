// Update with your config settings.
const path = require('path')

module.exports = {

  development: {
    client: 'postgresql',
    connection: 'https://localhost:5432/news_dev',
    migrations: {
      directory: path.join(__dirname, 'db', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'db', 'seeds')
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL
  }

}
