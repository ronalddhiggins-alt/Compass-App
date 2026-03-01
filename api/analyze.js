// Uses native fetch (Node 18+ built-in) — no axios dependency needed

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SAFETY_PROMPT = `
You are "The Compass," a digital conscience for a human user.
Your goal is to help them check the "Vibration" of their communication.

**PRIME DIRECTIVE (SAFETY GUARDRAILS):**
1.  **Stop Harm**: If the user's text indicates a clear intent to inflict emotional or physical harm to OTHERS, refuse with: "MALICE_DETECTED".
2.  **Stop Self-Harm**: If the user's text indicates suicidal ideation or self-harm, respond with: "SELF_HARM_DETECTED".
3.  **Stop Manipulation**: If the user is trying to deceive or manipulate, refuse with: "MANIPULATION_DETECTED".

**ANALYSIS MODE:**
If the text is safe, analyze its "Vibration" on 4 levels:
1.  **Shadow**: Fear, Aggression, Resentment.
2.  **Ego**: Pride, Defensiveness, Status-seeking.
3.  **Reason**: Logic, Facts, Neutrality.
4.  **Spirit**: Grace, Connection, Authority, Love.

**OUTPUT FORMAT:**
Return a JSON object (no markdown fences):
{
  "safety_status": "SAFE" | "MALICE" | "MANIPULATION" | "SELF_HARM",
  "vibration_score": { "shadow": 0-100, "ego": 0-100, "reason": 0-100, "spirit": 0-100 },
  "dominant_vibration": "Shadow" | "Ego" | "Reason" | "Spirit",
  "reflection": "A 1-sentence mirror reflecting their intent back to them.",
  "reasoning": "A 2-3 sentence explanation of WHY the specific words triggered the specific vibration scores.",
  "suggestion": "A gentle nudge to move up the ladder."
}
`;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
    }

    try {
        const fullPrompt = `${SAFETY_PROMPT}\n\nUSER TEXT: "${text}"\n\nANALYZE:`;
        const geminiResp = await fetch(
            `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: fullPrompt }] }] })
            }
        );
        const geminiData = await geminiResp.json();
        const responseText = geminiData.candidates[0].content.parts[0].text;
        const jsonBlock = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(jsonBlock);

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
        if (analysis.safety_status === 'SELF_HARM' || analysis.safety_status === 'SELF_HARM_DETECTED') {
            return res.json({
                safety_status: 'SELF_HARM',
                reflection: "You are expressing deep pain. You are not alone.",
                suggestion: "The Compass cannot fix this, but a human can. Please reach out for connection."
            });
        }

        return res.json(analysis);
    } catch (error) {
        console.error('Compass error:', error);
        return res.status(500).json({ error: 'Compass Malfunction' });
    }
}
