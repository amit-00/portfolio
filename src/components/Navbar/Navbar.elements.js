import styled from 'styled-components';

export const NavContainer = styled.div`
background-color: #181E33;
font-size: 14px;

header{

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
}

.social-header {
    display: none;
}
@media only screen and (min-width: 1050px){
    display: grid;
    grid-template-columns: 66% auto;
    background: unset;

    header{
        background: #181E33;
        padding: 2em 2em 2em 4em;
        font-size: 1em;
    }

    .social-header{
        display: block;
        padding: 1.3em 4em 1em 0;

        ul{
            display: flex;
            justify-content: space-between;
            width: 7em;
            float: right;

            li{
                font-size: 2em;
            }
        }

    }
}

@media only screen and (min-width: 1250px){
    header{
        padding: 2em 2em 2em 10em;
    }

    .social-header{
        padding: 1.3em 10em 1em 0;
    }
}

@media only screen and (min-width: 1550px){
    header{
        padding: 2em 2em 2em 20em;
    }

    .social-header{
        padding: 1.3em 20em 1em 0;
    }
}
`