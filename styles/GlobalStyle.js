"use client";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #f2f4f6; /* 토스 st 배경 */
    color: #333d4b;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    display: flex;
    justify-content: center;
    min-height: 100vh;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyle;
