import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (
        <div className="ma4 mt0" style={{ margin: '10px'}}>
            <Tilt className="br2 shadow-2 Tilt" options={{max: 55}} style={{ height: '180px', width:'180px', boxShadow: '1px 2px 9px grey'}}>
                <div className="Tilt-inner" style={{padding: '3px'}}>
                    <img className="Tilt-inner" alt="logo" src={brain}/>
                </div>
            </Tilt>
        </div>
        
    )
}

export default Logo;