const axios = require('axios');
require('dotenv').config()
const api_key = process.env.VALUE_SERP
const colors = require('colors')

async function valueSerp(req,res){
 
const {query} = req.body
 console.log(colors.bgGreen("Inicio Scraper Serps"))
    if (!query){
        return res.status(400).json({error:'Missing query parameter.' })
    }

    const params = {
        api_key:process.env.VALUE_SERP,
          q: query,
          location: "Spain",
          google_domain: "google.es",
          gl: "es",
          hl: "es",
          num: "5"
        }

// make the http GET request to VALUE SERP
axios.get('https://api.valueserp.com/search', { params })
.then(response => {

    // print the JSON response from VALUE SERP
    res.status(200).json(response.data);
    console.log(JSON.stringify(response.data, 0, 2));

  }).catch(error => {
// catch and print the error
console.log(error);
})


}

const scraper_news_domain = async (query, results) => {
  console.log(colors.bgGreen("Inicio Petición News"));
  const params = {
    api_key: api_key,
    search_type: "news",
    q: query,
    google_domain: "google.es",
    gl: "es",
    hl: "es",
    num: results,
  };

  try {
    const responsePromise = axios.get("https://api.valueserp.com/search", {
      params,
    });
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject("Timeout error"), 58000)
    );
    const response = await Promise.race([responsePromise, timeoutPromise]);

    const news_results = response.data.news_results;
    const map_news = news_results.map((result) => result.domain);
    console.log(colors.yellow(map_news));
    console.log(colors.bgGreen("Fin Petición News"));
    return map_news;
  } catch (error) {
    console.log(error);
    return [];
  }
};



const scraper_news = async (query, results) => {
  console.log(colors.bgGreen("Inicio Petición News"));
  const params = {
    api_key: api_key,
    search_type: "news",
    q: query,
    google_domain: "google.es",
    gl: "es",
    hl: "es",
    num: results,
  };

  try {
    const responsePromise = axios.get("https://api.valueserp.com/search", {
      params,
    });
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject("Timeout error"), 58000)
    );
    const response = await Promise.race([responsePromise, timeoutPromise]);

    const news_results = response.data.news_results;
    const regex = /^(https?:\/\/(?:www\.)?[^/]+)/;
    const map_news = news_results.map((result) => result.link.match(regex)[0])
    

    console.log(colors.yellow(map_news));
    console.log(colors.bgGreen("Fin Petición News"));
    return map_news;
  } catch (error) {
    console.log(error);
    return [];
  }
};




async function newsScraper(req, res) {
    const { query } = req.body;
  
    if (!query) {
      return res.status(400).json({ error: 'Missing Query parameter' });
    }
  
    try {
      const data = await scraper_news(query,35); 
      console.log(colors.yellow(data))
      console.log(colors.bgGreen("Fin Petición News"))
      return res.status(200).json(data);
    } catch (error) {
      console.error(colors.bgRed(error));
      return res.status(500).json({ error: 'Server error' });
    }
  }



  

  const scraper_organic_domains = async (query, results = 80) => {
    console.log(colors.bgGreen("Inicio Petición Organic Urls"))
      const params = {
          api_key: api_key,
          q: query,
          location: "Spain",
          gl: "es",
          hl: "es",
          num: results,
          output: "json"
      }
  
      try {
          const response = await axios.get('https://api.valueserp.com/search', { params });
          const organic_results = response.data.organic_results;

          
           const map_results = organic_results.map((result) => result.domain)

     
          return map_results;
      } catch (error) {
          console.log(error);
      }
  };

 
  
  const scraper_organic_urls = async (query, results = 80) => {
    console.log(colors.bgGreen("Inicio Petición Organic Urls"))
      const params = {
          api_key: api_key,
          q: query,
          location: "Spain",
          gl: "es",
          hl: "es",
          num: results,
          output: "json"
      }
  
      try {
          const response = await axios.get('https://api.valueserp.com/search', { params });
          const organic_results = response.data.organic_results;

          const regex = /^(https?:\/\/(?:www\.)?[^/]+)/;
           const map_results = organic_results.map((result) => result.link.match(regex)[0])

     
          return map_results;
      } catch (error) {
          console.log(error);
      }
  };
  
  async function urlsOrganicScraper(req, res) {
    if (req.method === 'POST') {
      const { query } = req.body;
      const newUrls = await scraper_organic_urls(query);
      console.log(colors.bgGreen("Fin Petición Organic Urls"))
      res.status(200).json(newUrls);
    } else {
      res.status(405).end(); // Método no permitido
    }
  }



  const scraper_ppaa = async(query,limit) =>{
    console.log(colors.bgGreen("Inicio Petición PPAA"))
    const params = {
      api_key: api_key,
      q: query,
      location: "Spain",
      gl: "es",
      hl: "es",
    };
  
    try {
            const response = await axios.get("https://api.valueserp.com/search", {
              params,
            });
            const related_questions = response.data.related_questions || [];
        
            const map_results = related_questions.map((result) => result.question);
            const array= []
      
            if (limit) {
              array.push(...map_results.slice(0, limit));
            } else {
              array.push(...map_results);
            }

            return array


} catch (error){
  console.log(error); 
}
}


 async function ppaaScraper(req, res) {
    if (req.method === 'POST') {
      const { query } = req.body;
      const ppaa_results = await scraper_ppaa(query,4);
      console.log(colors.yellow(ppaa_results))
      console.log(colors.bgGreen("Fin Petición PPAA"))
      res.status(200).json(ppaa_results);
    } else {
      res.status(405).end(); 
    }
  }


  module.exports={
    newsScraper,
    urlsOrganicScraper,
    ppaaScraper,
    valueSerp

  }