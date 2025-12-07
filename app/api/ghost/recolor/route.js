import { NextResponse } from "next/server";

const MODEL_NAME = "gemini-3-pro-image-preview"; // 요청하신 모델명 고정
const API_KEY = process.env.GOOGLE_API_KEY;

export async function POST(request) {
    try {
        const { base64Image, hexColor } = await request.json();

        const RECOLOR_PROMPT = `Change the color of the garment in the provided image to ${hexColor}.
Crucial Requirement: This operation must be a precise color hue shift strictly isolated to the fabric area. You MUST preserve the exact original texture, fabric weave, wrinkles, folds, lighting, shadows, and highlights. Do NOT re-render or alter the shape, drape, or dimensionality of the garment in any way. The background and everything else must remain identical to the original image. The final result should look exactly like the input photo, but only with a different fabric color`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

        const requestBody = {
            contents: [
                {
                    parts: [{ text: RECOLOR_PROMPT }, { inline_data: { mime_type: "image/jpeg", data: base64Image } }],
                },
            ],
            generationConfig: {
                response_modalities: ["IMAGE"],
                temperature: 0.4,
            },
        };

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Recolor API Error Detail:", errorText);
            throw new Error(`Gemini API Error: ${response.status}`);
        }

        const data = await response.json();
        let generatedData = null;

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
            throw new Error("색상 변경된 이미지가 생성되지 않았습니다.");
        }

        return NextResponse.json({ success: true, image: generatedData });
    } catch (error) {
        console.error("Recolor API Error:", error);
        return NextResponse.json({ error: error.message || "Recolor failed" }, { status: 500 });
    }
}
