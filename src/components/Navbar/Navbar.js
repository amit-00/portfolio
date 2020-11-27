import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { NavContainer, Head } from './Navbar.elements';


const Navbar = () => {
    return (
        <Fragment>
            <NavContainer>
                <Head>
                    <Link to='/' className='logo' >Amit Verma</Link>

                    <nav>
                        <ul>
                            <li><Link className='nav-link' to='/'>About</Link></li>
                            <li><Link className='nav-link' to='/'>Resume</Link></li>
                            <li><Link className='nav-link' to='/'>Contact</Link></li>
                        </ul>
                    </nav>
                    <div className="social-header">
                        <ul>
                            <li><Link to='/' >G</Link></li>
                        </ul>
                    </div>
                </Head>
            </NavContainer>
        </Fragment>
    )
}

export default Navbar;
