require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using 2.5-flash as established by Narrative Auditor
// Using 2.5-flash as established by Narrative Auditor
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Load Workbook Prompts
const WORKBOOK_PROMPTS = require('./prompts');
const WIKI_DATA = require('./wikiData');

// THE SAFETY CORE (The Prime Directive)
const SAFETY_PROMPT = `
You are "The Compass," a digital conscience for a human user.
Your goal is to help them check the "Vibration" of their communication.

**PRIME DIRECTIVE (SAFETY GUARDRAILS):**
1.  **Stop Harm**: If the user's text indicates a clear intent to inflict emotional or physical harm to OTHERS, do NOT help them improve it. Instead, refuse with: "MALICE_DETECTED".
2.  **Stop Self-Harm**: If the user's text indicates suicidal ideation or self-harm, do NOT analyze vibrations. Instead, intervene with: "SELF_HARM_DETECTED".
3.  **Stop Manipulation**: If the user is trying to deceive or manipulate, refuse with: "MANIPULATION_DETECTED".

**ANALYSIS MODE:**
If the text is safe, analyze its "Vibration" on 4 levels:
1.  **Shadow**: Fear, Aggression, Resentment.
2.  **Ego**: Pride, Defensiveness, Status-seeking.
3.  **Reason**: Logic, Facts, Neutrality.
4.  **Spirit**: Grace, Connection, Authority, Love.

**OUTPUT FORMAT:**
Return a JSON object:
{
  "safety_status": "SAFE" | "MALICE" | "MANIPULATION" | "SELF_HARM",
  "vibration_score": { "shadow": 0-100, "ego": 0-100, "reason": 0-100, "spirit": 0-100 },
  "dominant_vibration": "Shadow" | "Ego" | "Reason" | "Spirit",
  "reflection": "A 1-sentence mirror reflecting their intent back to them (e.g., 'You are writing from a place of defense').",
  "reasoning": "A 2-3 sentence explanation of WHY the specific words triggered the specific vibration scores.",
  "suggestion": "A gentle nudge to move up the ladder (e.g., 'Try stating your need directly instead of blaming')."
}
`;

app.post('/api/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: 'Text required' });

        console.log("Analyzing text:", text.substring(0, 50) + "...");

        const result = await model.generateContent([
            SAFETY_PROMPT,
            `USER TEXT: "${text}"\n\nANALYZE:`
        ]);

        const responseText = result.response.text();
        console.log("Gemini Raw Response:", responseText);

        // Parse JSON from Gemini response (handle potential markdown blocks)
        let analysis;
        try {
            const jsonBlock = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            analysis = JSON.parse(jsonBlock);
        } catch (e) {
            console.error("Failed to parse JSON", e);
            // Fallback if JSON fails but text is generated
            return res.status(500).json({ error: 'AI Response Error' });
        }

        // Enforce Guardrails in Response
        if (analysis.safety_status === 'MALICE') {
            return res.json({
                safety_status: 'MALICE',
                reflection: "This intent appears designed to harm. The Compass cannot assist in sharpening this weapon.",
                suggestion: "Please pause. Do you want to send Pain, or Resolution?"
            });
        }

        if (analysis.safety_status === 'MANIPULATION') {
            return res.json({
                safety_status: 'MANIPULATION',
                reflection: "This intent appears deceptive. Integrity is the only optimization allowed.",
                suggestion: "Try speaking the truth without the mask."
            });
        }

        // Handle both possible AI outputs for self-harm
        if (analysis.safety_status === 'SELF_HARM' || analysis.safety_status === 'SELF_HARM_DETECTED') {
            return res.json({
                safety_status: 'SELF_HARM',
                reflection: "You are expressing deep pain. You are not alone.",
                suggestion: "The Compass cannot fix this, but a human can. Please reach out for connection."
            });
        }

        res.json(analysis);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Compass Malfunction' });
    }
});

// Daily Prompt Endpoint
app.get('/api/daily-prompt', (req, res) => {
    // Pick a random prompt
    const randomIndex = Math.floor(Math.random() * WORKBOOK_PROMPTS.length);
    res.json(WORKBOOK_PROMPTS[randomIndex]);
});

// WIKI SEARCH ENDPOINT
app.get('/api/wiki', (req, res) => {
    const { q } = req.query;
    if (!q) return res.json(WIKI_DATA); // Return all if no query

    const lowerQ = q.toLowerCase();
    const results = WIKI_DATA.filter(item =>
        item.term.toLowerCase().includes(lowerQ) ||
        item.definition.toLowerCase().includes(lowerQ) ||
        item.tags.some(tag => tag.includes(lowerQ))
    );
    res.json(results);
});

app.listen(PORT, () => {
    console.log(`Compass Server running on http://localhost:${PORT}`);
    console.log(`Safety Core: ACTIVE`);
});
