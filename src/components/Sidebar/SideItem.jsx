import React from 'react';
import { Link } from 'react-scroll';

const SideItem = ({ item: { title, icon }, active }) => {


    return (
        <Link 
        style={{ fontSize: '1.2em', paddingLeft: '0.85rem' }} 
        className={`card border-0 text-slim-1 text-white d-inline side-item`}
        to={ title } 
        activeClass="side-item-active"
        spy={ true }
        smooth={ true }
        duration={ 500 }
        >
            { icon }<p className={`mb-0 ${ active ? 'link-title-active' : 'link-title' }`} >{title}</p>
        </Link>
    )
}

export default SideItem;
