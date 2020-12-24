import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
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

.home{
  visibility: hidden;
}

h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
}

p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
}

ul{
    list-style-type: none;
    margin: 0;
    padding: 0;
}

img{
    width: 100%;
}

section{
    padding: 4em 2em;
    text-align: center;
}

@media only screen and (min-width: 1050px){
    section{
        padding: 4em;
    }
}

@media only screen and (min-width: 1250px){
    section{
        padding: 10em 10em 4em 10em;
    }
}

@media only screen and (min-width: 1550px){
    section{
        padding: 6em 20em 4em 20em;
    }
}

`



export default GlobalStyle;