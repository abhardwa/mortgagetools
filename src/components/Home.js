// import "../css/style.css";
import {NavLink} from 'react-router-dom';

function Home() {
    console.log("Inside Home.js");
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
                                    <p className="main-text">Here is a quick roadmap of what to expect on this site. It is a young
                                        website that we are slowly yet steadily building out. We feel that as we develop each
                                        tool to help you with your Home buying process, we should make that tool available
                                        right away. Admitedly, the website may not look as slick as some other
                                        websites, but here you will find helpful, functional tools that give you the answers you
                                        are looking for in an easy to understand fashion. So, welcome again, and have a look
                                        around. We hope you find something useful during your visit. Happy house hunting!
                                    </p>
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
                                    </ul>
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