const puppeteer = require('puppeteer')
const PORT = process.env.PORT || 4224
const express = require('express')
const cors = require('cors')

app.get('/', async (request, response) => {
    let a = request.query.a
    let z = request.query.z
    if (!z) {
        return response.status(400).send({Error: "Missing required parameter: z (Atomic number)"})
    }
    let alphaDecay = await findDecay(z,a)
    response.json(alphaDecay)
})

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})