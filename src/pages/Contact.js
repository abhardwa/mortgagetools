import className from "classnames";
import { GoBell, GoCloudDownload, GoDatabase } from 'react-icons/go';
import Button from '../components/Button';
function Contact() {
    const myClassName = className("py-8 px-8 max-w-md mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6")
    
    const handleClick = () => {
        console.log("My first custom Button component works!");
    }
    return (
        <div className={myClassName}>
            <img className="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0" src={require("../img/sbhardwaj.jpg")} alt="Woman's Face" />
            <div className="text-center space-y-2 sm:text-left">
                <div className="space-y-0.5">
                <p className="text-3xl text-black font-semibold">
                    Shachi Bhardwaj
                </p>
                <p className="text-slate-500 font-medium mb-3 text-2xl">
                    Mortgage Banker
                </p>
                </div>
                <a href="https://banksouthmortgage.com/loan-officer/shachi-bhardwaj/" target="_blank" rel="noopener noreferrer"
                        className="text-purple-600 text-xl font-semibold">&nbsp;shachibhardwaj.com.</a>
                <Button rounded className="hidden mb-5 px-4 py-1 text-xl text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2" onClick={handleClick}>
                    <GoBell />
                    Click me!!
                </Button>
            </div>
        </div>
    )
}

export default Contact;