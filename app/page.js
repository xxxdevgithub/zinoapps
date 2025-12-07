"use client";
import styled from "styled-components";
import Link from "next/link";
// FaGhost 아이콘 추가
import { FaGhost, FaCalculator, FaEraser, FaChartLine, FaCog } from "react-icons/fa";

const Header = styled.header`
    padding: 60px 24px 20px;
`;

const Title = styled.h1`
    font-size: 26px;
    font-weight: 800;
    color: #191f28;
    margin-bottom: 8px;
`;

const SubTitle = styled.p`
    font-size: 15px;
    color: #8b95a1;
`;

const AppGrid = styled.nav`
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
`;

const AppItem = styled(Link)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f9fafb;
    padding: 24px;
    border-radius: 24px;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
        background-color: #f2f4f6;
    }
    &:active {
        transform: scale(0.96);
    }
`;

const IconWrapper = styled.div`
    font-size: 32px;
    color: #3182f6;
    margin-bottom: 12px;
`;

const AppName = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: #333d4b;
`;

// 앱 목록 데이터 수정
const apps = [
    {
        id: 1,
        name: "고스트 마네킹",
        icon: <FaGhost />, // 유령 아이콘 적용
        path: "/ghost-mannequin", // 아까 만든 폴더 경로와 일치해야 함
    },
];

export default function Home() {
    return (
        <main>
            <Header>
                <Title>Zino Apps</Title>
            </Header>

            <AppGrid>
                {apps.map((app) => (
                    <AppItem key={app.id} href={app.path} aria-label={`${app.name} 이동`}>
                        <IconWrapper>{app.icon}</IconWrapper>
                        <AppName>{app.name}</AppName>
                    </AppItem>
                ))}
            </AppGrid>
        </main>
    );
}
