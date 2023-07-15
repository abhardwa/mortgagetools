import className from "classnames";
import { GoBell, GoCloudDownload, GoDatabase } from 'react-icons/go';
import Button from '../components/Button';
import {useState} from'react';
import dbData from '../components/myApi';

function Contact() {
    const [state, setState] = useState({
        name: '',
        email: '',
        subject:'',
        message:'',
    })
    const myClassName = className("py-8 px-8 max-w-lg mx-auto bg-white rounded-xl shadow-lg space-y-2 lg:py-4 lg:flex lg:items-center lg:space-y-0 lg:space-x-6")
    
    const handleClick = () => {
        console.log("My first custom Button component works!");
    }
    const handleChange = (e) => {
        setState(state => {return {...state, [e.target.id]: e.target.value}});
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!state.email || !state.name || !state.message) {
            return (alert("Please enter all required fields marked with an *"));
        }
        const userData = {
            message: `From: ${state.name} \t${state.email}\n\n` + state.message,
            subject: state.subject,
            email:state.email,
        }
        return (async ()=> {
            // console.log(userData);
            const response = await dbData ("/api/sendemail", "post", userData);
            console.log(response);
            if (response === 'ok') {
                alert("Message Sent.");
                setState(state=>{return {...state, name:'', subject: '', email: '', message: ''}})
              } else {
                alert("Message failed to send.")
              }
            return response;
        })();
    }

    return (
        <div>
            <div className="container-fluid">
                <div className="container content-area">
                    <div className="row align-items-stretch no-gutters contact-wrap">
                        <div className="col-md-12">
                            <div className="form">
                            {/* <span className="text-2xl font-bold py-8 px-8 max-w-lg mx-auto bg-white rounded-xl shadow-lg space-y-2 lg:py-4 lg:flex lg:items-center lg:space-y-0 lg:space-x-6">More details coming soon...</span> */}
                            <div className={myClassName}>
                                <img className="block mx-auto h-40 rounded-full lg:mx-0 lg:shrink-0" src={require("../img/shachiHeadShot.png")} alt="Woman's Face" />
                                <div className="text-center space-y-2 lg:text-left">
                                    <div className="space-y-0.5">
                                    <p className="text-3xl text-black tracking-wider font-semibold">
                                        Shachi Bhardwaj
                                    </p>
                                    <p className="text-slate-600 tracking-wider font-medium mb-3 text-2xl">
                                        Mortgage Banker
                                    </p>
                                    </div>
                                    <span className="text-2xl tracking-wide text-black">If you are considering purchasing a home and would like to understand better your loan options, please contact me at 
                                    <a href="https://banksouthmortgage.com/loan-officer/shachi-bhardwaj/" target="_blank" rel="noopener noreferrer"
                                            className="text-purple-600 text-2xl font-semibold">&nbsp;shachibhardwaj.com.</a><br/><br/> You can also send an email using the form on this page and we will respond within 24 hours.</span>
                                    <Button rounded className="hidden mb-5 px-4 py-1 text-xl text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2" onClick={handleClick}>
                                        <GoBell />
                                        Click me!!
                                    </Button>
                                </div>
                            </div>
                                <form className="mb-5 main-text" method="post" id="contactForm" >
                                    <h3 className='centered-text text-4xl mb-4'>Contact Us</h3>
                                    <div className="row">
                                        <div className="col-md-6 form-group mb-3">
                                            <label className="col-form-label">Name *</label>
                                            <input id='name' type="text" className="form-input " placeholder="Your name" value={state.name} onChange={handleChange} />
                                            <div style={{position: "relative !important", height: "0px !important", width: "0px !important", float: "left !important"}}></div></div>
                                                <div className="col-md-6 form-group mb-3">
                                                    <label className="col-form-label">Email *</label>
                                                    <input type="email" className="form-input" id="email" placeholder="Your email" value={state.email} onChange={handleChange}/>  
                                                </div>
                                            </div>
                                            <div className="row">
                                            <div className="col-md-12 form-group mb-3">
                                            <label className="col-form-label">Subject</label>
                                            <input type="text" className="form-input" id="subject" placeholder="A brief title" value={state.subject} onChange={handleChange}/>  
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 form-group mb-3">
                                            <label className="col-form-label">Message *</label>
                                            <textarea className="form-input" name="message" id="message" cols="30" rows="5" placeholder="Write your message here..." value={state.message} onChange={handleChange}></textarea>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 form-group">
                                            <input type="submit" value="Send Message" className="btn btn-primary rounded-2 py-2 px-4 main-text mb-96" onClick={handleSubmit}/>
                                            <span className="submitting"></span>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Contact;