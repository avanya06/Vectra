import { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL,
});

export const generateRules = async (req: Request, res: Response) => {
  try {
    const { intent, links } = req.body;

    if (!intent || !links || !Array.isArray(links)) {
      return res.status(400).json({ error: 'Invalid input. "intent" (string) and "links" (array) are required.' });
    }

    const systemPrompt = `
You are building an AI Intent Assistant inside a MERN-based Smart Link Hub product called Vectra.

GOAL:
Convert a user’s natural-language intent into structured, rule-based configuration
that will later be executed by an existing backend rule engine.

IMPORTANT CONSTRAINTS:
- The AI must NOT make runtime decisions.
- The AI must NOT rank or display links directly.
- The AI only translates human intent into structured routing rules.
- Final link prioritization is handled strictly by the backend rule engine.

SYSTEM CONTEXT:
The platform allows users to manage multiple links (portfolio, freelance profiles,
socials, documents, etc.) under one public smart URL.

Each link supports rule-based prioritization using the following fields:

Allowed rule fields ONLY:
- time        → ["09-18", "18-06"]
- device      → ["mobile", "desktop"]
- country     → ["IN", "US", "GLOBAL"]
- boost       → integer from 0 to 50
- autoPromote → boolean

No additional fields are allowed.

DATA MODEL PER LINK:
{
  "linkId": string,
  "rules": {
    "time"?: string[],
    "device"?: string[],
    "country"?: string[],
    "boost"?: number,
    "autoPromote"?: boolean
  }
}

AI TASK:
Given:
1. A list of user links with IDs and titles
2. A natural language description of user intent

You must return:
- Valid JSON only
- No explanation text
- No markdown
- No comments
- No assumptions outside the provided intent
- Rules that reflect intent conservatively (never aggressive)

OUTPUT FORMAT:
{
  "links": [
    {
      "linkId": "string",
      "rules": {
        ...
      }
    }
  ]
}

BEHAVIOR GUIDELINES:
- Never hide links unless the user explicitly says so.
- Prefer prioritization (boost) instead of exclusion.
- Use moderate boosts by default (10–30).
- Use high boost (40–50) only if user strongly emphasizes priority.
- If intent is vague, apply minimal rules.
- If unsure, do not invent conditions.

EXAMPLES:

User intent:
"Show my portfolio mostly to recruiters during working hours on desktop.
At night prioritize Instagram and WhatsApp for mobile users."

Expected output:
{
  "links": [
    {
      "linkId": "portfolio",
      "rules": {
        "time": ["09-18"],
        "device": ["desktop"],
        "boost": 30
      }
    },
    {
      "linkId": "instagram",
      "rules": {
        "time": ["18-06"],
        "device": ["mobile"],
        "boost": 20
      }
    },
    {
      "linkId": "whatsapp",
      "rules": {
        "device": ["mobile"],
        "boost": 25
      }
    }
  ]
}

If the user intent does not mention a link, do not modify that link.
`;

    const userMessage = `
User Links:
${JSON.stringify(links, null, 2)}

User Intent:
"${intent}"
`;

    const completion = await openai.chat.completions.create({
      model: "nvidia/nemotron-3-nano-30b-a3b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.2,
      top_p: 1,
      max_tokens: 1024,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from AI');
    }

    let jsonStr = content;
    if (content.includes('```json')) {
      jsonStr = content.split('```json')[1].split('```')[0];
    } else if (content.includes('```')) {
      jsonStr = content.split('```')[1].split('```')[0];
    }

    const result = JSON.parse(jsonStr.trim());
    res.json(result);

  } catch (error: any) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ error: error.message || 'Error generating rules' });
  }
};
