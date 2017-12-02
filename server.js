const express = require('express')
const app = express()
const multer  = require('multer')
require('dotenv').config()
const upload = multer({ storage: multer.memoryStorage({}) })
const Clarifai = require('clarifai')

const clarifai = new Clarifai.App({
  apiKey: process.env.CLARIFAI
})

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/views/index.html')
})


const imageContains = function(clarifai, foodType, threshold) {
  const concepts = clarifai.outputs.data.concepts

  console.log(concepts)

  concepts.forEach(element => {
    if (element.name === foodType && element.value >= threshold) {
      return true
    }
  })

  return false
}


app.post('/submit', upload.single('food'), function(request, response) {
  
  const base64Image = request.file.buffer.toString('base64')

  //Clarifai process the image requestnpm install 
  clarifai.models.predict(Clarifai.FOOD_MODEL, {base64: base64Image}).then(
    function(res) {

      response.send({
        status: 'success',
        clarifai: res
      })
    },
    function(err) {
      response.send({status: 'error', message: err})
    }
  ).catch(function(err) {
    response.send({status: 'error', message: err})
  })

  
  
  
})



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
