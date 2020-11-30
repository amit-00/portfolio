import styled from 'styled-components';

export const ProjectContainer = styled.div`
text-align: center;

.subtitle{
    font-weight: bold;
    color: #5BC0DE;
    font-size: 0.85em;
    letter-spacing: 0.2em;
    text-transform: uppercase;
}

.project-title{
    font-weight: bold;
    font-size: 1.3em;
    text-decoration: none;
    color: #000000;
    margin-top: -.4em;
    display: block;
}

.desc{
    color: #252525;
    margin-bottom: 3rem;
    font-size: 0.9em;
    line-height: 1.8em;
}

@media only screen and (min-width: 800px){
    text-align: left;
    display: grid;
    grid-template-columns: 40% auto;

    .left{
        display: grid;
        place-content: center;
    }

    .right{
        margin-left: 2em;
        margin-top: 1em;
    }
}

@media only screen and (min-width: 1050px){

}

`