import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

*{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body{
    height: 100vh;
    font-family: 'Poppins', sans-serif;
    overflow-x: hidden;
}

ul{
    list-style-type: none;
    margin: 0;
    padding: 0;
}

img{
    width: 100%;
}

`



export default GlobalStyle;