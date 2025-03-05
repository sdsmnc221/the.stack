// @ts-nocheck
const fetch = require("node-fetch");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

module.exports = async function handler(request, response) {
  try {
    // Construct the Notion API endpoint using the query parameter
    const notionApiBaseUrl = "https://api.notion.com";
    const endpoint = `v1/databases/${process.env.VITE_NOTION_DATABASE_STACK}/query`;

    // Make a request to the Notion API
    const fetchResponse = await fetch(`${notionApiBaseUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.authorization,
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(request.body),
    });

    const data = await fetchResponse.json(); // Fixed: use .json() method to parse response

    // Return the data in the response
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error:", error);
    return response.status(502).json({ error: "Bad Gateway" });
  }
};
