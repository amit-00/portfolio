import React, { useState } from 'react';
import SideItem from './SideItem';
import { navItems } from './navItems';

const Sidebar = () => {
    const [active, toggleActive] = useState(false);
    const [current, setCurrent] = useState('Home');


    return (
        <div 
        onMouseEnter={() => toggleActive(true)} 
        onMouseLeave={() => toggleActive(false)} 
        className={`card border-0 bg-black d-flex flex-column justify-content-center pl-2 pr-2 ${ active ? 'sidebar-active' : 'sidebar' }`} 
        >
            <div className="side-items d-flex flex-column justify-content-around" >
                { navItems.map((item, index) => <SideItem key={ index } item={ item } active={ active } />) }
            </div>
        </div>
    )
}

export default Sidebar;
