import React from 'react';
import { CardContainer } from './Card.element'

const Card = ({ title, desc, icon }) => {
    return (
        <CardContainer className="transition3">
            <div className="icon-container one">
                {icon}
            </div>
            <p className="skill-title">{title}</p>
            <p className="desc">{desc}</p>
        </CardContainer>
    )
}

export default Card;
