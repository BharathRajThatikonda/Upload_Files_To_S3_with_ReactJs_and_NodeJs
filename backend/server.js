const express = require('express')

const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
var db = require('mime-db')


const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const { uploadFile, getFileStream } = require('./s3')

const app = express()


app.get('/images/:key', (req, res) => {
  console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
})

app.post('/images', upload.single('image'), async (req, res) => {
  const file = req.file
  console.log(file)
  var type = db[file.mimetype]

  console.log("type",type)

  console.log("type=",type.extensions[0])

const fileType = type.extensions[0]
  // apply filter
  // resize 

  const result = await uploadFile(file,fileType)
  await unlinkFile(file.path)
  console.log(result)
  const description = req.body.description
  res.send({"res":description})
})

app.listen(8080, () => console.log("listening on port 8080"))