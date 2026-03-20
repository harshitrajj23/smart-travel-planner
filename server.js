const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { Mistral } = require("@mistralai/mistralai");
const { createClient } = require("@supabase/supabase-js");

const app = express();

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/generate-plan", async (req, res) => {
  try {
    console.log("Incoming request:", { destination, days, budget, mood });

    const { destination, days, budget, mood } = req.body;

    if (!destination || typeof destination !== "string" || destination.trim() === "") {
      return res.status(400).json({ error: "Destination must be a non-empty string." });
    }

    const parsedDays = Number(days);
    if (!parsedDays || isNaN(parsedDays) || parsedDays < 1 || parsedDays > 15) {
      return res.status(400).json({ error: "Days must be a number between 1 and 15." });
    }

    const validBudgets = ["low", "medium", "high"];
    if (!validBudgets.includes(budget)) {
      return res.status(400).json({ error: "Budget must be one of: low, medium, high." });
    }

    const validMoods = ["chill", "adventure", "romantic", "budget"];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ error: "Mood must be one of: chill, adventure, romantic, budget." });
    }

    const prompt = `
You are a travel planner AI.

Generate a travel plan for:
Destination: ${destination}
Days: ${days}
Budget: ${budget}
Mood: ${mood}

IMPORTANT:
- Return ONLY pure JSON
- Do NOT add explanation
- Do NOT add text before or after JSON
- Do NOT use markdown

STRICT FORMAT:
{
  "itinerary": [
    {
      "day": 1,
      "activities": ["activity 1", "activity 2"]
    }
  ],
  "estimatedCost": "...",
  "travelTips": ["tip 1", "tip 2"]
}
`;

    const aiPromise = client.chat.complete({
      model: "mistral-small",
      messages: [
        { role: "user", content: prompt }
      ],
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 10000)
    );

    const response = await Promise.race([aiPromise, timeoutPromise]);

    let text = response.choices[0].message.content;

// remove unwanted formatting if present
text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let data;

    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("JSON parse failed, raw output:", text);
      return res.status(500).json({
        error: "AI response not in JSON format",
        raw: text,
      });
    }

    if (data && Array.isArray(data.itinerary)) {
      data.itinerary.forEach((item) => {
        if (typeof item.activities === "string") {
          item.activities = item.activities
            .split(".")
            .map((act) => act.trim())
            .filter((act) => act.length > 0);
        }
      });
    }

    try {
      const { data: tripData, error: tripError } = await supabase
        .from("trips")
        .insert([
          {
            destination,
            days,
            budget,
            mood,
            estimated_cost: data.estimatedCost || ""
          }
        ])
        .select()
        .single();

      if (tripError) {
        console.error("Error inserting trip into Supabase:", tripError);
      } else if (tripData && tripData.id) {
        if (data.itinerary && Array.isArray(data.itinerary)) {
          const itineraryInserts = data.itinerary.map((day) => ({
            trip_id: tripData.id,
            day_number: day.day,
            activities: day.activities
          }));

          const { error: itineraryError } = await supabase
            .from("itinerary")
            .insert(itineraryInserts);

          if (itineraryError) {
            console.error("Error inserting itinerary into Supabase:", itineraryError);
          }
        }
      }
    } catch (dbErr) {
      console.error("Unexpected error saving to Supabase:", dbErr);
    }

    res.json({
      destination,
      days,
      budget,
      mood,
      ...data,
    });

  } catch (error) {
    if (error.message === "Request timeout") {
      return res.status(400).json({ error: "Request timeout" });
    }
    console.error("Mistral API Error:", error);
    res.status(500).json({ error: "Failed to generate travel plan" });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});