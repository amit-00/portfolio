import styled from 'styled-components';

export const NavContainer = styled.div`
background-color: #181E33;

`

export const Head = styled.header`
display: flex;
justify-content: space-between;
padding: 2em;

.logo {
    color: #5bc0de;
    font-weight: bold;
    text-decoration: none;
}

ul {
    display: flex;

    .nav-link {
    display: block;
    padding: 0 0.5em;
    color: #ffffff;
    text-decoration: none;
    }
}

.social-header {
    display: none;
}
`