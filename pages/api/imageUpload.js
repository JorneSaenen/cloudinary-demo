import { cloudinary } from '../../cloudinary';

export default async function handler(req, res) {
  //GET REQUEST
  if (req.method === 'GET') {
    //! Krijg een array met alle bestanden in de meegegeven map
    const { resources } = await cloudinary.search.expression('folder:FOLDERNAAM-IN-DASHBOARD-NR4').sort_by('public_id', 'desc').max_results(30).execute();
    const publicIds = resources.map((file) => file.public_id);
    res.json(publicIds);
  }

  // POST REQUEST
  else if (req.method === 'POST') {
    try {
      const file = req.body.data;
      const uploadResponse = await cloudinary.uploader.upload(file, {
        //! de naam die je gekozen hebt bij maken van een preset check VIDEO
        upload_preset: 'timepunch',
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
