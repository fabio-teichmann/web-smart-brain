import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (
        <div className="ma4 mt0" >
            <Tilt className="br2 shadow-2 Tilt w-10" options={{max: 55}} >
                <div className="Tilt-inner ma2">
                    <img className="Tilt-inner" alt="logo" src={brain}/>
                </div>
            </Tilt>
        </div>
        
    )
}

export default Logo;