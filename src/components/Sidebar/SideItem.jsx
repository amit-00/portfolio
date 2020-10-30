import React from 'react';
import { Link } from 'react-router-dom';

const SideItem = ({ item: { title, path, icon }, active, current, setCurrent }) => {


    return (
        <Link 
        onClick={() => setCurrent(title)} 
        style={{ fontSize: '1.4em' }} 
        to={ path } 
        className={`card border-0 text-slim-1 text-white pl-3 d-inline ${ current === title ? 'side-item-active' : 'side-item' } `}
        >
            { icon } { active && <p className="d-inline" >{title}</p> }
        </Link>
    )
}

export default SideItem;
