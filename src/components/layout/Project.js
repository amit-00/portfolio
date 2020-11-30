import React from 'react';
import { ProjectContainer } from './Project.element';
import { Link } from 'react-router-dom';
import Img from './Img';
import PropTypes from 'prop-types';

const Project = ({ title, subtitle, desc, img, isFeatured, link }) => {
    let width = "800px"
    let height = "450px"

    return (
        <ProjectContainer className='project'>
            <div className="left">
                <div className="inner transition2">
                    <p className="subtitle">{subtitle}</p>
                    <Link to="/" className="project-title" >{title}</Link>
                    
                    <p className="desc">{desc}</p>
                </div>
            </div>
            <div className="right">
                <Img  img={img} height={height} width={width}  />
            </div>
            
        </ProjectContainer>
    )
}

Project.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    isFeatured: PropTypes.bool
}

export default Project;
