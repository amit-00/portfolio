import React, { Fragment } from 'react'

const Img = ({ img }) => {
    return (
        <Fragment>
            <img style={{ width: '100%', borderRadius: '5px' }} src={img} alt="project"/>
        </Fragment>
    )
}

export default Img
