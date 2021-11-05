const PORT = process.env.PORT || 4224
const express = require('express')
const cors = require('cors')
const findDecay = require('./scraper')

const app = express()
app.use(express.json())
app.use(cors())

app.get('/api/rad', async (request, response) => {
    let a = request.query.a
    let z = request.query.z
    if (!z) {
        return response.status(400).send({Error: "Missing required parameter: z (atomic number)"})
    }
    let alphaDecay = await findDecay(z,a)
    response.json(alphaDecay)
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ Error: 'unknown endpoint' })
  }
app.use(unknownEndpoint)

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})