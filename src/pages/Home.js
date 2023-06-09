// import "../css/style.css";
import {NavLink} from 'react-router-dom';
import { AiOutlineCheck } from "react-icons/ai";
// import {useEffect} from 'react';
import Rss from '../components/Rss';

function Home() {
    console.log("Inside Home.js")

    // useEffect(() => {
    //     window.onload = ()=> {
    //         let frameElement=document.getElementById('optimalBlue');
    //         console.log(frameElement);
    //         let doc = frameElement.contentDocument;
    //         console.log(doc);
    //         doc.body.innerHTML = doc.body.innerHTML + '<style>#rates#rates {background-color:#e67e22;}</style>'
    //     }
    // }, []);

    // window.onload = ()=> {
    //     let frameElement=document.getElementById('optimalBlue');
    //     console.log(frameElement);
    //     let doc = frameElement.contentDocument;
    //     doc.body.innerHTML = doc.body.innerHTML + '<style>.nav-tabs>li.active>a, .nav-tabs>li.active>a:focus, .nav-tabs>li.active>a:hover {background-color:#e67e22;}</style>'
    // }

    return (
        <div id="home" className="tabcontent">
            <div className="container-fluid">
                <div className="container">
                    <div className="row">
                        <div className="site-container">
                            
                            <div id="" className="home-grid">
                                <hr></hr>
                                <div className="content-section">
                                    <h3 className="heading-primary">Welcome to <span className = "brand-name">MortgageToolsUSA</span></h3>
                                    <h4 className="heading-tertiary">A website dedicated to making the home mortgage process
                                        easy
                                        and fun for the average home buyer.</h4>
                                    <br></br>
                                    <div className="main-text">Here is a quick roadmap of what to expect on this site. It's a young
                                        website that we are steadily building out. As we develop a tool to help you with your Home buying process, we will make it available
                                        right away. Our goal is to provide you the homebuyer, with all the necessary tools to make your home buying experience as smooth as possible. 
                                        Following tools are currently available on this website:
                                        <ul><li className="flex" ><AiOutlineCheck className='mt-3 mr-2'/><NavLink  className="link" to="/preQual"  style={{textDecoration:'none'}}> a pre-qualification calculator that tells you how much house you can Afford.</NavLink>
                                            </li>
                                            <li className="flex"><AiOutlineCheck className='mt-3 mr-2'/><NavLink  className="link" to="/amortization" style={{textDecoration:'none'}}> an amortization schedule calculator that shows how your loan gets paid off over the term of the loan.</NavLink>
                                            </li>
                                            <li className="flex"><AiOutlineCheck className='mt-3 mr-2'/><NavLink className="link" to="/buyDown" style={{textDecoration:'none'}}> a buy-down calculator that shows how you can benefit from lower monthly payments during first 2 years with this option.</NavLink>
                                            </li>
                                            <li className="flex"><AiOutlineCheck className='mt-3 mr-2'/><NavLink  className="link" to="/escrow" style={{textDecoration:'none'}}> an escrow amount calculator that shows how much escrow funds you will need at closing.</NavLink>
                                            </li>
                                            <li className="flex"><AiOutlineCheck className='mt-3 mr-2'/><NavLink  className="link" to="/quoteanalysis" style={{textDecoration:'none'}}> a tool that alows you to do a meaningful comparison of loan quotes you have received from different vendors.</NavLink> 
                                            </li>
                                        </ul>
                                        We are actively working on adding more helpful tools. In the meantime, welcome again, and have a look around. We hope you find something useful during your visit. Happy house hunting!
                                    </div>
                                    <div>
                                        <p className="heading-tertiary mt-4 mb-2">Mortgage Market Interest Rates</p>
                                        <p  className="main-text">Interest rates for mortgages can vary significantly from one borrower to the next based on 
                                            the specific details of the transaction. Some of the main factors that affect the interest 
                                            rate are credit score, down payment or loan-to-value, the type of mortgage, and how long 
                                            the interest rate is locked.</p>

                                        <p className="main-text">The information below depicts average rates on a national level. These rates are not specific
                                             to any lender but are provided to give a general idea of where rates are nationally for 
                                             different loan types. This information is calculated from actual locked rates with customers 
                                             across 35% of all mortgage transactions nationwide.</p>
                                        <div className="" style={{}}>
                                            <iframe loading="eager" id='optimalBlue' name='optimalBlue' src="https://www2.optimalblue.com/OBMMI/widget.php?actbg=e67e22&amp;inactbg=bcbec0&amp;hoverBG=e67e22&amp;rate=5e5c5c&amp;footer=666666&amp;graph1=e67e22&amp;graph2=fae5d3&amp;graph3=184742&amp;graph4=bcbec0&amp;graph6=004bf3"  
                                                data-lazy-src="https://www2.optimalblue.com/OBMMI/widget.php?actbg=e67e22&amp;inactbg=bcbec0&amp;hoverBG=e67e22&amp;rate=822636&amp;footer=666666&amp;graph1=e67e22&amp;graph2=fae5d3&amp;graph3=184742&amp;graph4=bcbec0&amp;graph6=004bf3"
                                                style={{}} width='100%' height='500px' title='Daily Mortgage Rates' sandbox='allow-scripts allow-same-origin' 
                                                >
                                            </iframe>
                                        </div>

                                    </div>
                                </div>
                                <div className="tools-section">
                                    <h5 className="subheading centered-text text-padding-top">Tools to Explore</h5>
                                    <ul className="tools-list">
                                        <li><NavLink  className="link" to="/preQual">Affordability/Pre-Qualification Calculator</NavLink>
                                            <p className="small-text link-text">
                                                How
                                                much house
                                                can you
                                                afford?</p>
                                        </li>
                                        <li><NavLink  className="link" to="/amortization">Amortization Schedule</NavLink>
                                            <p className="small-text link-text">See how
                                                your
                                                pay off loan principal and interest 
                                                over the life of the loan!</p>
                                        </li>
                                        <li><NavLink className="link" to="/buyDown">2-1 Buydown</NavLink>
                                            <p className="small-text link-text">This option can save you through lower payments in
                                                the first 2
                                                years!</p>
                                        </li>
                                        <li><NavLink  className="link" to="/escrow">Escrow Amount Calculator</NavLink>
                                            <p className="small-text link-text">Understand the minimum
                                                escrow amount you will need
                                                at closing</p>
                                        </li>
                                        <li><NavLink  className="link" to="/quoteanalysis">Quotes Comparison Guide</NavLink>
                                            <p className="small-text link-text">A Comparison Guide to help you compare different quotes side by side</p>
                                        </li>
                                    </ul>
                                    <div className='bg-orange-500 centered-text text-padding-top text-white tracking-widest'>
                                        <p className="text-3xl mt-4 mb-4 text-left pl-4">Recent Mortgage News...</p>
                                    </div>
                                    <div className='bg-slate-200'>
                                        <Rss max={3} titleOnly={true} classFromParent='text-left text-2xl'/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;