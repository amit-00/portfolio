import styled from 'styled-components';

export const Hero = styled.section`
background-color: #1c2237;
color: #ffffff;
display: grid;
text-align: center;
padding: 4em;

.hero-design{
    display: none;
}

p{
    margin: 0 auto;
    font-weight: bold;
    color: #276AFB;
}

.scroll{
    width: 30px;
    margin-top: 2rem;
}

.circle{
    animation: circleAnim 1s infinite alternate-reverse;
}

@keyframes circleAnim {
    from {
        transform: translate(262px, 798px);
        z-index: 5;
    }
    to{
        transform: translate(262px, 830px);
    }
}

@media only screen and (min-width: 1050px){
    height: 90vh;
    display: grid;
    grid-template-columns: 66% auto;
    background: unset;
    padding: 0;

    .content{
        background: #1c2237;
        padding: 6em 8em 6em 4em;
        text-align: left;

        h1{
            font-size: 3em;
            line-height: 1.2em;
            width: 50%;
        }
    }

    .hero-design{
        display: unset;
        margin-left: -50%;
        margin-top: 15%;
        width: 100%;
    }
}

@media only screen and (min-width: 1250px){
    .content{
        padding: 6em 8em 6em 10em;
        h1{
            width: 60%;
        }
    }
}

@media only screen and (min-width: 1550px){
    .content{
        padding: 9em 20em 6em 20em;
        h1{
            width: unset;
        }
    }
}

`

export const Skills = styled.section`
background-color: #276AFB;
color: #ffffff;

.skills-container{
    ul{
        display: grid;
    }
}

@media only screen and (min-width: 800px){
    margin-top: -5.5rem;
    margin-bottom: -9em;

    .skills-container{
        ul{
            grid-template-columns: repeat(3, 1fr);
            grid-gap: 1em;
        }
    }
}

`

export const Portfolio = styled.section`
text-align: left;
background-color: #ffffff;
padding-top: 6rem;

@media only screen and (min-width: 1050px){
    img{
        float: right;
        max-width: 500px;
    }
}

`