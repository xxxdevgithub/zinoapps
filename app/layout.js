import StyledComponentsRegistry from "@/lib/registry";
import GlobalStyle from "@/styles/GlobalStyle";
import LayoutContainer from "@/components/LayoutContainer";

// SEO를 위한 기본 메타데이터 설정
export const metadata = {
    title: {
        template: "%s | ZinoApps", // 하위 페이지 제목이 앞에 붙음 (예: 로또분석기 | ZinoApps)
        default: "ZinoApps - 유용한 웹 도구 모음",
    },
    description: "로또 분석, 배경 제거 등 다양한 유틸리티 도구를 무료로 제공하는 웹 앱 서비스입니다.",
    keywords: ["웹앱", "유틸리티", "로또분석", "배경제거", "ZinoApps"], // 검색 키워드
    openGraph: {
        title: "ZinoApps",
        description: "스마트폰처럼 사용하는 웹 도구 모음",
        type: "website",
        locale: "ko_KR",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <body>
                <StyledComponentsRegistry>
                    <GlobalStyle />
                    <LayoutContainer>{children}</LayoutContainer>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
