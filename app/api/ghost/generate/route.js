import { NextResponse } from 'next/server';

const MODEL_NAME = "gemini-3-pro-image-preview"; // 요청하신 모델명 고정
const API_KEY = process.env.GOOGLE_API_KEY;

const INITIAL_PROMPT = "Transform the clothing item in the provided image into a professional e-commerce product shot using the 'ghost mannequin' (invisible mannequin) technique. The garment must be rendered with a realistic 3D volumetric shape and drape, as if worn by an invisible body. Ensure no part of a mannequin or person is visible. The background must be pure, solid white. Crucially, if the garment is white, use high-contrast lighting and defined shadows to ensure it clearly stands out against the white background.";

export async function POST(request) {
  try {
    const { base64Image } = await request.json();

    if (!base64Image) {
      return NextResponse.json({ error: 'Image data missing' }, { status: 400 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    const requestBody = {
      "contents": [{
        "parts": [
          { "text": INITIAL_PROMPT },
          { "inline_data": { "mime_type": "image/jpeg", "data": base64Image } }
        ]
      }],
      "generationConfig": { 
        "response_modalities": ["IMAGE"], 
        "temperature": 0.4 
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error Detail:", errorText);
      throw new Error(`Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    let generatedData = null;

    // 응답 데이터 파싱 로직 (Flutter 코드와 동일한 구조 찾기)
    const candidates = data.candidates;
    if (candidates && candidates.length > 0) {
        const parts = candidates[0].content.parts;
        for (const part of parts) {
            if (part.inlineData) {
                generatedData = part.inlineData.data;
                break;
            } else if (part.inline_data) {
                generatedData = part.inline_data.data;
                break;
            }
        }
    }

    if (!generatedData) {
         throw new Error("이미지 데이터가 생성되지 않았습니다.");
    }
    
    return NextResponse.json({ success: true, image: generatedData });

  } catch (error) {
    console.error("Generate API Error:", error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}