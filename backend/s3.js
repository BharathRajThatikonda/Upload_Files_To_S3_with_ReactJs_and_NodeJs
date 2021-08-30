require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
function uploadFile(file,fileType) {
  const fileStream = fs.createReadStream(file.path)
  //fs.createReadStream(req.files.test.path,'utf8');

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.originalname
  }

  return s3.upload(uploadParams).promise()
}

function getFiles(){
  const params = {
    Bucket: bucketName
  }

  // const data = s3.listObjects().then()
  return s3.listObjects(params, function (err, data) {
    if(err)throw err;
    const bucketName = data.Name
    const fileName = []
    data.Contents.map(file => {
      fileName.push({fileName:file.Key,LastModified:file.LastModified,Size:file.Size})
    })
    console.log({files:fileName,bucketName});
    return {files:fileName,bucketName}
   });
  
}
getFiles()
exports.getFiles = getFiles

exports.uploadFile = uploadFile


// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams).createReadStream()
}
exports.getFileStream = getFileStream