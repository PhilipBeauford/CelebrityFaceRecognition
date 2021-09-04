import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange, onButtonSubmit, faceName}) => {
    console.log(faceName)
    return (
        <div>
            <p className='f3 white pt3 b'>
                {'This Cool API will detect CELEBRITY faces in your pictures. Give it a try.'}
            </p>
            
            <div className='center'>
                <div className='center form grow pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-70 center' type='tex' onChange={onInputChange}/>
                    <button className= 'w-30 b grow f4 link ph3 pv2 dib white bg specific-red'
                    onClick={onButtonSubmit}
                    >DETECT</button>
                </div>
            </div>
            
            <p className='f2 light-yellow pt4 pb0 b'>
                { faceName }
            </p>
        </div>
    );
}

export default ImageLinkForm;