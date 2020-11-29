import React from 'react';
import { Link } from 'react-router-dom';

const Project = ({ title, subtitle, desc, img, isFeatured }) => {
    return (
        <div className={isFeatured && 'featured'}>
            <div className="left">
                <div className="inner transition2">
                    <p className="subtitle">{subtitle}</p>
                    <Link to="/" className="project-title" >{title}</Link>
                    
                    <p className="desc">{desc}</p>
                </div>
            </div>
            <img className="right" src={img} alt="Project"/>
        </div>
    )
}

export default Project;
