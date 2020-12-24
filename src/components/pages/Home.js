import React, { Fragment, useRef, useEffect } from 'react';
import { Hero, Skills, Portfolio } from './Home.element';
import { gsap, TweenMax, TimelineLite, Power4, Back} from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import featured from '../../assets/featured.png'

import Project from '../layout/Project';
import Card from '../layout/Card';


const Home = () => {
    let app = useRef(null);
    let showcase = useRef(null);
    let content = useRef(null);


    let tl = new TimelineLite();

    useEffect(() => {

        gsap.registerPlugin(ScrollTrigger);

        TweenMax.to(app, 0, {css: { visibility: 'visible' }});

        tl.from(content, { duration: 1, y: '-30%', opacity: 0, ease: Power4.easeOut });
        tl.from('.stagger1', { duration: 1, y: -50, opacity: 0, stagger: 0.2, ease: Power4.easeOut }, '-=0.75');
        tl.from(showcase , { duration: 1, y: 50, opacity: 0, stagger: 0.2, ease: Power4.easeOut }, '-=1');

        TweenMax.from('.square-anim', { stagger: 0.1, scale: 0.1, duration: 1, ease: Back.easeOut });
        gsap.from('.transition2' , { scrollTrigger: {
            trigger: '.transition2',
            start: 'top bottom',
        }, y: 50, opacity: 0, duration: 1, stagger: 0.2 })
        gsap.from('.transition3' , { scrollTrigger: {
            trigger: '.transition3',
            start: 'top bottom',
        }, y: 50, opacity: 0, duration: 1, stagger: 0.2 })
        gsap.from('.transition4' , { scrollTrigger: {
            trigger: '.transition4',
            start: 'top bottom',
        }, y: 50, opacity: 0, duration: 1, stagger: 0.2 })


    }, [])

    return (
        <div className="home" ref={ el => app = el } >
            <Hero>
                <div className="content" ref={ el => content = el }>
                    <h1 className="stagger1" >Hi I'm Amit, Software Engineer</h1>
                    <p className="stagger1" >Discover more about me</p>
                    <svg className="scroll stagger1" width="40" height="77" viewBox="0 0 40 77" style={{transform: 'translate(0px, 0px)', opacity: '1'}}>
                        <g id="scroll" transform="translate(-253 -787)">
                            <g id="Rectangle_12" data-name="Rectangle 12" transform="translate(253 787)" fill="none" stroke="#fff" strokeWidth="4">
                            <rect width="40" height="77" rx="20" stroke="none"></rect>
                            <rect x="2" y="2" width="36" height="73" rx="18" fill="none"></rect>
                            </g>
                            <circle className="circle" id="Ellipse_1" data-name="Ellipse 1" cx="11" cy="11" r="11" transform="translate(262 798)" fill="#fff"></circle>
                        </g>
                    </svg>
                </div>
                <svg width="600" height="600" viewBox="0 0 600 600" fill="none" className='hero-design' ref={ el => showcase = el } >
                    <rect className="square-anim" x="300" width="150" height="150" rx="25" fill="#1C2237"/>
                    <rect className="square-anim" x="300" y="300" width="150" height="150" rx="25" fill="#1C2237"/>
                    <circle className="square-anim" cx="375" cy="225" r="75" fill="#276AFB"/>
                    <rect className="square-anim" x="450" y="150" width="150" height="150" rx="25" fill="#343A40"/>
                    <circle className="square-anim" cx="225" cy="375" r="75" fill="#5BC0DE"/>
                    <rect className="square-anim" x="150" y="150" width="150" height="150" rx="25" fill="white"/>
                    <rect className="square-anim" y="300" width="150" height="150" rx="25" fill="#343A40"/>
                    <rect className="square-anim" x="150" y="450" width="150" height="150" rx="25" fill="white"/>
                </svg>
            </Hero>
            <section className="featured">
                <Project title='InterLink Social Media App' subtitle='Featured Project' desc='Social media web application that allows developers to network and interact with eachother' img={featured} isFeatured={true} />
            </section>

            <Skills className="skills">
                <div className="skills-container">
                    <ul>
                        <Card title='Software Design' desc='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean scelerisque, sem eu blandit sodales' 
                        icon={<i className="fas fa-crop-alt"></i>} />
                        <Card title='Software Development' desc='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean scelerisque, sem eu blandit sodal' 
                        icon={<i className="fas fa-code"></i>} />
                        <Card title='Web Development' desc='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean scelerisque, sem eu blandit sodales' 
                        icon={<i className="fab fa-react"></i>} />
                    </ul>
                </div>
            </Skills>

            <Portfolio>
                <h1>Projects</h1>
                <Project title='InterLink' subtitle='Social Media App' desc='Social media web application that allows developers to network and interact with eachother' img={featured} isFeatured={false} />
                <Project title='InterLink' subtitle='Social Media App' desc='Social media web application that allows developers to network and interact with eachother' img={featured} isFeatured={false} />
                <Project title='InterLink' subtitle='Social Media App' desc='Social media web application that allows developers to network and interact with eachother' img={featured} isFeatured={false} />
            </Portfolio>
        </div>
        

    )
}

export default Home
