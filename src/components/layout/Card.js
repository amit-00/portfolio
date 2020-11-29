import React from 'react'

const Card = ({ title, desc }) => {
    return (
        <li className="transition2">
            <div className="icon-container one">
                
            </div>
            <p className="skill-title">{title}</p>
            <p className="featured-desc skill-desc">{desc}</p>
        </li>
    )
}

export default Card;
