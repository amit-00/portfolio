import React, { Fragment } from 'react'

const Img = ({ img, isFeatured }) => {
    return (
        <Fragment>
            <img className={isFeatured ? 'transition2' : 'transition4'} style={{ width: '100%', borderRadius: '5px' }} src={img} alt="project"/>
        </Fragment>
    )
}

export default Img
