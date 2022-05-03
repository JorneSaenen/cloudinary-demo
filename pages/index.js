/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { useState } from 'react';

const Home = () => {
  const [imgData, setImgData] = useState(null);
  const [response, setResponse] = useState(null);

  const selectImage = (e) => {
    const reader = new FileReader();

    // selecteer de eerste file in de array
    reader.readAsDataURL(e.target.files[0]);

    // Wanneer de file geladen is, zetten we de result (BASE64) in de state
    reader.onload = () => {
      setImgData(reader.result);
    };
  };

  const uploadImage = async (e) => {
    e.preventDefault();

    // POST BASE64 naar de API
    const { data } = await axios.post('/api/imageUpload', { data: imgData });

    // Zet de url van de response in de state
    setResponse(data.secure_url);

    // Maak de geselecteerde state leeg om dubbele uploads te voorkomen
    setImgData(null);
  };

  return (
    <div className='wrapper'>
      <form onSubmit={uploadImage}>
        <input type='file' name='upload' id='upload' accept='image/png, image/jpeg, image/jpg' onChange={selectImage} />
        <button>Upload</button>
      </form>
      <div className='images'>
        {imgData && (
          <div>
            <p>Geselecteerde foto</p>
            <img src={imgData} alt='selectedFile' />
          </div>
        )}
        {response && (
          <div>
            <p>Vorige upload</p>
            <img src={response} alt='Uploaded File' />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
