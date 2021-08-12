import { useState } from 'react'
import axios from 'axios'
import S3 from "react-aws-s3";

import './App.css'

async function postImage({ image, description }) {
  const formData = new FormData();
  formData.append("image", image)
  formData.append("description", description)

  const result = await axios.post('/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  return result.data
}


function App() {

  const [file, setFile] = useState()
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])



  const postImageFromClient = ({ image, description }) => {
    const config = {
      bucketName: process.env.REACT_APP_AWS_BUCKET_NAME,
      region: process.env.REACT_APP_AWS_BUCKET_REGION,
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY

    };
    console.log("file", image)
    let newFileName = image.name.replace(/\..+$/, "");
    console.log("newFileName", newFileName)
    const ReactS3Client = new S3(config);
    ReactS3Client.uploadFile(image, newFileName).then((data) => {
      if (data.status === 204) {
        console.log("success");
      } else {
        console.log("fail");
      }
    });
  }
  const submit = async event => {
    event.preventDefault()
    //const result = await postImage({image: file, description})
    const result = postImageFromClient({ image: file, description })
  }

  const fileSelected = event => {
    event.preventDefault();
    const file = event.target.files[0]
    setFile(file)
  }

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image,.pdf,.csv"></input>
        <input value={description} onChange={e => setDescription(e.target.value)} type="text"></input>
        <button type="submit">Submit</button>
      </form>

      {images.map(image => (
        <div key={image}>
          <img src={image}></img>
        </div>
      ))}


    </div>
  );
}

export default App;
