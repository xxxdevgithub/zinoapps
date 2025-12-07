import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// 가져오신 공식 문서에 나온 최신 모델명 적용
const MODEL_NAME = "gemini-3-pro-image-preview";

export async function POST(request) {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API Key가 설정되지 않았습니다." }, { status: 500 });
        }

        const { base64Image } = await request.json();
        if (!base64Image) {
            return NextResponse.json({ error: "이미지 데이터가 없습니다." }, { status: 400 });
        }

        // 1. SDK 초기화
        const ai = new GoogleGenAI({ apiKey });

        // 2. 프롬프트 및 설정 구성
        const prompt =
            "Transform the clothing item in the provided image into a professional e-commerce product shot using the 'ghost mannequin' (invisible mannequin) technique. The garment must be rendered with a realistic 3D volumetric shape and drape, as if worn by an invisible body. Ensure no part of a mannequin or person is visible. The background must be pure, solid white. Crucially, if the garment is white, use high-contrast lighting and defined shadows to ensure it clearly stands out against the white background.";

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
            responseModalities: ["IMAGE"], // 이미지를 원한다고 명시
            // temperature: 0.4, // 필요시 주석 해제
        };

        // 3. 모델 호출 (generateContent 사용 - 스트림 아님)
        // 스트림(generateContentStream)은 청크 단위 처리라 웹 API응답엔 generateContent가 더 깔끔합니다.
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            config,
            contents,
        });

        // 4. 응답 데이터 추출 (SDK 구조에 맞춰 파싱)
        const candidate = response.candidates?.[0];
        const firstPart = candidate?.content?.parts?.[0];

        // 이미지가 있는지 확인
        if (firstPart?.inlineData?.data) {
            return NextResponse.json({
                success: true,
                image: firstPart.inlineData.data,
            });
        }

        // 이미지가 없다면 텍스트 에러가 있는지 확인
        if (firstPart?.text) {
            console.error("Gemini Text Response:", firstPart.text);
            return NextResponse.json({ error: `이미지 대신 텍스트가 반환됨: ${firstPart.text}` }, { status: 400 });
        }

        throw new Error("응답에 유효한 데이터가 없습니다.");
    } catch (error) {
        console.error("Generate SDK Error:", error);
        // SDK가 던지는 상세 에러 메시지를 반환
        return NextResponse.json({ error: error.message || "SDK Error" }, { status: 500 });
    }
}
