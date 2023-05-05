const colors = require('colors')

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration)



async function chat(req,res) {
    console.time("chat")
    console.log(colors.bgGreen("Inicio petición a OpenAI"));
    const {prompt} = req.body

    try{const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
    });
    res.status(200).json({response: response.data.choices[0].message.content})
    console.timeEnd("chat")
    // console.log("OpenAI response:", response.data.choices[0].message.content);
    console.log(response.data)
}catch(error){
    res.status(500).json({error: error.message})

    }
          
}

module.exports ={
    chat
}