/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { useState } from 'react';
import ProgressBar from '@ramonak/react-progress-bar';

const Home = () => {
  const [imgData, setImgData] = useState(null);
  const [response, setResponse] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

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
    setUploading(true);
    // opties voor de upload met progress bar
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded}kb of ${total}kb | ${percent}%`);

        if (percent < 100) {
          setUploadPercentage(percent);
        }
      },
    };

    // POST BASE64 naar de API
    const { data } = await axios.post('/api/imageUpload', { data: imgData }, options);

    // Zet de url van de response in de state
    setResponse(data.secure_url);

    // Maak de geselecteerde state leeg om dubbele uploads te voorkomen
    setImgData(null);
    setUploading(false);
    setTimeout(() => {
      setUploadPercentage(0);
    }, 1000);
  };

  return (
    <div className='wrapper'>
      <form onSubmit={uploadImage}>
        <input type='file' name='upload' id='upload' accept='image/png, image/jpeg, image/jpg' onChange={selectImage} disabled={uploading} />
        <button disabled={uploading}>Upload</button>
      </form>
      <div>{uploadPercentage !== 0 && <ProgressBar completed={uploadPercentage} width='80%' margin='0 auto' />}</div>
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
