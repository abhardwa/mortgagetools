// import "../css/style.css";
import { NavLink } from "react-router-dom";
import { AiOutlineCheck } from "react-icons/ai";
// import {useEffect} from 'react';
import Rss from "../components/Rss";

function Home() {
  console.log("Inside Home.js");

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
                  <div className="">
                    <p
                      className="text-4xl md:text-7xl mb-5 font-bold"
                      style={{ display: "flex" }}
                    >
                      Welcome to{" "}
                      <span
                        className=""
                        style={{
                          display: "flex",
                          color: "var(--textColorAccent)",
                          marginLeft: "1rem",
                          marginTop: "0rem",
                        }}
                      >
                        <img
                          className="block mx-auto h-8 md:h-14 mt-1 lg:mx-0 lg:shrink-0"
                          src={require("../img/house-30-64.png")}
                          alt="MortgageToolsUSA"
                        />
                        MortgageToolsUSA
                      </span>
                    </p>
                    <p className="text-3xl md:text-5xl mb-0 font-bold">
                      A website dedicated to making the home mortgage process
                      easy and fun for the average home buyer.
                    </p>
                  </div>
                  <br></br>
                  <div className="main-text">
                    Here is a quick roadmap of what to expect on this site. It's
                    a young website that we are steadily building out. As we
                    develop a tool to help you with your Home buying process, we
                    will make it available right away. Our goal is to provide
                    you the homebuyer, with all the necessary tools to make your
                    home buying experience as smooth as possible. Following
                    tools are currently available on this website:
                    <ul>
                      <li className="flex">
                        <AiOutlineCheck className="mt-3 mr-2" />
                        <NavLink
                          className="link"
                          to="/preQual"
                          style={{ textDecoration: "none" }}
                        >
                          {" "}
                          a pre-qualification calculator that tells you how much
                          house you can Afford.
                        </NavLink>
                      </li>
                      <li className="flex">
                        <AiOutlineCheck className="mt-3 mr-2" />
                        <NavLink
                          className="link"
                          to="/amortization"
                          style={{ textDecoration: "none" }}
                        >
                          {" "}
                          an amortization schedule calculator that shows how
                          your loan gets paid off over the term of the loan.
                        </NavLink>
                      </li>
                      <li className="flex">
                        <AiOutlineCheck className="mt-3 mr-2" />
                        <NavLink
                          className="link"
                          to="/buyDown"
                          style={{ textDecoration: "none" }}
                        >
                          {" "}
                          a buy-down calculator that shows how you can benefit
                          from lower monthly payments during the first 3 years
                          with this option.
                        </NavLink>
                      </li>
                      <li className="flex">
                        <AiOutlineCheck className="mt-3 mr-2" />
                        <NavLink
                          className="link"
                          to="/escrow"
                          style={{ textDecoration: "none" }}
                        >
                          {" "}
                          an escrow amount calculator that shows how much escrow
                          funds you will need at closing.
                        </NavLink>
                      </li>
                      <li className="flex">
                        <AiOutlineCheck className="mt-3 mr-2" />
                        <NavLink
                          className="link"
                          to="/quoteanalysis"
                          style={{ textDecoration: "none" }}
                        >
                          {" "}
                          a tool that allows you to do a meaningful comparison
                          of loan quotes you have received from different
                          vendors.
                        </NavLink>
                      </li>
                      <li className="flex">
                        <AiOutlineCheck className="mt-3 mr-2" />
                        <NavLink
                          className="link"
                          to="/loancomp"
                          style={{ textDecoration: "none" }}
                        >
                          {" "}
                          A quick side by side comparison of the impact of
                          different loan terms on your monthly payment.
                        </NavLink>
                      </li>
                      <li className="flex">
                        <AiOutlineCheck className="mt-3 mr-2" />
                        <NavLink
                          className="link"
                          to="/paymentcalc"
                          style={{ textDecoration: "none" }}
                        >
                          {" "}
                          A monthly mortgage payment calculator that shows a
                          breakdown of the payment components.
                        </NavLink>
                      </li>
                    </ul>
                    We are actively working on adding more helpful tools. In the
                    meantime, welcome again, and have a look around. We hope you
                    find something useful during your visit. Happy house
                    hunting!
                  </div>
                  <div>
                    <p className="text-3xl md:text-5xl font-bold mt-4 mb-2">
                      Mortgage Market Interest Rates
                    </p>
                    <p className="main-text">
                      Interest rates for mortgages can vary significantly from
                      one borrower to the next based on the specific details of
                      the transaction. Some of the main factors that affect the
                      interest rate are credit score, down payment or
                      loan-to-value, the type of mortgage, and how long the
                      interest rate is locked.
                    </p>

                    <p className="main-text">
                      The information below depicts average rates on a national
                      level. These rates are not specific to any lender but are
                      provided to give a general idea of where rates are
                      nationally for different loan types. This information is
                      calculated from actual locked rates with customers across
                      35% of all mortgage transactions nationwide.
                    </p>
                    <div className="" style={{}}>
                      <iframe
                        loading="eager"
                        id="optimalBlue"
                        name="optimalBlue"
                        src="https://www2.optimalblue.com/OBMMI/widget.php?actbg=0284c7&amp;inactbg=bcbec0&amp;hoverBG=0284c7&amp;rate=0284c7&amp;footer=666666&amp;graph1=0284c7&amp;graph2=7dd3fc&amp;graph3=e0f2fe&amp;graph4=f0f9ff&amp;graph6=075985"
                        data-lazy-src="https://www2.optimalblue.com/OBMMI/widget.php?actbg=e67e22&amp;inactbg=bcbec0&amp;hoverBG=0284c7&amp;rate=0284c7&amp;footer=666666&amp;graph1=0284c7&amp;graph2=7dd3fc&amp;graph3=e0f2fe&amp;graph4=f0f9ff&amp;graph6=075985"
                        style={{}}
                        width="100%"
                        height="500px"
                        title="Daily Mortgage Rates"
                        sandbox="allow-scripts allow-same-origin"
                      ></iframe>
                    </div>
                  </div>
                </div>
                <div className="tools-section">
                  <h5 className="subheading centered-text text-padding-top">
                    Tools to Explore
                  </h5>
                  <ul className="tools-list">
                    <li>
                      <NavLink className="link" to="/preQual">
                        Affordability/Pre-Qualification Calculator
                      </NavLink>
                      <p className="small-text link-text">
                        How much house can you afford?
                      </p>
                    </li>
                    <li>
                      <NavLink className="link" to="/amortization">
                        Amortization Schedule
                      </NavLink>
                      <p className="small-text link-text">
                        See how your pay off loan principal and interest over
                        the life of the loan!
                      </p>
                    </li>
                    <li>
                      <NavLink className="link" to="/buyDown">
                        Temporary Buydown (3-2-1)
                      </NavLink>
                      <p className="small-text link-text">
                        This option can save you through lower payments in the
                        first 2 years!
                      </p>
                    </li>
                    <li>
                      <NavLink className="link" to="/escrow">
                        Escrow Amount Calculator
                      </NavLink>
                      <p className="small-text link-text">
                        Understand the minimum escrow amount you will need at
                        closing
                      </p>
                    </li>
                    <li>
                      <NavLink className="link" to="/quoteanalysis">
                        Quotes Comparison Guide
                      </NavLink>
                      <p className="small-text link-text">
                        A Comparison Guide to help you compare different quotes
                        side by side
                      </p>
                    </li>
                    <li>
                      <NavLink className="link" to="/loancomp">
                        Loan Sensitivity Analysis
                      </NavLink>
                      <p className="small-text link-text">
                        A side by side comparison of different loan terms
                      </p>
                    </li>
                    <li>
                      <NavLink className="link" to="/paymentcalc">
                        Monthly Mortgage Payment Calculator
                      </NavLink>
                      <p className="small-text link-text">
                        A quick breakdown of your total monthly mortgage payment
                      </p>
                    </li>
                  </ul>
                  <div
                    className="centered-text text-padding-top tracking-widest"
                    style={{
                      backgroundColor: "var(--bgColorAccent)",
                      color: "var(--textColorWhite)",
                    }}
                  >
                    <p className="text-3xl mt-4 mb-4 text-left pl-4">
                      Recent Mortgage News...
                    </p>
                  </div>
                  <div
                    className=""
                    style={{ backgroundColor: "var(--bgColorPrimary)" }}
                  >
                    <Rss
                      max={3}
                      titleOnly={true}
                      classFromParent="text-left text-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
