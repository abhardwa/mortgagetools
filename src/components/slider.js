import React, { useState } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';

const Slider = (props) => {

  const [ value, setValue ] = useState(0); 

  return (
    <RangeSlider
      value={value}
        id="slider-simple" 
        className="slider-simple"
        onChange={changeEvent => {
            setValue(changeEvent.target.value);
            props.handleCallback(changeEvent.target.value);
        }}
      max = {24}
      size = 'sm'
    />
  );

};
export default Slider;