/**
 * Chatbot Controller
 * Integrates Groq LLM (Llama 3.3 70B) for agricultural chat
 * and proxies disease detection to Flask microservice
 */

// Plant disease FAQ data (from CHATBOT/chat/plant_faq.csv)
const FAQ_DATA = [
  { disease: 'Pepper__bell__Bacterial_spot', advice: 'Remove infected leaves and stems immediately. Spray copper-based fungicide (e.g., Bordeaux mixture) every 7–10 days. Avoid overhead watering. Use drip irrigation and good spacing for air circulation. Apply neem oil as natural preventive.' },
  { disease: 'Pepper__bell__healthy', advice: 'Your pepper plant is healthy! Keep soil moist but not waterlogged, provide 6–8 hours sunlight, use balanced organic fertilizer (e.g., compost tea). Watch for early signs of pests like aphids.' },
  { disease: 'Potato___Early_blight', advice: 'Remove and destroy affected leaves. Spray copper oxychloride or Mancozeb fungicide. Improve air flow by proper spacing. Avoid watering leaves in evening. Rotate crops every 2–3 years.' },
  { disease: 'Potato___healthy', advice: 'Healthy potato crop! Maintain consistent moisture, hill up soil around stems, use organic mulch. Apply potassium-rich fertilizer for tuber growth.' },
  { disease: 'Potato___Late_blight', advice: 'This is serious – destroy heavily infected plants. Spray Ridomil Gold or Revus fungicide early. Avoid overhead watering. Use resistant varieties next season. Clear all crop debris.' },
  { disease: 'Tomato_Bacterial_spot', advice: 'Remove infected parts, disinfect tools. Spray copper hydroxide or streptomycin (if allowed). Avoid working when plants are wet. Use resistant varieties and crop rotation.' },
  { disease: 'Tomato_Early_blight', advice: 'Prune lower leaves, mulch soil, spray neem oil or copper fungicide. Improve ventilation. Rotate with non-tomato crops for 2–3 years.' },
  { disease: 'Tomato_healthy', advice: 'Your tomato plant looks good! Stake plants, water at base, apply compost/manure. Pinch suckers for better fruiting. Protect from heavy rain.' },
  { disease: 'Tomato_Late_blight', advice: 'Urgent action needed: remove and burn infected plants. Spray systemic + contact fungicide (e.g., Ridomil + Mancozeb). Avoid wet leaves. Use raised beds for better drainage.' },
  { disease: 'Tomato_Leaf_Mold', advice: 'Increase air circulation, reduce humidity in greenhouse. Spray sulfur-based fungicide or biofungicides. Remove lower leaves touching soil.' },
  { disease: 'Tomato_Septoria_leaf_spot', advice: 'Remove infected leaves, mulch around base. Spray chlorothalonil or copper fungicide. Avoid overhead watering. Rotate crops.' },
  { disease: 'Tomato_Spider_mites_Two_spotted_spider_mite', advice: 'Spray neem oil or insecticidal soap every 5–7 days. Increase humidity. Introduce predatory mites if possible. Avoid dry, dusty conditions.' },
  { disease: 'Tomato__Target_Spot', advice: 'Prune affected leaves, apply fungicide (chlorothalonil). Improve air flow, avoid wetting foliage. Use resistant varieties.' },
  { disease: 'Tomato__Tomato_mosaic_virus', advice: 'No cure – remove and destroy infected plants immediately. Disinfect tools with bleach. Control aphids (virus vector). Use certified virus-free seeds.' },
  { disease: 'Tomato__Tomato_YellowLeaf__Curl_Virus', advice: 'Control whiteflies (vector) with neem oil or yellow sticky traps. Remove infected plants. Use resistant varieties (e.g., TYLCV-resistant tomatoes). Avoid overlapping crops.' },
];

const SYSTEM_PROMPT = `You are an expert agricultural advisor in Sri Lanka, helping farmers with plant diseases, pests, and crop care.
- Use very simple, clear and professional English language exclusively. Do NOT use Sinhala.
- Suggest affordable, natural, locally available solutions first (neem oil, cow urine, ash, turmeric, etc.).
- Recommend chemical options only as last resort with safety warnings.
- Focus on prevention, monsoon season tips, and Sri Lankan climate conditions.
- Be encouraging, patient, and helpful.
- Keep answers short and clear (max 150-200 words).`;

// ─── Send Chat Message ────────────────────────────────
const sendMessage = async (req, res) => {
  try {
    const { message, disease, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return res.status(500).json({
        message: 'Chatbot is not configured. Please add GROQ_API_KEY to server .env file.',
      });
    }

    // Step 1: Check FAQ for exact disease match
    if (disease) {
      const diseaseNorm = disease.toLowerCase().replace(/[\s-]/g, '_');
      const faqMatch = FAQ_DATA.find((f) =>
        f.disease.toLowerCase().includes(diseaseNorm)
      );
      // Only return FAQ for generic "tell me about" type queries
      if (faqMatch && message.toLowerCase().includes('advice')) {
        return res.json({ response: faqMatch.advice, source: 'faq' });
      }
    }

    // Step 2: Call Groq LLM
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

    // Add conversation history (max last 12 messages ≈ 6 turns)
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-12);
      for (const msg of recentHistory) {
        const role = msg.role === 'user' ? 'user' : 'assistant';
        messages.push({ role, content: msg.content });
      }
    }

    // Build user message with disease context
    let userMessage = `Question: ${message}`;
    if (disease) {
      userMessage += `\nDetected disease: ${disease}`;
    }
    messages.push({ role: 'user', content: userMessage });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data?.error?.message || 'Unknown Groq API error';
      console.error('Groq API error:', errMsg);
      return res.status(502).json({
        message: `AI model error: ${errMsg}`,
      });
    }

    const aiResponse = data.choices?.[0]?.message?.content?.trim();
    if (!aiResponse) {
      return res.status(502).json({ message: 'Empty response from AI model' });
    }

    res.json({ response: aiResponse, source: 'llm' });
  } catch (error) {
    console.error('Chatbot error:', error.message);
    res.status(500).json({
      message: 'Failed to get AI response. Please try again.',
    });
  }
};

// ─── Get FAQ List ─────────────────────────────────────
const getFAQ = async (req, res) => {
  try {
    const formattedFAQ = FAQ_DATA.map((item) => ({
      disease: item.disease.replace(/_/g, ' '),
      advice: item.advice,
    }));
    res.json(formattedFAQ);
  } catch (error) {
    console.error('FAQ fetch error:', error.message);
    res.status(500).json({ message: 'Failed to load FAQ data' });
  }
};

// ─── Predict Disease (proxy to Flask backend) ─────────
const predictDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const FLASK_URL = process.env.FLASK_CHATBOT_URL || 'http://localhost:5002';
    const url = new URL(`${FLASK_URL}/api/predict`);

    // Build proper multipart/form-data manually (Node.js native FormData
    // doesn't reliably set filenames which Flask requires)
    const boundary = '----NodeFormBoundary' + Date.now().toString(16);

    const headerPart = Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${req.file.originalname}"\r\n` +
      `Content-Type: ${req.file.mimetype}\r\n\r\n`
    );
    const footerPart = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body = Buffer.concat([headerPart, req.file.buffer, footerPart]);

    // Use Node.js http module for reliability
    const http = require(url.protocol === 'https:' ? 'https' : 'http');

    const proxyPromise = new Promise((resolve, reject) => {
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
        },
        timeout: 120000, // 2 minutes for model prediction
      };

      const proxyReq = http.request(options, (proxyRes) => {
        let data = '';
        proxyRes.on('data', (chunk) => { data += chunk; });
        proxyRes.on('end', () => {
          try {
            resolve({ status: proxyRes.statusCode, data: JSON.parse(data) });
          } catch {
            resolve({ status: proxyRes.statusCode, data: { error: 'Invalid response from Flask' } });
          }
        });
      });

      proxyReq.on('error', (err) => reject(err));
      proxyReq.on('timeout', () => {
        proxyReq.destroy();
        reject(new Error('Flask prediction timeout'));
      });

      proxyReq.write(body);
      proxyReq.end();
    });

    const result = await proxyPromise;

    if (result.status !== 200 || result.data.error) {
      return res.status(result.status || 500).json({
        error: result.data.error || 'Flask prediction service returned an error',
        details: result.data.details || 'Check Flask server logs for details.',
      });
    }

    res.json(result.data);
  } catch (error) {
    console.error('Disease prediction proxy error:', error.message);

    if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
      return res.status(503).json({
        error: 'Plant Disease Detection service is not running',
        details: 'Please start the Flask server: cd CHATBOT/backend && python app.py',
      });
    }

    res.status(500).json({
      error: 'Disease detection failed',
      details: error.message,
    });
  }
};

module.exports = { sendMessage, getFAQ, predictDisease };

