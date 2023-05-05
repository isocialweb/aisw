const axios = require('axios');
require('dotenv').config()
const fs = require('fs')
const api_key = process.env.VALUE_SERP
const colors = require('colors')



const scraper_news = async(query,results) =>{
  const params = {
  api_key: api_key,
  search_type: "news",
  q: query,
  google_domain: "google.es",
  gl: "es",
  hl: "es",
  num: results

}

const response = await axios.get('https://api.valueserp.com/search', { params });
const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject('Timeout error'), 58000));
if (response === 'Timeout error') {
    return [];
  }
const news_results = response.data.news_results
const map_news= news_results.map(result=>result.domain)
return map_news
}



// //TODO: intentar añadir como parámetros idioma y país.
// const scraper_ppaa = async (query, array, depth = 0, maxDepth = 3, limit ) => {
//     if (array.length >= limit || depth > maxDepth) {
//       return array;
//     }
  
//     const params = {
//       api_key: api_key,
//       q: query,
//       location: "Spain",
//       gl: "es",
//       hl: "es",
//     };
  
//     try {
//       const response = await axios.get("https://api.valueserp.com/search", {
//         params,
//       });
//       const related_questions = response.data.related_questions || [];
  
//       const map_results = related_questions.map((result) => result.question);
  
//       array.push(...map_results);
      
  
//       for (let i = 0; i < map_results.length; i++) {
//         const result = map_results[i];
  
//         await scraper_ppaa(result, array, depth + 1, maxDepth, limit);
//       }
  
//       return array;
//     } catch (error) {
//       console.log(error);
//     }
//   };
  
//   const run_scraper_ppaa = async (query, maxDepth = 3, limit) => {
//     const results = await scraper_ppaa(query, [], 0, maxDepth, limit);
//     return results;
//   };
  
//   (async () => {
//     console.time(colors.red("Llamada"))
//     const urls=[]
//     const seed_query = "Cultivar semillas feminizadas";
//     const ppaa_limit= 5
//     const news_result = await scraper_news(seed_query,35)
//     console.log(`News finalizado:`)
//     console.log(news_result)
  
//     const organic_results = 50

//     urls.push(...news_result)

//     if(news_result.length>0){
//       const ppaa_results = await run_scraper_ppaa(seed_query, 2, ppaa_limit);
//       console.log(`Resultados: ${ppaa_results.length}`)
//       console.log(ppaa_limit)
//       if(ppaa_results.length > ppaa_limit || ppaa_results.length == ppaa_limit ){
//         console.log('PPAA scraping terminado');
//         console.log(ppaa_results)
//         for (const element of ppaa_results) {
//           const newUrls = await scraper_organic_urls(element, organic_results)
//           urls.push(...newUrls)
//           console.log(`Organic scraping para ${element} terminado`);
             
//           }
//       }
      
  
  
//       const uniqueUrls = [...new Set(urls)]
//       try {
//         await fs.promises.writeFile(`${seed_query}.json`, JSON.stringify(uniqueUrls))
//         console.log(uniqueUrls)
//         console.log('Archivo guardado exitosamente');
//         console.timeEnd(colors.red("Llamada"))
//       } catch (error) {
//         console.error('Error al guardar el archivo:', error);
//       }
  


//     }

   

   
//   })();


  module.exports = {
    // run_scraper_ppaa,
    scraper_news,
  };