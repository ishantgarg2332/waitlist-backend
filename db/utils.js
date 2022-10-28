const DB = require('./pg')

const Client = DB.client()

function Query(query) {
  console.log('query here',query)
  return new Promise((resolve, reject) => {
    Client.query(query)
      .then((response) => {
        console.log('response',response)
        resolve(response)
      })
      .catch((error) => {
        console.log('query error',error)
        reject(error)
      })
  })
} // TODO better error messages

module.exports = { Query }
