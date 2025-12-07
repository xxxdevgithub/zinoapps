import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-3-pro-image-preview";

export async function POST(request) {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API Key가 설정되지 않았습니다." }, { status: 500 });
        }

        const { base64Image, hexColor } = await request.json();
        if (!base64Image || !hexColor) {
            return NextResponse.json({ error: "필수 데이터가 누락되었습니다." }, { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `Change the color of the garment in the provided image to ${hexColor}.
Crucial Requirement: This operation must be a precise color hue shift strictly isolated to the fabric area. You MUST preserve the exact original texture, fabric weave, wrinkles, folds, lighting, shadows, and highlights. Do NOT re-render or alter the shape, drape, or dimensionality of the garment in any way. The background and everything else must remain identical to the original image. The final result should look exactly like the input photo, but only with a different fabric color`;

        const contents = [
            {
                role: "user",
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: base64Image,
                        },
                    },
                ],
            },
        ];

        const config = {
            responseModalities: ["IMAGE"],
        };

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            config,
            contents,
        });

        const candidate = response.candidates?.[0];
        const firstPart = candidate?.content?.parts?.[0];

        if (firstPart?.inlineData?.data) {
            return NextResponse.json({
                success: true,
                image: firstPart.inlineData.data,
            });
        }

        if (firstPart?.text) {
            return NextResponse.json({ error: `이미지 대신 텍스트가 반환됨: ${firstPart.text}` }, { status: 400 });
        }

        throw new Error("응답에 유효한 데이터가 없습니다.");
    } catch (error) {
        console.error("Recolor SDK Error:", error);
        return NextResponse.json({ error: error.message || "SDK Error" }, { status: 500 });
    }
}
