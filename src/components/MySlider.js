import React, { useState, useEffect } from 'react';
import Form from "react-bootstrap/Form";
// import RangeSlider from 'react-bootstrap-range-slider';
//USAGE: Props Used: max-> Maximum value for the slider; 
//       data(optional) ->an array of objects for which to display the bullet summary
//       minmax -> 'flex' if you want to display the min and max slider values

const Slider = (props) => {

    const [slider, setSlider] = useState({
        "value":0,
        "principal": "",
        "interest": "",
        "balance": "",
        "bulletPosition":0,
        "display": "none",
        "visibility":"visible",
        "bulletData":"",
    });

    useEffect(() =>  {
        if (props.data) {
            setSlider(slider=>({...slider, "visibility":"hidden", "display":"block"}));
        }
    
    },[]);

    const updateSlider = (e) => {
        setSlider(slider=>({...slider, "value":e.target.value<props.max?e.target.value:props.max-1}));

        const i = slider.value;
        let rows=[];

        if (props.data) {
            const dataArray = Object.entries(props.data[i]);
            for (let [key, value] of dataArray) {
                rows.push(<p key={key}>{key}:&nbsp;<span style={{color:"black", fontWeight:"700"}}>{value}</span></p>); 
            }
            setSlider(slider=>({...slider, "bulletData":rows}));
            let sliderPosition = (Number(slider.value)<props.max?Number(slider.value): props.max-1) / props.max;
            let viewportWidth = window.innerWidth;
            let bulletPosition = sliderPosition * 0.17 * viewportWidth;
            setSlider(slider=>({...slider, "bulletPosition":bulletPosition}));
            setSlider(slider=>({...slider, "display":"block"}));
            setSlider(slider=>({...slider, "visibility":"visible"}));
        }
        props.handleChange(e);
    }

  return (
        <Form.Group className="rs-range-line">
            {/* <Form.Label></Form.Label> */}
            <div className="rs-bullet" style={{display:slider.display, visibility:slider.visibility, left: slider.bulletPosition}}>
                {slider.bulletData}
            </div>
            <Form.Control
                value={slider.value}
                type = "range" 
                id="rs-range-line" 
                className="rs-range-line"
                onChange={event => updateSlider(event)}
                min={0}
                max = {props.max}
                size = 'md'
                style = {{padding:0, border:"none", outline:0}}
            />
            <div className="box-minmax" style={{display:props.minmax}}><span id="box-min">0</span><span id="box-max">{props.max}</span></div>
        </Form.Group>
    );

};
export default Slider;


