"use client";
import React, { useState, useRef } from "react";
import styled from "styled-components";
import Link from "next/link";
import { FaArrowLeft, FaCamera, FaSyncAlt, FaPalette, FaDownload } from "react-icons/fa";
import { HexColorPicker } from "react-colorful";

// --- Styled Components ---
const Container = styled.div`
    padding: 24px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const Header = styled.header`
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    padding-top: 20px;
`;

const BackLink = styled(Link)`
    font-size: 20px;
    color: #333d4b;
    margin-right: 16px;
`;

const Title = styled.h1`
    font-size: 22px;
    font-weight: 700;
`;

const Description = styled.p`
    color: #8b95a1;
    font-size: 15px;
    line-height: 1.5;
    margin-bottom: 32px;
`;

const UploadSection = styled.section`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px dashed #e5e8eb;
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    background-color: #fff;
`;

const HiddenInput = styled.input`
    display: none;
`;

const UploadButton = styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 20px;
`;

const IconWrapper = styled.div`
    font-size: 48px;
    color: #3182f6;
    margin-bottom: 16px;
`;

const UploadText = styled.span`
    font-size: 17px;
    font-weight: 600;
    color: #333d4b;
`;

// --- Result View Styled Components ---
const ResultContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 100px;
`;

// 💡 수정된 부분: ImageWrapper에 최소 높이와 flex 정렬을 추가했습니다.
const ImageWrapper = styled.div`
    width: 100%;
    min-height: 400px; /* 이미지가 없을 때 높이가 0이 되는 것을 방지 */
    max-height: 60vh;
    overflow: hidden;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    background: #fff;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    /* 모바일에서 꾹 누르기(Context Menu) 허용 */
    -webkit-touch-callout: default;
    user-select: none;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: opacity 0.3s ease;
    }
`;

const TipText = styled.p`
    margin-top: 12px;
    font-size: 13px;
    color: #8b95a1;
    background-color: rgba(0, 0, 0, 0.05);
    padding: 6px 12px;
    border-radius: 20px;
`;

const BottomBar = styled.div`
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 440px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 12px 20px;
    border-radius: 35px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
`;

const IconButton = styled.button`
    background: none;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 8px 12px;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const BtnIcon = styled.div`
    font-size: 24px;
    color: #333d4b;
    margin-bottom: 4px;
`;

const BtnLabel = styled.span`
    font-size: 11px;
    color: #8b95a1;
`;

const SaveButton = styled.button`
    background: linear-gradient(to right, #833ab4, #f77737);
    border: none;
    border-radius: 30px;
    padding: 12px 24px;
    color: white;
    font-weight: bold;
    display: flex;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(247, 119, 55, 0.3);

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const LoadingOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    z-index: 5;
`;

const LoadingText = styled.p`
    margin-top: 16px;
    font-weight: 600;
    color: #333d4b;
`;

const ColorPickerOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
`;

const PickerWrapper = styled.div`
    background: white;
    padding: 24px;
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    width: 300px;

    .react-colorful {
        width: 100%;
        height: 200px;
        margin-bottom: 20px;
    }
    .react-colorful__saturation {
        border-radius: 12px;
    }
    .react-colorful__hue {
        height: 24px;
        border-radius: 12px;
        margin-top: 12px;
    }
    .react-colorful__pointer {
        width: 24px;
        height: 24px;
    }
`;

const ColorPreview = styled.div`
    width: 100%;
    height: 48px;
    border-radius: 12px;
    background-color: ${(props) => props.color};
    margin-bottom: 20px;
    border: 1px solid #e5e8eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: ${(props) => getContrastColor(props.color)};
`;

const PickerButtons = styled.div`
    display: flex;
    width: 100%;
    gap: 12px;
`;

const PickerBtn = styled.button`
    flex: 1;
    padding: 14px;
    border-radius: 16px;
    border: none;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: transform 0.1s;
    background: ${(props) => (props.$primary ? "#3182f6" : "#f2f4f6")};
    color: ${(props) => (props.$primary ? "white" : "#4e5968")};

    &:active {
        transform: scale(0.96);
    }
`;

function getContrastColor(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#ffffff";
}

export default function GhostMannequinPage() {
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [resultImage, setResultImage] = useState(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [pickerColor, setPickerColor] = useState("#3182f6");

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setLoadingMessage("이미지 최적화 중...");
        setResultImage(null);

        try {
            const compressedBase64 = await compressImage(file, 1024, 0.8);
            setLoadingMessage("유령 마네킹 작업 중...");
            await generateGhostMannequin(compressedBase64);
        } catch (error) {
            alert("오류 발생: " + error.message);
            setIsLoading(false);
        }
    };

    const compressImage = (file, maxWidth, quality) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (maxWidth / width) * height;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/jpeg", quality).split(",")[1]);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    const generateGhostMannequin = async (base64Data) => {
        try {
            const response = await fetch("/api/ghost/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ base64Image: base64Data }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server Error (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            if (!data.success) throw new Error(data.error);

            setResultImage(`data:image/jpeg;base64,${data.image}`);
        } catch (e) {
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const handleColorChangeConfirm = async () => {
        setShowColorPicker(false);
        if (!resultImage) return;

        setIsLoading(true);
        setLoadingMessage("색상 입히는 중...");

        try {
            const currentBase64 = resultImage.split(",")[1];
            const response = await fetch("/api/ghost/recolor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    base64Image: currentBase64,
                    hexColor: pickerColor,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server Error (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            if (!data.success) throw new Error(data.error);

            setResultImage(`data:image/jpeg;base64,${data.image}`);
        } catch (error) {
            alert("색상 변경 실패: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRealFlip = () => {
        if (!resultImage) return;

        const img = new Image();
        img.src = resultImage;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            ctx.translate(img.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0);

            setResultImage(canvas.toDataURL("image/jpeg"));
        };
    };

    const handleSave = () => {
        if (!resultImage) return;
        const link = document.createElement("a");
        link.href = resultImage;
        link.download = `ghost_mannequin_${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Container>
            <Header>
                <BackLink href="/">
                    <FaArrowLeft />
                </BackLink>
                <Title>고스트 마네킹</Title>
            </Header>

            {!resultImage && !isLoading ? (
                <>
                    <Description>
                        옷 사진을 올려주세요.
                        <br />
                        마네킹이 입은 것처럼 깔끔하게 바꿔드려요.
                    </Description>
                    <UploadSection>
                        <HiddenInput type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} />
                        <UploadButton onClick={() => fileInputRef.current?.click()}>
                            <IconWrapper>
                                <FaCamera />
                            </IconWrapper>
                            <UploadText>앨범에서 선택 또는 촬영</UploadText>
                        </UploadButton>
                    </UploadSection>
                </>
            ) : (
                <ResultContainer>
                    <ImageWrapper>
                        {resultImage && <img src={resultImage} alt="Generated" />}

                        {isLoading && (
                            <LoadingOverlay>
                                <div style={{ border: "3px solid #f3f3f3", borderTop: "3px solid #3182f6", borderRadius: "50%", width: "30px", height: "30px", animation: "spin 1s linear infinite" }}></div>
                                <LoadingText>{loadingMessage}</LoadingText>
                            </LoadingOverlay>
                        )}
                    </ImageWrapper>
                    {!isLoading && <TipText>💡 이미지를 꾹 누르면 저장/복사할 수 있어요</TipText>}
                </ResultContainer>
            )}

            {resultImage && !isLoading && (
                <BottomBar>
                    <IconButton onClick={handleRealFlip} disabled={isLoading}>
                        <BtnIcon>
                            <FaSyncAlt />
                        </BtnIcon>
                        <BtnLabel>좌우반전</BtnLabel>
                    </IconButton>
                    <IconButton onClick={() => setShowColorPicker(true)} disabled={isLoading}>
                        <BtnIcon>
                            <FaPalette />
                        </BtnIcon>
                        <BtnLabel>색상변경</BtnLabel>
                    </IconButton>
                    <SaveButton onClick={handleSave} disabled={isLoading}>
                        <FaDownload style={{ marginRight: "8px" }} />
                        저장하기
                    </SaveButton>
                </BottomBar>
            )}

            {showColorPicker && (
                <ColorPickerOverlay onClick={() => setShowColorPicker(false)}>
                    <PickerWrapper onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>색상 선택</h3>
                        <HexColorPicker color={pickerColor} onChange={setPickerColor} />
                        <ColorPreview color={pickerColor}>{pickerColor.toUpperCase()}</ColorPreview>
                        <PickerButtons>
                            <PickerBtn onClick={() => setShowColorPicker(false)}>취소</PickerBtn>
                            <PickerBtn $primary onClick={handleColorChangeConfirm}>
                                적용
                            </PickerBtn>
                        </PickerButtons>
                    </PickerWrapper>
                </ColorPickerOverlay>
            )}
            <style jsx global>{`
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </Container>
    );
}