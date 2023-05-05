const axios = require('axios');
require('dotenv').config()
const fs = require('fs')
const api_key = process.env.VALUE_SERP
const colors = require('colors')

const scraper_ppaa = async (query, depth = 0, maxDepth = 3, limit=8 ) => {
    
  
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
      const array= 

      array.push(...map_results);
      
  
      for (let i = 0; i < map_results.length; i++) {
        const result = map_results[i];
  
        await scraper_ppaa(result, array, depth + 1, maxDepth, limit);
      }
  
      return array;
    } catch (error) {
      console.log(error);
    }
  };
  
  const run_scraper_ppaa = async (query, maxDepth = 3, limit) => {
    const results = await scraper_ppaa(query, [], 0, maxDepth, limit);
    return results;
  };
  
  (async () => {
    const urls=[]
    const query = "Cultivar semillas feminizadas";
    const ppaa_limit= 6
    const organic_results = 50
    
      const ppaa_results = await run_scraper_ppaa(query, 2, ppaa_limit);
      console.log(`Resultados: ${ppaa_results.length}`)
      console.log(ppaa_limit)
      if(ppaa_results.length > ppaa_limit || ppaa_results.length == ppaa_limit ){
        console.log('PPAA scraping terminado');
        console.log(ppaa_results)
        for (const element of ppaa_results) {
          const newUrls = await scraper_organic_urls(element, organic_results)
          urls.push(...newUrls)
          console.log(`Organic scraping para ${element} terminado`);
             
          }
      }
      
  
  
      const uniqueUrls = [...new Set(urls)]
      try {
       console.log(uniqueUrls)
             } catch (error) {
        console.error('Error al guardar el archivo:', error);
      }
  


    }

   

   
  )();

