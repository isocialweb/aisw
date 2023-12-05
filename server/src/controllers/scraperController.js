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
      if (error.code === 'ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED') {
        // Manejo específico del error SSL
        return res.status(500).json({ error: 'Error de SSL, no se puede establecer conexión segura' });
     }
      return res.status(500).json({ error: 'Server error' });
    }
  }



  async function urlScraperTitle(req, res) {
    const { url } = req.body;
  
    if (!url) {
      return res.status(400).json({ error: 'Missing URL parameter' });
    }
  
    try {
      const data = await scraper(url);
      return res.status(200).json(data.title);
    } catch (error) {
      console.error(error);
      if (error.code === 'ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED') {
        // Manejo específico del error SSL
        return res.status(500).json({ error: 'Error de SSL, no se puede establecer conexión segura' });
     }
      return res.status(500).json({ error: 'Server error' });
    }
  }


module.exports ={ 
  urlScraper,
  urlScraperTitle
}  