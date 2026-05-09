const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const personaDetails = {
  truck_driver: {
    name: "Long-Haul Truck Driver",
    pain: "Raat ko highway pe akela rehta hai, 20+ raatein ghar se door",
    language: "Hindi with Haryanvi touch",
    hook: "Raat ke 2 baj rahe hain, sadak pe akele",
  },
  it_worker: {
    name: "IT/Bank Worker in Metro City",
    pain: "Ghar se door, office ke baad akela flat mein rehta hai",
    language: "Hinglish",
    hook: "Office ke baad ghar aao, koi nahi milta",
  },
  social_learner: {
    name: "Social Learner",
    pain: "Ladkiyon se baat karna nahi aata, confidence nahi hai",
    language: "Simple Hindi",
    hook: "Baat karni hai par samajh nahi aata kaise",
  },
};

async function callGroq(apiKey, systemPrompt, userPrompt) {
  const res = await fetch(GROQ_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "API Error");
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

async function generateAll() {
  const apiKey = document.getElementById("apiKey").value.trim();
  const personaKey = document.getElementById("persona").value;
  const persona = personaDetails[personaKey];

  if (!apiKey) {
    alert("Bhai pehle Groq API key daalo!");
    return;
  }

  const btn = document.getElementById("generateBtn");
  btn.disabled = true;
  btn.textContent = "Generate ho raha hai...";

  // --- Generate Script ---
  document.getElementById("scriptLoader").style.display = "block";
  document.getElementById("scriptOutput").textContent = "";

  const scriptSystem = `Tu ek expert Hindi ad copywriter hai jo Dostii app ke liye kaam karta hai.
Dostii ek app hai jahan akele log female friends se baat kar sakte hain.
Hamesha simple, emotional, aur relatable Hindi likhta hai.
Koi complicated words nahi - jaise aam aadmi bolta hai waisa likhna hai.`;

  const scriptUser = `Write a 35-second video ad script for Dostii app.

Persona: ${persona.name}
Pain Point: ${persona.pain}
Language: ${persona.language}
Hook idea: ${persona.hook}

Format:
SCENE 1 - HOOK (0:00-0:05): [visual description] + [voiceover]
SCENE 2 - PAIN (0:05-0:15): [visual description] + [voiceover]
SCENE 3 - DOSTII MOMENT (0:15-0:28): [visual description] + [voiceover]
SCENE 4 - CTA (0:28-0:35): [visual description] + [voiceover + text on screen]

Voiceover Hindi mein likhna. Emotional rakho.`;

  try {
    const script = await callGroq(apiKey, scriptSystem, scriptUser);
    document.getElementById("scriptOutput").textContent = script;
  } catch (e) {
    document.getElementById("scriptOutput").textContent = "Error: " + e.message;
  }

  document.getElementById("scriptLoader").style.display = "none";

  // --- Generate Prompts ---
  document.getElementById("promptLoader").style.display = "block";
  document.getElementById("promptOutput").textContent = "";

  const promptSystem = `Tu ek AI video prompt expert hai.
Tujhe Pika Labs aur ElevenLabs ke liye English prompts likhne hain.
Prompts detailed, cinematic, aur visually descriptive hone chahiye.
Indian settings use karna - dhaba, highway, truck cab etc.`;

  const promptUser = `Generate 4 video prompts for Pika Labs for a Dostii app ad targeting: ${persona.name}

Scene 1 (Hook): Night highway, lonely driver
Scene 2 (Pain): At dhaba, failed calls/messages
Scene 3 (Dostii Moment): Driver smiling while using app
Scene 4 (CTA): App logo, download screen

Also write:
- ElevenLabs voiceover text (Hindi, 35 seconds)
- Suno AI music prompt (background music)

Format clearly with headers for each.`;

  try {
    const prompts = await callGroq(apiKey, promptSystem, promptUser);
    document.getElementById("promptOutput").textContent = prompts;
  } catch (e) {
    document.getElementById("promptOutput").textContent = "Error: " + e.message;
  }

  document.getElementById("promptLoader").style.display = "none";

  btn.disabled = false;
  btn.textContent = "✨ Generate Script + Prompts";
}
