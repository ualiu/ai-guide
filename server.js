const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use your OpenAI API key from the .env file or directly here
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Endpoint to analyze page content
app.post("/analyzePage", async (req, res) => {
  const { title, description, bodyText } = req.body.pageContent;
  const contentToAnalyze = `${title}\n\n${description}\n\n${bodyText}`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: ` You are tasked with analyzing the content of the following page. 
        Your goal is to provide a simple and concise overview that helps the reader quickly understand the essentials. 
        Think of the reader as someone who does not want to read the entire page but wants to know the basics and why they should continue reading.
        
        Focus on:
        1. The main offer or value proposition.
        2. The key benefits or features highlighted on the page.
        3. A brief summary that convinces the reader to continue reading.

        Page content to analyze:

        Page content to analyze:
        ${contentToAnalyze}`,
        },
      ],
      presence_penalty: 0,
      frequency_penalty: 0.3,
      max_tokens: 300,
      temperature: 0,
    });

    const analysis = response.data.choices[0].message.content;
    res.json({ analysis });
  } catch (error) {
    console.error(
      "Error fetching AI response:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error fetching AI response" });
  }
});

app.post("/instructions", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      presence_penalty: 0,
      frequency_penalty: 0.3,
      max_tokens: 300,
      temperature: 0,
    });

    const instructions = response.data.choices[0].message.content
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => line.trim());
    res.json({ instructions });
  } catch (error) {
    console.error(
      "Error fetching AI response:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error fetching AI response" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
