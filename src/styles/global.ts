import { createGlobalStyle } from 'styled-components';
import github from '../assets/github.svg';

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
    }

    body {
        background: #f0f5f5 url(${github}) no-repeat 70% top;
        -webkit-font-smoothing: antialiased;
    }

    body, h1, button {
        font: 16px Roboto, sans-serif;
    }

    #root {
        max-width: 960px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    button {
        cursor: pointer;
    }
`;