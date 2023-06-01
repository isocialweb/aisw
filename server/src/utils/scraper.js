const cheerio = require('cheerio');


async function scraper(url) {
  try {

  const response = await fetch(url,{ timeout: 5000 });
  const html = await response.text();
  const $ = cheerio.load(html);
  const bodyArticle = $('article').text()
  function removeTags(text) {
    return text.replace(/<[^>]*>/g, '').replace(/[\r\n]+/g, ' ').trim();
  }

  const regexDomain = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/;
  const domain = url.match(regexDomain)[1];

  const maxWords = 200;
  const bodyArticleWords= bodyArticle.split(" ")
  const limitWords = bodyArticleWords.slice(0,maxWords)
  const bodySumedUp = limitWords.join(' ')
  const regex = /[\n\t]+|\s{2,}/g
  
  const body = removeTags(bodySumedUp.replace(regex, ""));
  
  const H1 = $('h1').text().replace(regex,"");
  const H2  = [];
  $('h2').each((index,element)=>{
    H2.push($(element).text().replace(regex,""))
  })

  const H3 = []
  $('h3').each((index,element)=>{
    H3.push($(element).text().replace(regex,""))
  })

  const title = $('head > title').text()
  const description = $('meta[name="description"]').attr('content');

  const altTexts= []
  $('img').each(function () {
    const alt = $(this).attr('alt');
    if (alt) {
      altTexts.push(alt);
    }
  });

  const results ={
    H1,
    H2,
    H3,
    title,
    description,
    body,
    domain
    // altTexts
  }




  
  return(results)



  
}catch (error) {
  console.error(error);
  return {}; // 
}
}






module.exports = scraper;

