import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { NavContainer } from './Navbar.elements';


const Navbar = () => {
    return (
        <Fragment>
            <NavContainer>
                <header>
                    <Link to='/' className='logo' >Amit Verma</Link>

                    <nav>
                        <ul>
                            <li><Link className='nav-link' to='/'>About</Link></li>
                            <li><Link className='nav-link' to='/'>Resume</Link></li>
                            <li><Link className='nav-link' to='/'>Contact</Link></li>
                        </ul>
                    </nav>
                </header>
                <div className="social-header">
                    <ul>
                        <li><Link style={{color: '#000000'}} to='/' ><i className="fab fa-github"></i></Link></li>
                    </ul>
                </div>
            </NavContainer>
        </Fragment>
    )
}

export default Navbar;
