import React from 'react';
import { Link } from 'react-scroll';

const Home = () => {

    return (
        
        <div className="page d-flex flex-column justify-content-center" id="Home">
            <div className="row ">
                <div style={{ marginTop: "5rem" }} className="col-md d-flex flex-column justify-content-center">
                    <h1 className="text-white text-bold hero-font">Hi,</h1>
                    <h1 className="text-white text-bold hero-font">I'm Amit,</h1>
                    <h1 className="text-white text-bold hero-font">Software Engineer.</h1>
                    <p className="text-slim text-secondary spaced-text">Front-End Web Developer // Back-End Web Developer // Student</p>
                </div>
                <div className="col-md">

                </div>
            </div>
            <Link 
            style={{ width: '200px' }}
            className="btn btn-outline-info btn-lg"
            to="Contact"
            smooth={ true }
            duration={ 500 }
            >CONTACT ME</Link>
        </div>
        
    )
}

export default Home
