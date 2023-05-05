const  {Configuration, OpenAIApi}  = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  
  async function text(req,res){
    const {prompt} = req.body
  
     
 try{ 
  const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: prompt,
  max_tokens: 500,
  temperature: 0,
});

res.status(200).json({ response: response.data.choices[0].text});
   } catch(error){
    res.status(500).json({ error: error.message });
  }
  
}




module.exports ={
  text
}