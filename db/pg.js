/* eslint-disable prettier/prettier */
// Tobe Removed
const fs = require('fs')
const { Client } = require('pg')

const dbConfig = {
  user: 'admin',
  password: 'VSnBJGwO847ygh4INfdLPZ6xqNCX0M',
  database: 'yugabyte',
  host: 'ap-south-1.46939d7d-b431-4cda-ab3f-9d58cbbe7ae6.aws.ybdb.io',
  port: '5433',
    ssl: {
    rejectUnauthorized: false,
    cert: fs.readFileSync('./root.cer').toString(),
  },
}
// postgresql://<DB USER>:<DB PASSWORD> 
// @ap-south-1.46939d7d-b431-4cda-ab3f-9d58cbbe7ae6.aws.ybdb.io:5433/ 
// yugabyte
const helper = {}
let client = null

/**
 *Create connection with postgresql DB and return object to access db
 *
 * @returns object
 */
helper.init = () =>
  new Promise((resolve, reject) => {
    // TODO
    console.log('test connect')
    client = new Client(dbConfig) // change here to pool on high no of connections
    try {
      console.log('connecting to the db')
      client.connect()
      console.log('connected to the db')
      resolve(client)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('failed to connect to client', error)
      reject(error)
    }
  })

// unhandle promise
helper.init()
/**
 *Get postgresql object to access db
 *
 * @returns object
 */
helper.client = () => client

module.exports = helper
