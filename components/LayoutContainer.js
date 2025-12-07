"use client";
import styled from "styled-components";

// 검색엔진이 '아 여기가 본문 내용이구나'라고 알 수 있게 시맨틱 태그 활용 가능
const Container = styled.div`
    width: 100%;
    max-width: 480px; /* 모바일 규격 */
    min-height: 100vh;
    background-color: #ffffff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow-x: hidden;
`;

export default function LayoutContainer({ children }) {
    return <Container>{children}</Container>;
}
