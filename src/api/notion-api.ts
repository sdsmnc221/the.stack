import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    // Extract the query parameter 'query' from the request URL
    const query = request.query.query;

    // Ensure the 'query' parameter is provided
    if (!query) {
      return response.status(400).json({ error: "Query parameter is missing" });
    }

    // Construct the Notion API endpoint using the query parameter
    const notionApiBaseUrl = "https://api.notion.com";
    const endpoint = `/${query}`;

    // Make a request to the Notion API
    const fetchResponse = await fetch(`${notionApiBaseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: atob(request.headers.authorization),
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(request.body),
    });

    const data = await fetchResponse.json();

    // Return the data in the response
    return response.status(200).json({
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    return response.status(502).json({ error: "Bad Gateway" });
  }
}
