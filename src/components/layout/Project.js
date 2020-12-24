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
                <div className={isFeatured ? 'inner transition2' : 'inner transition4'}>
                    <p className="subtitle">{subtitle}</p>
                    { isFeatured ? (
                        <Link to="/" className="project-title" >{title}</Link>
                    ) : (
                        <p className="project-title">{title}</p>
                    ) }
                    
                    <p className="desc">{desc}</p>
                </div>
            </div>
            <div className="right">
                <Img img={img} height={height} width={width} isFeatured={isFeatured}  />
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
