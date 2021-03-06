import { cloudinary } from '../../cloudinary';

// Hier kun je de api config wijzigen zoals de upload size limiet.
export const config = { api: { bodyParser: { sizeLimit: '25mb' } } };

export default async function handler(req, res) {
  //GET REQUEST
  if (req.method === 'GET') {
    //! Krijg een array met alle bestanden in de meegegeven map (TEST vervangen door map naam 4)
    const { resources } = await cloudinary.search.expression('folder:test').sort_by('public_id', 'desc').max_results(30).execute();
    console.log(resources);
    const urls = resources.map((file) => file.secure_url);
    res.json(urls);
  }

  // POST REQUEST
  else if (req.method === 'POST') {
    try {
      const file = req.body.data;
      const uploadResponse = await cloudinary.uploader.upload(file, {
        //! de naam die je gekozen hebt bij maken van een preset check VIDEO
        upload_preset: 'HIERJEUPLOADPRESET',
      });

      res.json({ secure_url: uploadResponse.secure_url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ err: 'Something went wrong' });
    }
  }

  // CATCH OTHER REQUESTS
  else {
    res.status(405).json({ err: 'Method not allowed' });
  }
}
