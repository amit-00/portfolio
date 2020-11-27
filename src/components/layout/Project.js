import React from 'react'

const Project = ({ title, subtitle, desc }) => {
    return (
        <div className="inner transition2">
            <p className="subtitle">{subtitle}</p>
            <Link to="/" className="project-title" >{title}</Link>
            
            <p className="desc">{desc}</p>
        </div>
    )
}

export default Project;
