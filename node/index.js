const express = require('express')
const mysql = require('mysql')

const app = express()
const port = 3000

const dbConfig = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb',
}

const names = ['João', 'Maria', 'José', 'Arlindo', 'Matilda', 'Dolores', 'Sebastião', 'Marluce', 'Edna', 'Antonio']

app.get('/', (_req, res) => {
  executeReponse(res)
})

app.listen(port, () => {
  console.log(`Application running on Port...: ${port}`)
})

function getName() {
  const indexRandom = Math.floor(Math.random() * 10)
  return names[indexRandom]
}

function executeReponse(res) {
  const name = getName()
  const connection = mysql.createConnection(dbConfig)
  const insertQuery = `INSERT INTO people(name) values('${name}')`
  connection.query(insertQuery, (_error, _results, _fields) => {
    generateResponse(res, connection)
  })
}

function generateResponse(res, connection) {
  const selectQuery = `SELECT id, name FROM people`
  connection.query(selectQuery, (_error, results) => {
    const rows = results
        .map(person => `<tr><td>${person.id}</td><td>${person.name}</td></tr>`)
        .join('')
    const table = `<table><tr><th>#</th><th>Name</th></tr>${rows}</table>`
    res.send(`<h1>Full Cycle Rocks!</h1>${table}`)
    connection.end()
  })
}