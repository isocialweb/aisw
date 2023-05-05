const scraper = require('../utils/scraper')


async function urlScraper(req, res) {
    const { url } = req.body;
  
    if (!url) {
      return res.status(400).json({ error: 'Missing URL parameter' });
    }
  
    try {
      const data = await scraper(url);
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }


module.exports ={ 
  urlScraper
}  