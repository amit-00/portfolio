import React from 'react'

const About = () => {
    return (
        <div className="page d-flex flex-column justify-content-center" id="About" >
            <div className="row ">
                <div className="col-md">
                    <h1 className="text-teal text-bold hero-font mb-5">About Me</h1>
                    <p style={{ fontSize: '1.1em' }} className="text-secondary">I began programming as a way to escape boredom but quickly gained a deep interest in the field to the point I want to make a career out of it. I am currently enrolled in the Software Engineering program at the University of Western Ontario pursuing a Bachelor of Applied Science.</p>
                    <p style={{ fontSize: '1.1em' }} className="text-secondary">Eager to learn, creative, well organized, problem solver, engaged and prepared to complete all tasks at hand. A fan of Basketball, outdoor activities, video games and anything computer or software related.</p>
                    <p style={{ fontSize: '1.1em' }} className="text-secondary">Currently looking for an internship to gain more professional working experience in the field but would also love to tackle small to medium scale projects.</p>
                </div>
                <div className="col-md">

                </div>
            </div>
        </div>
    )
}

export default About;
