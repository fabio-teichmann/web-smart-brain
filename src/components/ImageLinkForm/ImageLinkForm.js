import React from "react";
import './ImageLinkForm.css';

const ImageLinkForm = () => {
    return (
        <div>
            <p>
                {'This Magic Brain will detect faces in your pictures. Give it a try...'}

            </p>
            <div className="center">
                <div className="form center pa4 br3 shadow-5" style={{padding: '4px', boxShadow: '1px 2px 9px grey'}}>
                    <input className="f4 pa2 w-70 center" type="text" style={{width: '70%'}}/>
                    <button className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"style={{width: '30%'}}>Detect</button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm;