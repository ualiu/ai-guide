// server.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Endpoint to analyze page content
app.post("/analyzePage", async (req, res) => {
  const { title, description, bodyText } = req.body.pageContent;
  const contentToAnalyze = `${title}\n\n${description}\n\n${bodyText}`;

  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-sonnet-20240229",
        max_tokens: 300,
        temperature: 0,
        messages: [
          {
            role: "user",
            content: `You are tasked with analyzing the content of the following page.
            Your goal is to understand the contents of the page and provide a simple and concise overview that helps the reader quickly understand the essentials.
            Think of the reader as someone who does not want to read the entire page but wants to know the basics of what the website offers. So be very brief and keep it on point.

            Focus on:
            1. The main offer or value proposition.
            2. The key benefits or features highlighted on the page & summarize them in a single paragraph instead of bullet points.
            3. Use simple words to describe and summarize the page.
            ${contentToAnalyze}`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
      }
    );

    const analysis = response.data.content[0].text;
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
  const { prompt, context } = req.body;

  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-sonnet-20240229",
        max_tokens: 500,
        temperature: 0,
        messages: [
          {
            role: "user",
            content: `Given the following context about the current webpage and website:
            ${JSON.stringify(context)}
            
            Please provide step-by-step instructions for the following request:
            ${prompt}`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
      }
    );

    const instructions = response.data.content[0].text
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

app.post("/analyzeWebsite", async (req, res) => {
  const { url } = req.body;

  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        temperature: 0,
        messages: [
          {
            role: "user",
            content: `Analyze the following website URL and provide a summary of the site's main sections and functionality:

            ${url}

            Focus on identifying:
            1. The main sections of the website
            2. Key functionality (e.g., login, registration, search)
            3. The general purpose of the website`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
      }
    );

    const analysis = response.data.content[0].text;
    res.json({ analysis });
  } catch (error) {
    console.error(
      "Error analyzing website:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error analyzing website" });
  }
});

app.post("/analyzeUserProgress", async (req, res) => {
  const { userActions, currentUrl, pageContent } = req.body;

  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-sonnet-20240229",
        max_tokens: 500,
        temperature: 0,
        messages: [
          {
            role: "user",
            content: `Analyze the user's actions and current page state to determine if they need assistance.
            User actions: ${JSON.stringify(userActions)}
            Current URL: ${currentUrl}
            Page content: ${JSON.stringify(pageContent)}

            Determine if the user needs assistance based on their actions and the current page state.
            If assistance is needed, provide a brief, helpful message.
            
            Response format:
            {
              "needsAssistance": boolean,
              "assistanceMessage": string (only if needsAssistance is true)
            }`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
      }
    );

    const analysisResult = JSON.parse(response.data.content[0].text);
    res.json(analysisResult);
  } catch (error) {
    console.error(
      "Error analyzing user progress:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error analyzing user progress" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
