const colors = require('colors');
const fs = require('fs');
const path = require('path');
const logsFile = path.join(__dirname, '../logs.txt');

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function chat(req, res) {
  console.time("chat");
  console.log(colors.bgGreen("Inicio petición a OpenAI"));
  const { prompt, functionName } = req.body;
  console.log("request Body:", req.body)

  
  
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({response: response.data.choices[0].message.content});

    const currentDate = new Date().toISOString();
   
    const logLine = `\n${currentDate} - ${functionName} -  Total Fetch: /${req.body.fetchIndex}: ${[response.data.choices[0].message.content]}\n | Total Tokens: ${response.data.usage.total_tokens}\n`;

    fs.appendFile(logsFile, logLine, (err) => {
      if (err) console.error('Error writing to logs:', err);
    });

    console.timeEnd("chat");
    console.log(response.data);
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}



async function chat4(req, res) {
  console.time("chat");
  console.log(colors.bgGreen("Inicio petición a OpenAI"));
  const { prompt, functionName } = req.body;
  console.log("request Body:", req.body)

  
  
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({response: response.data.choices[0].message.content});

    const currentDate = new Date().toISOString();
   
    const logLine = `\n${currentDate} - ${functionName} -  Total Fetch: /${req.body.fetchIndex}: ${[response.data.choices[0].message.content]}\n | Total Tokens: ${response.data.usage.total_tokens}\n`;

    fs.appendFile(logsFile, logLine, (err) => {
      if (err) console.error('Error writing to logs:', err);
    });

    console.timeEnd("chat");
    console.log(response.data);
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

module.exports = {
  chat,
  chat4
};
