const puppeteer = require('puppeteer');
const { clearQuery, codeSearchQuery, navigateToQuery } = require('../utils/ownPpaaScraperNotExpand');

const getResult = async (req, res) => {
  const { key, times = 15, country } = req.body;

  try {
    if (!key) {
      return res.status(400).json({ error: 'La clave no fue proporcionada' });
    }

    const rawQuery = key;
    const query = clearQuery(rawQuery);
    const lowerQuery = codeSearchQuery(rawQuery);
    const timesToExpand = Math.round(times * 0.6);

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    try {
      const results = await navigateToQuery(page, query, lowerQuery, timesToExpand,  country);
      await browser.close();
      const data = results.map((ppaa) => ({ keyword: key, ppaa }));
      return res.status(200).json({ data });
    } catch (error) {
      console.error('No se ha encontrado PPAA:', error);
      await browser.close();
      return res.status(200).json({ data: [] });
    }
  } catch (error) {
    console.error('Error en el endpoint:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  getResult
};


