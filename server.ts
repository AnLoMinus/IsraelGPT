import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json({ limit: "50mb" }));

  // API route for chat streaming
  app.post("/api/chat", async (req, res) => {
    const { prompt, systemInstruction } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      res.write(`data: ${JSON.stringify({ type: 'error', text: 'GEMINI_API_KEY is not set on the server.' })}\n\n`);
      return res.end();
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const generateImageTool = {
      name: "generate_image",
      description: "Generate an image based on a visual prompt. Use this when the user asks for a picture, drawing, sketch, or image.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          imagePrompt: {
            type: Type.STRING,
            description: "A detailed prompt in English describing the image to generate."
          }
        },
        required: ["imagePrompt"]
      }
    };

    try {
      const config: any = {
        tools: [{ functionDeclarations: [generateImageTool] }]
      };
      
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of responseStream) {
        if (chunk.functionCalls && chunk.functionCalls.length > 0) {
          const call = chunk.functionCalls[0];
          if (call.name === 'generate_image') {
            const args = call.args as any;
            res.write(`data: ${JSON.stringify({ type: 'tool', name: 'generate_image', args })}\n\n`);
          }
        }
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ type: 'text', text: chunk.text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      console.error("Streaming error:", error);
      res.write(`data: ${JSON.stringify({ type: 'error', text: 'מצטער, חלה שגיאה בתקשורת עם המודל.' })}\n\n`);
      res.end();
    }
  });

  // API route for image generation
  app.post("/api/image", async (req, res) => {
    const { imagePrompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    try {
      const imgResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: imagePrompt }] }
      });
      
      let imageUrl = '';
      for (const part of imgResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      res.json({ imageUrl });
    } catch (error) {
      console.error("Image generation error:", error);
      res.status(500).json({ error: 'Failed to generate image' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built static files
    app.use(express.static('dist'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
