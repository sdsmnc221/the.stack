// @ts-nocheck
import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";
import dotenv from "dotenv";
import axios from "axios";

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
    const endpoint = `v1/databases/${process.env.VITE_NOTION_DATABASE_STACK}/query`;

    // Make a request to the Notion API
    const fetchResponse = await axios.get(`${notionApiBaseUrl}/${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VITE_NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        "Access-Control-Allow-Headers":
          "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
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
