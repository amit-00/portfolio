import React, { Fragment } from 'react';
import { Hero } from './Home.element';
import featured from '../../assets/featured.png'

import Project from '../layout/Project';


const Home = () => {
    return (
        <Fragment>
            <Hero>
                <div className="content">
                    <h1>Hi I'm Amit, Software Engineer</h1>
                    <p>Discover more about me</p>
                    <svg className="scroll stagger1" width="40" height="77" viewBox="0 0 40 77" style={{transform: 'translate(0px, 0px)', opacity: '1'}}>
                        <g id="scroll" transform="translate(-253 -787)">
                            <g id="Rectangle_12" data-name="Rectangle 12" transform="translate(253 787)" fill="none" stroke="#fff" stroke-width="4">
                            <rect width="40" height="77" rx="20" stroke="none"></rect>
                            <rect x="2" y="2" width="36" height="73" rx="18" fill="none"></rect>
                            </g>
                            <circle className="circle" id="Ellipse_1" data-name="Ellipse 1" cx="11" cy="11" r="11" transform="translate(262 798)" fill="#fff"></circle>
                        </g>
                    </svg>
                </div>
                <svg width="600" height="600" viewBox="0 0 600 600" fill="none" className='hero-design' >
                    <rect className="square-anim" x="300" width="150" height="150" rx="25" fill="#1C2237"/>
                    <rect className="square-anim" x="300" y="300" width="150" height="150" rx="25" fill="#1C2237"/>
                    <rect className="square-anim" x="450" y="150" width="150" height="150" rx="25" fill="#343A40"/>
                    <rect className="square-anim" x="150" y="150" width="150" height="150" rx="25" fill="white"/>
                    <rect className="square-anim" x="150" y="450" width="150" height="150" rx="25" fill="white"/>
                    <rect className="square-anim" y="300" width="150" height="150" rx="25" fill="#343A40"/>
                    <circle className="square-anim" cx="375" cy="225" r="75" fill="#276AFB"/>
                    <circle className="square-anim" cx="225" cy="375" r="75" fill="#5BC0DE"/>
                </svg>
            </Hero>
            <Project title='InterLink Social Media App' subtitle='Featured Project' desc='Social media web application that allows developers to network and interact with eachother' img={featured} isFeatured={true} />

            <section className="skills">
                <div className="skills-container">
                    <ul>
                        <li className="transition2"></li>
                    </ul>
                </div>
            </section>

        </Fragment>
        

    )
}

export default Home
