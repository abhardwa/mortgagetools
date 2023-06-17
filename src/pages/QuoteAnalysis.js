import { useState, useEffect, useRef } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { qRecord} from "../components/quoteStates";
import { twMerge } from "tailwind-merge";
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../components/userSlice';
import axios from 'axios';
import Login from './login';
import {auth} from '../firebase_setup/firebase';
import { url } from '../components/url';
import classNames from "classnames";

function QuoteAnalysis() {
    const [data, setData] = useState({q1:{...qRecord},q2:{...qRecord},q3:{...qRecord},q4:{...qRecord}});
    const [q, setQ] = useState("q1");
    const [key, setKey] = useState("2");
    const [state, setState] = useState(false);
    const savedDataRef = useRef('');
    const outTemplate = {
        lenderFees:0,
        titleFees:0,
        govTaxFees:0,
        prepaidTotal:0,
        escrowTotal:0,
        HOATotal:0,
        totalCosts:0,
        totalNormalizedCosts:0,
        totalDiff:0,
    };
    const out = {
        q1: {...outTemplate},
        q2: {...outTemplate},
        q3: {...outTemplate},
        q4: {...outTemplate},  
    }
    //Following fields can change in Normalized view
    const quote = {
        originationFees: 0,
        discountPoint: 0,
        processingFees: 0,
        underwritingFees: 0,
        adminstrationFee: 0,
        documentReviewFee: 0,
        applicationFee: 0,
        appraisalFee: 0,
        appraisalRushFee: 0,
        NCFinalInspectionFee: 0,
        creditReportFee: 0,
        floodCertification: 0,
        taxServiceCharge: 0,
        mortgageElectronicRegSystem: 0,
        builderCredit:0,
        lenderCredit:0,
    }

    const legendClass1="shadow-lg border-3 rounded-xl text-base md:text-2xl/[2.5rem] tracking-wide text-center align-top mt-[40px] font-light bg-blue-900  text-white ";
    const legendClass2="shadow-lg border-3 rounded-xl text-base md:text-2xl/[2.5rem] tracking-wide text-center align-top mt-[20px] font-normal bg-orange-100  text-slate-950 ";
    const legendClass3="shadow-lg border-3 rounded-xl text-base md:text-2xl/[2.5rem] tracking-wide text-center align-top mt-[20px] font-normal bg-green-300  text-slate-950 ";
    
    const cellClass= "text-base md:text-2xl text-right";
    const lHeadingClass="mt-[0rem] text-base md:text-4xl/[4rem] text-center font-bold";
    const lHeadingClass2="mt-[2rem] text-base md:text-4xl/[4rem] text-center font-bold";
    const subtotalClass="shadow-md border-2 rounded-xl text-base md:text-3xl/[2.5rem] tracking-wide text-right align-top mt-[40px] bg-gray-500  text-white ";
    const totalClass="shadow-md border-2 rounded-xl text-base md:text-4xl/[2.5rem] tracking-wide text-right align-top mt-[40px] bg-gray-600  text-white ";
    const diffClass="shadow-md border-2 rounded-xl text-base md:text-4xl/[2.5rem] tracking-wide text-right align-top mt-[40px] bg-slate-200 text-white  ";
        
    const q1Class = "bg-orange-100 text-base md:text-3xl text-center";
    const q2Class = "bg-orange-200 text-base md:text-3xl text-center";
    const q3Class = "bg-orange-300 text-base md:text-3xl text-center";
    const q4Class = "bg-orange-400 text-base md:text-3xl text-center";
    const dClass = "bg-gray-200 text-base md:text-3xl text-center";

    const catDescriptions = {
        loanInfo:"",
        lenderFees:"These fees are lender dependent. Lenders may list these fees under different labels. Not all fees will be listed by every lender. ",
        titleFees:"These fees are dependent on the closing attorney and will be same for all lenders. For new construction the builder decides the closing attorney. A resale contract will also specify the closing attorney. These fees will be same across all the lenders you are comparing since the closing attorney will be the same, irrespective of which lender you go with.",
        govTaxFees:"These are standard state and county fees that will stay the same for all lenders you are comparing.",
        estPrepaid:"The insurance premium will depend on the policy you pick. Per diem interest will depend on your closing date. These fees will remain the same across all the lenders you are comparing, since the insurance premium and per diem interest are determined by the aforementioned factors and not the lender.",
        escrowDeposit:"The account is established for you by your lender at a purchase/refinance closing when you take out a home mortgage. You'll begin funding your escrow accounts by making an initial deposit into the account at closing. A federally mandated formula is used to figure out exactly how much money is needed to satisfy this initial deposit into the escrow account. You can use https://mortgagetoolsusa.com/escrow to get an estimate of the funds that will be deposited in the escrow account.",
        HOADues:"You will be responsible for these fees if your home is part of a Home Owner's association/condo association. These fees will be the same across all the lenders you are comparing since these are determined by the Homeowners/Condo Association for your property.",
        credits:"Enter if your Builder/Lender has offered a credit towards closing costs."
    }
    
    const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

    let user = useSelector(selectUser);
    const dispatch = useDispatch();

    const dbData = async (type, arg, userData) => {
        // const url="https://abhardwa.pythonanywhere.com";
        // const url="http://127.0.0.1:5000";        
        setState('pending');
        try {
            if (type==='get') {
                const response = await axios.get(url+arg);
            // console.log(response.data);
            // console.log(response.status);
            // console.log(response.statusText);
            // console.log(response.headers);
            // console.log(response.config);
              return response.data;
            } else {
                const response = await axios.post(url+arg, userData);
                return response.data;
            }
        } catch (error) {
            setState('error');
            console.error(error);
            return null;
        }
        
    }
    useEffect( () => {
        // console.log("inside useEffect 1");
        setData(data => {
            return {...data, q2:{...data.q2, ...quote}};
        });
        setData(data => {
            return {...data, q3:{...data.q3,...quote}};
        });
        setData(data => {
            return {...data, q4:{...data.q4,...quote}};
        });

    },[])

    useEffect( () => {
        // console.log("inside useEffect for user");
        const serverData = async() => {
            if (user) {
                // console.log(user);
                const arg = "/api/getqa?" + "email=" + user.email + "&dataType=qa";
                // console.log(arg);
                const response = await dbData ("get", arg);
                // console.log(response);
                savedDataRef.current = response;
                // console.log(savedDataRef.current);
                setState(!state);
                return response;
            } else
                return '';
        };
        serverData();
    },[user])

    const serverData = async() => {
        if (user) {
            // console.log(user);
            const arg = "/api/getqa?" + "email=" + user.email + "&dataType=qa";
            // console.log(arg);
            const response = await dbData ("get", arg);
            // console.log(response);
            savedDataRef.current = response;
            return response;
        } else
            return '';
    };

    const btnSubClass = "h-16 text-3xl font-semibold self-centerrounded-2xl shadow-md hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 active:outline-none active:ring-1 active:ring-blue-600 active:ring-offset-1";

    const saveOption = () => {
        return !user ? <button className={classNames("w-96  bg-slate-200", btnSubClass)} onClick={handleLogin}>Login to Save your Data</button>: 
            <button className={classNames("w-80  bg-green-200", btnSubClass )} onClick={handleSave}>Save Data</button>

    }

    const LoadOption = () => {
        // console.log('inside Loadoption:');
        // console.log(savedDataRef.current);

        if (savedDataRef.current) {
            return <button className={classNames( "w-80  bg-blue-200", btnSubClass)} onClick={handleDataLoad}>Load Saved Data</button>
        } else {
            return'';
        }
    }

    function compareQuotes () {

        Object.keys(data).forEach(obj=> {
            out[obj].lenderFees=
                // data[obj].PI +
                data[obj].originationFees +
                data[obj].discountPoint +
                data[obj].processingFees +
                data[obj].underwritingFees +
                data[obj].adminstrationFee +
                data[obj].documentReviewFee +
                data[obj].applicationFee +
                data[obj].appraisalFee +
                data[obj].appraisalRushFee +
                data[obj].NCFinalInspectionFee +
                data[obj].creditReportFee +
                data[obj].floodCertification +
                data[obj].taxServiceCharge +
                data[obj].mortgageElectronicRegSystem;

            out[obj].titleFees=
                data[obj].SettlementFee +
                data[obj].titleSearchFee +
                data[obj].titleBinder +
                data[obj].closingProtectionLetter +
                data[obj].docPrepFee +
                data[obj].ownerTitleInsurance +
                data[obj].lenderTitleInsurance +
                data[obj].additionalTitleFees;

            out[obj].govTaxFees=
                data[obj].govRecordingFees +
                data[obj].deedTransferTax +
                data[obj].mortgageTransferTax +
                data[obj].GAResMgageActPerLoanFee +
                data[obj].eRecordingFee; 

            out[obj].prepaidTotal=
                data[obj].interestDue +
                data[obj].firstYearHomeownerInsPremium;

            out[obj].escrowTotal=
                data[obj].homeownerIns +
                data[obj].countyPropTax +
                data[obj].cityPropTax;

            out[obj].HOATotal=
                data[obj].HOAInitiationDues +
                data[obj].ProratedHOADues +
                data[obj].HOAClosingLetter +
                data[obj].HOACapitalContr;
            
            out[obj].creditTotal=
                data[obj].builderCredit +
                data[obj].lenderCredit;

            out[obj].totalCosts=out[obj].lenderFees+out[obj].titleFees+out[obj].govTaxFees+out[obj].prepaidTotal+out[obj].escrowTotal+out[obj].HOATotal-out[obj].creditTotal;
            out[obj].totalNormalizedCosts=out[obj].lenderFees+out.q1.titleFees+out.q1.govTaxFees+out.q1.prepaidTotal+out.q1.escrowTotal+out.q1.HOATotal-out[obj].creditTotal;
            out[obj].totalDiff=out["q1"].totalNormalizedCosts-out[obj].totalNormalizedCosts
        });
            // console.log(out.q1);
    }

    compareQuotes(q);
    const q1DiffClass = "text-green-600";
    const q2DiffClass = out.q1.totalNormalizedCosts>=out.q2.totalNormalizedCosts?"text-green-600":"text-rose-500";
    const q3DiffClass = out.q1.totalNormalizedCosts>=out.q3.totalNormalizedCosts?"text-green-600":"text-rose-500";
    const q4DiffClass = out.q1.totalNormalizedCosts>=out.q4.totalNormalizedCosts?"text-green-600":"text-rose-500";

    const handleChange = (e) => {
        // const table = e.target.parentElement.parentElement.parentElement.parentElement;
        // if (table) {
        //     console.log(table.id);
        // }
        
        // Since Data is a 2 level deep object, we need to first spread the top level and then the nested level
        if (e.target.id.slice(0,2)==='q1') {
            setData(data => {
                return {
                ...data, q1:{...data.q1,[e.target.id.slice(3)]:Number(e.target.value)}}
            });
        } else if (e.target.id.slice(0,2)==='q2') {
            setData(data => {
                return {
                ...data, q2:{...data.q2,[e.target.id.slice(3)]:Number(e.target.value)}
                }
            });
        } else if (e.target.id.slice(0,2)==='q3') {
            setData(data => {
                return {
                ...data, q3:{...data.q3,[e.target.id.slice(3)]:Number(e.target.value)}
                }
            });
        }
         else if (e.target.id.slice(0,2)==='q4') {
            setData(data => {
                return {
                ...data, q4:{...data.q4,[e.target.id.slice(3)]:Number(e.target.value)}
                }
            });
        }
        setQ(e.target.id.slice(0,2));
    };

    const handleSelect = (e, newKey) => {
        e.target==="button"&&e.preventDefault();
        setKey(newKey);
        // console.log(key, e);
    };
    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => {
    setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLogin = () => {
        setShowModal(true);
    };    

    // Add logic to login. Render the Login component
    const loginFlag = showModal? <Login action="login"  show={showModal}  handleOpen={handleOpenModal} handleClose={handleCloseModal}/>: "";
    
    const handleSave = (e) =>{
        e.preventDefault();
        return (async ()=> {
            const userData = {
                data: data,
                uname: auth.currentUser.displayName,
                email:auth.currentUser.email,
                dataType: "qa",
            }
            // console.log(userData);
            const response = await dbData ("post", "/api/save", userData);
            return response;
        })();
        // Add logic to call Python API with a POST transaction
    };

    const handleDataLoad = (e) =>{
        e.preventDefault();
        const savedData= async() => {
            savedDataRef.current = await serverData();
            // console.log(savedDataRef.current);
            if (savedDataRef.current) {
                setData(data => {
                    return {...data, q1:{...data.q1,...savedDataRef.current.q1}};
                });
                setData(data => {
                    return {...data, q2:{...data.q2,...savedDataRef.current.q2}};
                });
                setData(data => {
                    return {...data, q3:{...data.q3,...savedDataRef.current.q3}};
                });
                setData(data => {
                    return {...data, q4:{...data.q4,...savedDataRef.current.q4}};
                });
            };
        }
        savedData();
    };

    return (
            <div id="quoteAnalysis" className="tabcontent">
            <div className="container-fluid">
                <div className="container">
                    <div className="row">
                        <div className="site-container">
                            <div id="">
                                <div className="content-area">
                                    <h3 className="heading-primary centered-text">Closing Costs Analysis</h3>
                                    <h4 className="heading-tertiary centered-text">A Comparison Guide to help you compare different quotes side by side</h4>
                                    <br></br>
                                    <p className="main-text max-text-box"><b>Congratulations!!!</b> You have found your dream home and have also done your due diligence
                                    to request quotes from different lenders. Now you need to evaluate them and pick the best quote. </p>
                                    <p className="main-text max-text-box">The challenge with this task, as you may have already realized, is that quotes from different vendors can look different - 
                                    different line items organized in different order. Certain items may be rolled into a lump sum in some cases, or labeled 
                                    differently.</p>
                                    <p className="main-text max-text-box">This comparison guide tries to make the task a little easier by providing you with a consistent structure for all cost items, 
                                    combined with a side-by-side view that allows an easy comparison of different quotes.</p>
                                    <p className="main-text max-text-box"> You can enter upto 4 quotes below and see how they compare. As you enter the quotes, you will realize that some items may not
                                     be called by that exact name here. No worries, as you can always tell which of the broader categories (listed on the left) that 
                                     item belongs to. Just enter the number in one of the listed items in that category. </p>
                                    <p className="main-text max-text-box"> To further help you do an apples-to-apples comparison, 2 views of the quotes
                                    are provided here. The first and default view shows the original information you have entered. 
                                    The second "Normalized" view is accessed by clicking on the 'Normalized' tab. On this view, cost items
                                    that will remain the same across all lenders(title fees, government taxes & fees, escrow/pre-paids, and HOA/Condo dues) 
                                    regardless of the lender you pick, are normalized. This allows you to isolate and focus on the lender specific costs on each quote. 
                                    </p>
                                    <p className="main-text max-text-box">Hope this normalized comparison guide helps you make a smart decision!</p>
                                </div>
                                <div className="relative mb-12 -mr-48">
                                        <div className = "flex w-6/12 mr-4"><span className = "mr-4">{LoadOption()}</span><span>{saveOption()}</span></div>
                                        {loginFlag}
                                </div>
                                        <Tabs activeKey={key} onSelect={(event) => handleSelect(event)}style={{fontSize:"2rem", fontWeight:"700"}}>
                                            <Tab eventKey="1" title="Original">
                                                
                                                <table style={{width: "100%", tableLayout:"fixed"}} id="originalTbl" className="gap-8">
                                                    <colgroup>
                                                    <col span="1" style={{width:"30%", overflow:"hidden"}}></col>
                                                    <col span="1" className={dClass} style={{width:"22%", overflow:"hidden"}}></col>
                                                    <col span="1" className={q1Class} style={{width:"12%", overflow:"hidden"}}></col>
                                                    <col span="1" className={q2Class} style={{width:"12%", overflow:"hidden"}}></col>
                                                    <col span="1" className={q3Class} style={{width:"12%", overflow:"hidden"}}></col>
                                                    <col span="1" className={q4Class} style={{width:"12%", overflow:"hidden"}}></col>
                                                    </colgroup>
                                                    <thead>
                                                        <tr >
                                                            <th className="text-base md:text-3xl text-center">About these items</th>
                                                            <th className="text-base md:text-3xl text-right">Item Description</th>                                              
                                                            <th className={q1Class}>BankSouth Quote</th>
                                                            <th className={q2Class}>Quote 1</th>
                                                            <th className={q3Class}>Quote 2</th>
                                                            <th className={q4Class} >Quote 3</th>
                                                
                                                        </tr>
                                                    </thead>
                                                    <tbody className={cellClass}>
                                                        <tr className="">
                                                            <td rowSpan="15" className={legendClass1}><div className={lHeadingClass2}>Lender Fees </div>{catDescriptions.lenderFees}</td>
                                                            
                                                            <td>Origination Fees</td>
                                                            <td><input id="q1-originationFees" className="" value={data.q1.originationFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-originationFees" className="" value={data.q2.originationFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-originationFees" className="" value={data.q3.originationFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-originationFees" className="" value={data.q4.originationFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Discount Points</td>
                                                            <td><input id="q1-discountPoint" className="" value={data.q1.discountPoint||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-discountPoint" className="" value={data.q2.discountPoint||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-discountPoint" className="" value={data.q3.discountPoint||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-discountPoint" className="" value={data.q4.discountPoint||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Processing Fees</td>
                                                            <td><input id="q1-processingFees" className="" value={data.q1.processingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-processingFees" className="" value={data.q2.processingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-processingFees" className="" value={data.q3.processingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-processingFees" className="" value={data.q4.processingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Underwriting Fees</td>
                                                            <td><input id="q1-underwritingFees" className="" value={data.q1.underwritingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-underwritingFees" className="" value={data.q2.underwritingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-underwritingFees" className="" value={data.q3.underwritingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-underwritingFees" className="" value={data.q4.underwritingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Adminstration Fee</td>
                                                            <td><input id="q1-adminstrationFee" className="" value={data.q1.adminstrationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-adminstrationFee" className="" value={data.q2.adminstrationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-adminstrationFee" className="" value={data.q3.adminstrationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-adminstrationFee" className="" value={data.q4.adminstrationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Document Review Fee</td>
                                                            <td><input id="q1-documentReviewFee" className="" value={data.q1.documentReviewFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-documentReviewFee" className="" value={data.q2.documentReviewFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-documentReviewFee" className="" value={data.q3.documentReviewFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-documentReviewFee" className="" value={data.q4.documentReviewFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Application Fee</td>
                                                            <td><input id="q1-applicationFee" className="" value={data.q1.applicationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-applicationFee" className="" value={data.q2.applicationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-applicationFee" className="" value={data.q3.applicationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-applicationFee" className="" value={data.q4.applicationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Appraisal Fee</td>
                                                            <td><input id="q1-appraisalFee" className="" value={data.q1.appraisalFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-appraisalFee" className="" value={data.q2.appraisalFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-appraisalFee" className="" value={data.q3.appraisalFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-appraisalFee" className="" value={data.q4.appraisalFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Appraisal RUSH Fee (optional)</td>
                                                            <td><input id="q1-appraisalRushFee" className="" value={data.q1.appraisalRushFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-appraisalRushFee" className="" value={data.q2.appraisalRushFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-appraisalRushFee" className="" value={data.q3.appraisalRushFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-appraisalRushFee" className="" value={data.q4.appraisalRushFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Appraisal Final Inspection Fee (New Constr.)</td>
                                                            <td><input id="q1-NCFinalInspectionFee" className="" value={data.q1.NCFinalInspectionFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-NCFinalInspectionFee" className="" value={data.q2.NCFinalInspectionFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-NCFinalInspectionFee" className="" value={data.q3.NCFinalInspectionFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-NCFinalInspectionFee" className="" value={data.q4.NCFinalInspectionFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>  
                                                        <tr>
                                                            <td>Credit Report Fees</td>
                                                            <td><input id="q1-creditReportFee" className="" value={data.q1.creditReportFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-creditReportFee" className="" value={data.q2.creditReportFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-creditReportFee" className="" value={data.q3.creditReportFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-creditReportFee" className="" value={data.q4.creditReportFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Flood Certification</td>
                                                            <td><input id="q1-floodCertification" className="" value={data.q1.floodCertification||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-floodCertification" className="" value={data.q2.floodCertification||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-floodCertification" className="" value={data.q3.floodCertification||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-floodCertification" className="" value={data.q4.floodCertification||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Tax Service Charge</td>
                                                            <td><input id="q1-taxServiceCharge" className="" value={data.q1.taxServiceCharge||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-taxServiceCharge" className="" value={data.q2.taxServiceCharge||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-taxServiceCharge" className="" value={data.q3.taxServiceCharge||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-taxServiceCharge" className="" value={data.q4.taxServiceCharge||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Mortgage Electronic Registration System</td>
                                                            <td><input id="q1-mortgageElectronicRegSystem" className="" value={data.q1.mortgageElectronicRegSystem||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-mortgageElectronicRegSystem" className="" value={data.q2.mortgageElectronicRegSystem||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-mortgageElectronicRegSystem" className="" value={data.q3.mortgageElectronicRegSystem||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-mortgageElectronicRegSystem" className="" value={data.q4.mortgageElectronicRegSystem||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr className={subtotalClass}>
                                                            <td className="text-white">Lender Fees</td>
                                                            <td id="q1-lenderFees" className="text-white">{currency.format(out.q1.lenderFees)}</td>
                                                            <td id="q2-lenderFees" className="text-white">{currency.format(out.q2.lenderFees)}</td>
                                                            <td id="q3-lenderFees" className="text-white">{currency.format(out.q3.lenderFees)}</td>
                                                            <td id="q4-lenderFees" className="text-white">{currency.format(out.q4.lenderFees)}</td>
                                                        </tr>
                                                        <tr className="h-8"></tr>
                                                        <tr>
                                                            <td rowSpan='9' className={legendClass2}><div className={lHeadingClass}>Title Fees</div>{catDescriptions.titleFees}</td>
                                                            <td>Attorney/Settlement Fee</td>
                                                            <td><input id="q1-SettlementFee" className="" value={data.q1.SettlementFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-SettlementFee" className="" value={data.q2.SettlementFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-SettlementFee" className="" value={data.q3.SettlementFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-SettlementFee" className="" value={data.q4.SettlementFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Title Search Fee</td>
                                                            <td><input id="q1-titleSearchFee" className="" value={data.q1.titleSearchFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-titleSearchFee" className="" value={data.q2.titleSearchFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-titleSearchFee" className="" value={data.q3.titleSearchFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-titleSearchFee" className="" value={data.q4.titleSearchFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Title Binder</td>
                                                            <td><input id="q1-titleBinder" className="" value={data.q1.titleBinder||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-titleBinder" className="" value={data.q2.titleBinder||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-titleBinder" className="" value={data.q3.titleBinder||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-titleBinder" className="" value={data.q4.titleBinder||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Closing Protection Letter</td>
                                                            <td><input id="q1-closingProtectionLetter" className="" value={data.q1.closingProtectionLetter||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-closingProtectionLetter" className="" value={data.q2.closingProtectionLetter||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-closingProtectionLetter" className="" value={data.q3.closingProtectionLetter||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-closingProtectionLetter" className="" value={data.q4.closingProtectionLetter||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Doc Prep Fee</td>
                                                            <td><input id="q1-docPrepFee" className="" value={data.q1.docPrepFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-docPrepFee" className="" value={data.q2.docPrepFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-docPrepFee" className="" value={data.q3.docPrepFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-docPrepFee" className="" value={data.q4.docPrepFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Owner's Title Insurance (Optional)</td>
                                                            <td><input id="q1-ownerTitleInsurance" className="" value={data.q1.ownerTitleInsurance||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-ownerTitleInsurance" className="" value={data.q2.ownerTitleInsurance||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-ownerTitleInsurance" className="" value={data.q3.ownerTitleInsurance||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-ownerTitleInsurance" className="" value={data.q4.ownerTitleInsurance||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>   
                                                        <tr>
                                                            <td>Lender's Title Insurance </td>
                                                            <td><input id="q1-lenderTitleInsurance" className="" value={data.q1.lenderTitleInsurance||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-lenderTitleInsurance" className="" value={data.q2.lenderTitleInsurance||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-lenderTitleInsurance" className="" value={data.q3.lenderTitleInsurance||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-lenderTitleInsurance" className="" value={data.q4.lenderTitleInsurance||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Any Additional Title Fees</td>
                                                            <td><input id="q1-additionalTitleFees" className="" value={data.q1.additionalTitleFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-additionalTitleFees" className="" value={data.q2.additionalTitleFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-additionalTitleFees" className="" value={data.q3.additionalTitleFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-additionalTitleFees" className="" value={data.q4.additionalTitleFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr className={subtotalClass}>
                                                            <td className="text-white text-bold">Title Fees</td>
                                                            <td id="q1-titleFees" className="text-white text-bold">{currency.format(out.q1.titleFees)}</td>
                                                            <td id="q2-titleFees" className="text-white text-bold">{currency.format(out.q2.titleFees)}</td>
                                                            <td id="q3-titleFees" className="text-white text-bold">{currency.format(out.q3.titleFees)}</td>
                                                            <td id="q4-titleFees" className="text-white text-bold">{currency.format(out.q4.titleFees)}</td>
                                                        </tr>  
                                                        <tr className="h-8"></tr>  
                                                        <tr>
                                                            <td rowSpan="6"  className={legendClass2}><div className={lHeadingClass}>Government Fees</div>{catDescriptions.govTaxFees}</td>
                                                            <td>Government Recording Fees</td>
                                                            <td><input id="q1-govRecordingFees" className="" value={data.q1.govRecordingFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-govRecordingFees" className="" value={data.q2.govRecordingFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-govRecordingFees" className="" value={data.q3.govRecordingFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-govRecordingFees" className="" value={data.q4.govRecordingFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Deed Transfer Tax</td>
                                                            <td><input id="q1-deedTransferTax" className="" value={data.q1.deedTransferTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-deedTransferTax" className="" value={data.q2.deedTransferTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-deedTransferTax" className="" value={data.q3.deedTransferTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-deedTransferTax" className="" value={data.q4.deedTransferTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Mortgage Transfer Tax/Intangible Tax</td>
                                                            <td><input id="q1-mortgageTransferTax" className="" value={data.q1.mortgageTransferTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-mortgageTransferTax" className="" value={data.q2.mortgageTransferTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-mortgageTransferTax" className="" value={data.q3.mortgageTransferTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q1-mortgageTransferTax" className="" value={data.q4.mortgageTransferTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>GA Residential Mortgage Act Per Loan Fee</td>
                                                            <td><input id="q1-GAResMgageActPerLoanFee" className="" value={data.q1.GAResMgageActPerLoanFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-GAResMgageActPerLoanFee" className="" value={data.q2.GAResMgageActPerLoanFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-GAResMgageActPerLoanFee" className="" value={data.q3.GAResMgageActPerLoanFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-GAResMgageActPerLoanFee" className="" value={data.q4.GAResMgageActPerLoanFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>eRecording Fee</td>
                                                            <td><input id="q1-eRecordingFee" className="" value={data.q1.eRecordingFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-eRecordingFee" className="" value={data.q2.eRecordingFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-eRecordingFee" className="" value={data.q3.eRecordingFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-eRecordingFee" className="" value={data.q4.eRecordingFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr className={subtotalClass}>
                                                            <td className="text-white text-bold">Government Taxes and Fees</td>
                                                            <td id="q1-govTaxFees" className="text-white text-bold">{currency.format(out.q1.govTaxFees)}</td>
                                                            <td id="q2-govTaxFees" className="text-white text-bold">{currency.format(out.q2.govTaxFees)}</td>
                                                            <td id="q3-govTaxFees" className="text-white text-bold">{currency.format(out.q3.govTaxFees)}</td>
                                                            <td id="q4-govTaxFees" className="text-white text-bold">{currency.format(out.q4.govTaxFees)}</td>
                                                        </tr>
                                                        <tr className="h-8"></tr>
                                                        <tr>
                                                            <td rowSpan='3'  className={legendClass2}><div className={lHeadingClass}>Estimated Pre-paid Items</div>{catDescriptions.estPrepaid}</td>
                                                            <td>Interest due ( from closing date until month end)</td>
                                                            <td><input id="q1-interestDue" className="" value={data.q1.interestDue||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-interestDue" className="" value={data.q2.interestDue||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-interestDue" className="" value={data.q3.interestDue||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-interestDue" className="" value={data.q4.interestDue||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>First Year Homeowner's Insurance Premium</td>
                                                            <td><input id="q1-firstYearHomeownerInsPremium" className="" value={data.q1.firstYearHomeownerInsPremium||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-firstYearHomeownerInsPremium" className="" value={data.q2.firstYearHomeownerInsPremium||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-firstYearHomeownerInsPremium" className="" value={data.q3.firstYearHomeownerInsPremium||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-firstYearHomeownerInsPremium" className="" value={data.q4.firstYearHomeownerInsPremium||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr className={subtotalClass}>
                                                            <td className="text-white text-bold">Estimated Pre-paid Items</td>
                                                            <td id="q1-prepaidTotal" className="text-white text-bold">{currency.format(out.q1.prepaidTotal)}</td>
                                                            <td id="q2-prepaidTotal" className="text-white text-bold">{currency.format(out.q2.prepaidTotal)}</td>
                                                            <td id="q3-prepaidTotal" className="text-white text-bold">{currency.format(out.q3.prepaidTotal)}</td>
                                                            <td id="q4-prepaidTotal" className="text-white text-bold">{currency.format(out.q4.prepaidTotal)}</td>
                                                        </tr>
                                                        <tr className="h-8"></tr>
                                                        <tr>
                                                            <td rowSpan='4'  className={legendClass2}><div className={lHeadingClass}>Escrow Items</div>{catDescriptions.escrowDeposit}</td>
                                                            <td>Homeowner's Insurance</td>
                                                            <td><input id="q1-homeownerIns" className="" value={data.q1.homeownerIns||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-homeownerIns" className="" value={data.q2.homeownerIns||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-homeownerIns" className="" value={data.q3.homeownerIns||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-homeownerIns" className="" value={data.q4.homeownerIns||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>County Property Taxes</td>
                                                            <td><input id="q1-countyPropTax" className="" value={data.q1.countyPropTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-countyPropTax" className="" value={data.q2.countyPropTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-countyPropTax" className="" value={data.q3.countyPropTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-countyPropTax" className="" value={data.q4.countyPropTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>City Property Taxes</td>
                                                            <td><input id="q1-cityPropTax" className="" value={data.q1.cityPropTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-cityPropTax" className="" value={data.q2.cityPropTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-cityPropTax" className="" value={data.q3.cityPropTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-cityPropTax" className="" value={data.q4.cityPropTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr className={subtotalClass}>
                                                            <td className="text-white text-bold">Escrow Items</td>
                                                            <td id="q1-escrowTotal" className="text-white text-bold">{currency.format(out.q1.escrowTotal)}</td>
                                                            <td id="q2-escrowTotal" className="text-white text-bold">{currency.format(out.q2.escrowTotal)}</td>
                                                            <td id="q3-escrowTotal" className="text-white text-bold">{currency.format(out.q3.escrowTotal)}</td>
                                                            <td id="q4-escrowTotal" className="text-white text-bold">{currency.format(out.q4.escrowTotal)}</td>
                                                        </tr>
                                                        <tr className="h-8"></tr>
                                                        <tr>
                                                            <td rowSpan='5'  className={legendClass2}><div className={lHeadingClass}>HOA Items</div>{catDescriptions.HOADues}</td>
                                                            <td>HOA Initiation Dues</td>
                                                            <td><input id="q1-HOAInitiationDues" className="" value={data.q1.HOAInitiationDues||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-HOAInitiationDues" className="" value={data.q2.HOAInitiationDues||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-HOAInitiationDues" className="" value={data.q3.HOAInitiationDues||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-HOAInitiationDues" className="" value={data.q4.HOAInitiationDues||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                
                                                        <tr>
                                                            <td>Pro-rated HOA Dues</td>
                                                            <td><input id="q1-ProratedHOADues" className="" value={data.q1.ProratedHOADues||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-ProratedHOADues" className="" value={data.q2.ProratedHOADues||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-ProratedHOADues" className="" value={data.q3.ProratedHOADues||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-ProratedHOADues" className="" value={data.q4.ProratedHOADues||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>  
                                                        <tr>
                                                            <td>HOA closing Letter</td>
                                                            <td><input id="q1-HOAClosingLetter" className="" value={data.q1.HOAClosingLetter||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-HOAClosingLetter" className="" value={data.q2.HOAClosingLetter||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-HOAClosingLetter" className="" value={data.q3.HOAClosingLetter||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-HOAClosingLetter" className="" value={data.q4.HOAClosingLetter||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>HOA Capital Contribution</td>
                                                            <td><input id="q1-HOACapitalContr" className="" value={data.q1.HOACapitalContr||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-HOACapitalContr" className="" value={data.q2.HOACapitalContr||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-HOACapitalContr" className="" value={data.q3.HOACapitalContr||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-HOACapitalContr" className="" value={data.q4.HOACapitalContr||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr className={subtotalClass}>
                                                            <td className="text-white text-bold">HOA Items</td>
                                                            <td id="q1-HOATotal" className="text-white text-bold">{currency.format(out.q1.HOATotal)}</td>
                                                            <td id="q2-HOATotal" className="text-white text-bold">{currency.format(out.q2.HOATotal)}</td>
                                                            <td id="q3-HOATotal" className="text-white text-bold">{currency.format(out.q3.HOATotal)}</td>
                                                            <td id="q4-HOATotal" className="text-white text-bold">{currency.format(out.q4.HOATotal)}</td>
                                                        </tr>
                                                        <tr className="h-8"></tr>
                                                        <tr>
                                                            <td rowSpan='3'  className={legendClass3}><div className={lHeadingClass}>Builder/Lender Credits</div>{catDescriptions.credits}</td>
                                                            <td>Builder Credit Towards Closing Costs</td>
                                                            <td><input id="q1-builderCredit" className="" value={data.q1.builderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-builderCredit" className="" value={data.q2.builderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-builderCredit" className="" value={data.q3.builderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-builderCredit" className="" value={data.q4.builderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Lender Credit Towards Closing Costs</td>
                                                            <td><input id="q1-lenderCredit" className="" value={data.q1.lenderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-lenderCredit" className="" value={data.q2.lenderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-lenderCredit" className="" value={data.q3.lenderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-lenderCredit" className="" value={data.q4.lenderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr> 
                                                        <tr className={subtotalClass}>
                                                            <td className="text-white text-bold">Builder/Lender Credits</td>
                                                            <td id="q1-creditTotal" className="text-white text-bold">{currency.format(out.q1.creditTotal)}</td>
                                                            <td id="q2-creditTotal" className="text-white text-bold">{currency.format(out.q2.creditTotal)}</td>
                                                            <td id="q3-creditTotal" className="text-white text-bold">{currency.format(out.q3.creditTotal)}</td>
                                                            <td id="q4-creditTotal" className="text-white text-bold">{currency.format(out.q4.creditTotal)}</td>
                                                        </tr>
                                                        <tr className="h-8"></tr>
                                                        <tr className={totalClass}>
                                                            <td></td>
                                                            <td className="text-white text-bold">Total Loan Related Costs</td>
                                                            <td id="q1-totalCosts" className="text-white text-bold">{currency.format(out.q1.totalCosts)}</td>
                                                            <td id="q2-totalCosts" className="text-white text-bold">{currency.format(out.q2.totalCosts)}</td>
                                                            <td id="q3-totalCosts" className="text-white text-bold">{currency.format(out.q3.totalCosts)}</td>
                                                            <td id="q4-totalCosts" className="text-white text-bold">{currency.format(out.q4.totalCosts)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div className='calcAmort-btn  form-btn'><button onClick={(event)=>handleSelect(event, "2")}>Go to Normalized View for an Apples-to-Apples Comparison</button></div>
                                            </Tab>
                                            <Tab eventKey="2" title="Normalized">
                                                <table style={{width: "100%", tableLayout:"fixed"}} id="normalizedTbl"  className="gap-8">
                                                    <colgroup>
                                                    <col span="1" style={{width:"30%", overflow:"hidden"}}></col>
                                                    <col span="1" className={dClass} style={{width:"22%", overflow:"hidden"}}></col>
                                                    <col span="1" className={q1Class} style={{width:"12%", overflow:"hidden"}}></col>
                                                    <col span="1" className={q2Class} style={{width:"12%", overflow:"hidden"}}></col>
                                                    <col span="1" className={q3Class} style={{width:"12%", overflow:"hidden"}}></col>
                                                    <col span="1" className={q4Class} style={{width:"12%", overflow:"hidden"}}></col>
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            <th className="text-base md:text-3xl text-center">About these items</th>
                                                            <th className="text-base md:text-3xl">Item Description</th>                                             
                                                            <th className={q1Class}>BankSouth Quote</th>
                                                            <th className={q2Class}>Quote 1</th>
                                                            <th className={q3Class}>Quote 2</th>
                                                            <th className={q4Class} >Quote 3</th>
                                                
                                                        </tr>
                                                    </thead>
                                                    <tbody  className={cellClass}>
                                                        <tr>
                                                            <td rowSpan="15" className={legendClass1}><div className={lHeadingClass}>Lender Fees </div>{catDescriptions.lenderFees}</td>
                                                            <td>Origination Fees</td>
                                                            <td><input id="q1-originationFees" className="" value={data.q1.originationFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-originationFees" className="" value={data.q2.originationFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-originationFees" className="" value={data.q3.originationFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-originationFees" className="" value={data.q4.originationFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Discount Points</td>
                                                            <td><input id="q1-discountPoint" className="" value={data.q1.discountPoint||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-discountPoint" className="" value={data.q2.discountPoint||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-discountPoint" className="" value={data.q3.discountPoint||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-discountPoint" className="" value={data.q4.discountPoint||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Processing Fees</td>
                                                            <td><input id="q1-processingFees" className="" value={data.q1.processingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-processingFees" className="" value={data.q2.processingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-processingFees" className="" value={data.q3.processingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-processingFees" className="" value={data.q4.processingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Underwriting Fees</td>
                                                            <td><input id="q1-underwritingFees" className="" value={data.q1.underwritingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-underwritingFees" className="" value={data.q2.underwritingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-underwritingFees" className="" value={data.q3.underwritingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-underwritingFees" className="" value={data.q4.underwritingFees||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Adminstration Fee</td>
                                                            <td><input id="q1-adminstrationFee" className="" value={data.q1.adminstrationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-adminstrationFee" className="" value={data.q2.adminstrationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-adminstrationFee" className="" value={data.q3.adminstrationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-adminstrationFee" className="" value={data.q4.adminstrationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Document Review Fee</td>
                                                            <td><input id="q1-documentReviewFee" className="" value={data.q1.documentReviewFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-documentReviewFee" className="" value={data.q2.documentReviewFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-documentReviewFee" className="" value={data.q3.documentReviewFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-documentReviewFee" className="" value={data.q4.documentReviewFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Application Fee</td>
                                                            <td><input id="q1-applicationFee" className="" value={data.q1.applicationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-applicationFee" className="" value={data.q2.applicationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-applicationFee" className="" value={data.q3.applicationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-applicationFee" className="" value={data.q4.applicationFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Appraisal Fee</td>
                                                            <td><input id="q1-appraisalFee" className="" value={data.q1.appraisalFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-appraisalFee" className="" value={data.q2.appraisalFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-appraisalFee" className="" value={data.q3.appraisalFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-appraisalFee" className="" value={data.q4.appraisalFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Appraisal RUSH Fee (optional)</td>
                                                            <td><input id="q1-appraisalRushFee" className="" value={data.q1.appraisalRushFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-appraisalRushFee" className="" value={data.q2.appraisalRushFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-appraisalRushFee" className="" value={data.q3.appraisalRushFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-appraisalRushFee" className="" value={data.q4.appraisalRushFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Appraisal Final Inspection Fee (New Construction only)</td>
                                                            <td><input id="q1-NCFinalInspectionFee" className="" value={data.q1.NCFinalInspectionFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-NCFinalInspectionFee" className="" value={data.q2.NCFinalInspectionFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-NCFinalInspectionFee" className="" value={data.q3.NCFinalInspectionFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-NCFinalInspectionFee" className="" value={data.q4.NCFinalInspectionFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>  
                                                        <tr>
                                                            <td>Credit Report Fees</td>
                                                            <td><input id="q1-creditReportFee" className="" value={data.q1.creditReportFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-creditReportFee" className="" value={data.q2.creditReportFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-creditReportFee" className="" value={data.q3.creditReportFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-creditReportFee" className="" value={data.q4.creditReportFee||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Flood Certification</td>
                                                            <td><input id="q1-floodCertification" className="" value={data.q1.floodCertification||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-floodCertification" className="" value={data.q2.floodCertification||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-floodCertification" className="" value={data.q3.floodCertification||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-floodCertification" className="" value={data.q4.floodCertification||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Tax Service Charge</td>
                                                            <td><input id="q1-taxServiceCharge" className="" value={data.q1.taxServiceCharge||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-taxServiceCharge" className="" value={data.q2.taxServiceCharge||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-taxServiceCharge" className="" value={data.q3.taxServiceCharge||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-taxServiceCharge" className="" value={data.q4.taxServiceCharge||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Mortgage Electronic Registration System</td>
                                                            <td><input id="q1-mortgageElectronicRegSystem" className="" value={data.q1.mortgageElectronicRegSystem||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q2-mortgageElectronicRegSystem" className="" value={data.q2.mortgageElectronicRegSystem||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q3-mortgageElectronicRegSystem" className="" value={data.q3.mortgageElectronicRegSystem||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                            <td><input id="q4-mortgageElectronicRegSystem" className="" value={data.q4.mortgageElectronicRegSystem||""} onChange={handleChange} type="number" step=".01"></input></td>
                                                        </tr>
                                                        <tr className={subtotalClass}>
                                                            <td className="text-white">Lender Fees</td>
                                                            <td id="q1-lenderFees" className="text-white">{currency.format(out.q1.lenderFees)}</td>
                                                            <td id="q2-lenderFees" className="text-white">{currency.format(out.q2.lenderFees)}</td>
                                                            <td id="q3-lenderFees" className="text-white">{currency.format(out.q3.lenderFees)}</td>
                                                            <td id="q4-lenderFees" className="text-white">{currency.format(out.q4.lenderFees)}</td>
                                                        </tr>
                                                        <tr className={twMerge(`${diffClass}`, 'md:text-3xl/[1.0rem]')}>
                                                            <td></td>
                                                            <td className="align-right text-slate-800">Cost Difference</td>
                                                            <td id="q1-totalDiff" className={q1DiffClass}>{currency.format(out.q1.totalDiff)}</td>
                                                            <td id="q2-totalDiff" className={q2DiffClass}>{currency.format(out.q2.totalDiff)}</td>
                                                            <td id="q3-totalDiff" className={q3DiffClass}>{currency.format(out.q3.totalDiff)}</td>
                                                            <td id="q4-totalDiff" className={q4DiffClass}>{currency.format(out.q4.totalDiff)}</td>
                                                        </tr>        
                                                        <tr className="h-8"></tr>
                                                        <tr>
                                                            <td rowSpan='9' className={legendClass2}><div className={lHeadingClass}>Title Fees</div>{catDescriptions.titleFees}</td>
                                                            <td>Attorney/Settlement Fee</td>
                                                            <td><input id="q1-SettlementFee" className="" value={data.q1.SettlementFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td id="q2-SettlementFee" className="">{data.q1.SettlementFee}</td>
                                                            <td id="q3-SettlementFee" className="">{data.q1.SettlementFee}</td>
                                                            <td id="q4-SettlementFee" className="">{data.q1.SettlementFee}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Title Search Fee</td>
                                                            <td><input id="q1-titleSearchFee" className="" value={data.q1.titleSearchFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td id="q2-titleSearchFee" className="">{data.q1.titleSearchFee}</td>
                                                            <td id="q3-titleSearchFee" className="">{data.q1.titleSearchFee}</td>
                                                            <td id="q4-titleSearchFee" className="">{data.q1.titleSearchFee}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Title Binder</td>
                                                            <td><input id="q1-titleBinder" className="" value={data.q1.titleBinder||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td id="q2-titleBinder" className="">{data.q1.titleBinder}</td>
                                                            <td id="q3-titleBinder" className="">{data.q1.titleBinder}</td>
                                                            <td id="q4-titleBinder" className="">{data.q1.titleBinder}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Closing Protection Letter</td>
                                                            <td><input id="q1-closingProtectionLetter" className="" value={data.q1.closingProtectionLetter||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            
                                                            <td id="q2-closingProtectionLetter" className="">{data.q1.closingProtectionLetter}</td>
                                                            <td id="q3-closingProtectionLetter" className="">{data.q1.closingProtectionLetter}</td>
                                                            <td id="q4-closingProtectionLetter" className="">{data.q1.closingProtectionLetter}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Doc Prep Fee</td>
                                                            <td><input id="q1-docPrepFee" className="" value={data.q1.docPrepFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            
                                                            <td id="q2-docPrepFee" className="">{data.q1.docPrepFee}</td>
                                                            <td id="q3-docPrepFee" className="">{data.q1.docPrepFee}</td>
                                                            <td id="q4-docPrepFee" className="">{data.q1.docPrepFee}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Owner's Title Insurance (Optional)</td>
                                                            <td><input id="q1-ownerTitleInsurance" className="" value={data.q1.ownerTitleInsurance||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            
                                                            <td id="q2-ownerTitleInsurance" className="">{data.q1.ownerTitleInsurance}</td>
                                                            <td id="q3-ownerTitleInsurance" className="">{data.q1.ownerTitleInsurance}</td>
                                                            <td id="q4-ownerTitleInsurance" className="">{data.q1.ownerTitleInsurance}</td>
                                                        </tr>   
                                                        <tr>
                                                            <td>Lender's Title Insurance </td>
                                                            <td><input id="q1-lenderTitleInsurance" className="" value={data.q1.lenderTitleInsurance||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            
                                                            <td id="q2-lenderTitleInsurance" className="">{data.q1.lenderTitleInsurance}</td>
                                                            <td id="q3-lenderTitleInsurance" className="">{data.q1.lenderTitleInsurance}</td>
                                                            <td id="q4-lenderTitleInsurance" className="">{data.q1.lenderTitleInsurance}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Any Additional Title Fees</td>
                                                            <td><input id="q1-additionalTitleFees" className="" value={data.q1.additionalTitleFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                           
                                                            <td id="q2-additionalTitleFees" className="">{data.q1.additionalTitleFees}</td>
                                                            <td id="q3-additionalTitleFees" className="">{data.q1.additionalTitleFees}</td>
                                                            <td id="q4-additionalTitleFees" className="">{data.q1.additionalTitleFees}</td>
                                                        </tr>
                                                        <tr className={subtotalClass}>
                                                            <td className="text-white text-bold">Title Fees<div className='text-xl md:text-xl italic font-light'>(Will be same across all lenders)</div></td>
                                                            <td id="q1-titleFees" className="text-white text-bold">{currency.format(out.q1.titleFees)}</td>
                                                            <td id="q2-titleFees" className="text-white text-bold">{currency.format(out.q1.titleFees)}</td>
                                                            <td id="q3-titleFees" className="text-white text-bold">{currency.format(out.q1.titleFees)}</td>
                                                            <td id="q4-titleFees" className="text-white text-bold">{currency.format(out.q1.titleFees)}</td>
                                                        </tr>  
                                                        <tr className="h-8"></tr>  
                                                        <tr>
                                                            <td rowSpan="6"  className={legendClass2}><div className={lHeadingClass}>Government Fees</div>{catDescriptions.govTaxFees}</td>
                                                            <td>Government Recording Fees</td>
                                                            <td><input id="q1-govRecordingFees" className="" value={data.q1.govRecordingFees||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            
                                                            <td id="q2-govRecordingFees" className="">{data.q1.govRecordingFees}</td>
                                                            <td id="q3-govRecordingFees" className="">{data.q1.govRecordingFees}</td>
                                                            <td id="q4-govRecordingFees" className="">{data.q1.govRecordingFees}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Deed Transfer Tax</td>
                                                            <td><input id="q1-deedTransferTax" className="" value={data.q1.deedTransferTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td id="q2-deedTransferTax" className="">{data.q1.deedTransferTax}</td>
                                                            <td id="q3-deedTransferTax" className="">{data.q1.deedTransferTax}</td>
                                                            <td id="q4-deedTransferTax" className="">{data.q1.deedTransferTax}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Mortgage Transfer Tax/Intangible Tax</td>
                                                            <td><input id="q1-mortgageTransferTax" className="" value={data.q1.mortgageTransferTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            
                                                            <td id="q2-mortgageTransferTax" className="">{data.q1.mortgageTransferTax}</td>
                                                            <td id="q3-mortgageTransferTax" className="">{data.q1.mortgageTransferTax}</td>
                                                            <td id="q4-mortgageTransferTax" className="">{data.q1.mortgageTransferTax}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>GA Residential Mortgage Act Per Loan Fee</td>
                                                            <td><input id="q1-GAResMgageActPerLoanFee" className="" value={data.q1.GAResMgageActPerLoanFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                          
                                                            <td id="q2-GAResMgageActPerLoanFee" className="">{data.q1.GAResMgageActPerLoanFee}</td>
                                                            <td id="q3-GAResMgageActPerLoanFee" className="">{data.q1.GAResMgageActPerLoanFee}</td>
                                                            <td id="q4-GAResMgageActPerLoanFee" className="">{data.q1.GAResMgageActPerLoanFee}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>eRecording Fee</td>
                                                            <td><input id="q1-eRecordingFee" className="" value={data.q1.eRecordingFee||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            
                                                            <td id="q2-eRecordingFee" className="">{data.q1.eRecordingFee}</td>
                                                            <td id="q3-eRecordingFee" className="">{data.q1.eRecordingFee}</td>
                                                            <td id="q4-eRecordingFee" className="">{data.q1.eRecordingFee}</td>
                                                        </tr>
                                                        <tr className={subtotalClass}>
                                                            <td className="text-white text-bold">Government Taxes and Fees<div className='text-xl md:text-xl italic font-light'>(Will be same across all lenders)</div></td>
                                                            <td id="q1-govTaxFees" className="text-white text-bold">{currency.format(out.q1.govTaxFees)}</td>
                                                            <td id="q2-govTaxFees" className="text-white text-bold">{currency.format(out.q1.govTaxFees)}</td>
                                                            <td id="q3-govTaxFees" className="text-white text-bold">{currency.format(out.q1.govTaxFees)}</td>
                                                            <td id="q4-govTaxFees" className="text-white text-bold">{currency.format(out.q1.govTaxFees)}</td>
                                                        </tr>
                                                        <tr className="h-8"></tr>
                                                        <tr>
                                                            <td rowSpan='3'  className={legendClass2}><div className={lHeadingClass}>Estimated Pre-paid Items</div>{catDescriptions.estPrepaid}</td>
                                                            <td>Interest due ( from closing date until month end)</td>
                                                            <td><input id="q1-interestDue" className="" value={data.q1.interestDue||""} onChange={handleChange} type="number" step=".01"/></td>
                                                           
                                                            <td id="q2-interestDue" className="">{data.q1.interestDue}</td>
                                                            <td id="q3-interestDue" className="">{data.q1.interestDue}</td>
                                                            <td id="q4-interestDue" className="">{data.q1.interestDue}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>First Year Homeowner's Insurance Premium</td>
                                                            <td><input id="q1-firstYearHomeownerInsPremium" className="" value={data.q1.firstYearHomeownerInsPremium||""} onChange={handleChange} type="number" step=".01"/></td>
                                                           
                                                            <td id="q2-firstYearHomeownerInsPremium" className="">{data.q1.firstYearHomeownerInsPremium}</td>
                                                            <td id="q3-firstYearHomeownerInsPremium" className="">{data.q1.firstYearHomeownerInsPremium}</td>
                                                            <td id="q4-firstYearHomeownerInsPremium" className="">{data.q1.firstYearHomeownerInsPremium}</td>
                                                        </tr>
                                                        <tr className={subtotalClass}>
                                                            <td className="text-white text-bold">Estimated Pre-paid Items<div className='text-xl md:text-xl italic font-light'>(Will be same across all lenders)</div></td>
                                                            <td id="q1-prepaidTotal" className="text-white text-bold">{currency.format(out.q1.prepaidTotal)}</td>
                                                            <td id="q2-prepaidTotal" className="text-white text-bold">{currency.format(out.q1.prepaidTotal)}</td>
                                                            <td id="q3-prepaidTotal" className="text-white text-bold">{currency.format(out.q1.prepaidTotal)}</td>
                                                            <td id="q4-prepaidTotal" className="text-white text-bold">{currency.format(out.q1.prepaidTotal)}</td>
                                                        </tr>
                                                        <tr className="h-8"></tr>
                                                        <tr>
                                                            <td rowSpan='4'  className={legendClass2}><div className={lHeadingClass}>Escrow Items</div>{catDescriptions.escrowDeposit}</td>
                                                            <td>Homeowner's Insurance</td>
                                                            <td><input id="q1-homeownerIns" className="" value={data.q1.homeownerIns||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            
                                                            <td id="q2-homeownerIns" className="">{data.q1.homeownerIns}</td>
                                                            <td id="q3-homeownerIns" className="">{data.q1.homeownerIns}</td>
                                                            <td id="q4-homeownerIns" className="">{data.q1.homeownerIns}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>County Property Taxes</td>
                                                            <td><input id="q1-countyPropTax" className="" value={data.q1.countyPropTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            
                                                            <td id="q2-countyPropTax" className="">{data.q1.countyPropTax}</td>
                                                            <td id="q3-countyPropTax" className="">{data.q1.countyPropTax}</td>
                                                            <td id="q4-countyPropTax" className="">{data.q1.countyPropTax}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>City Property Taxes</td>
                                                            <td><input id="q1-cityPropTax" className="" value={data.q1.cityPropTax||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            
                                                            <td id="q2-cityPropTax" className="">{data.q1.cityPropTax}</td>
                                                            <td id="q3-cityPropTax" className="">{data.q1.cityPropTax}</td>
                                                            <td id="q4-cityPropTax" className="">{data.q1.cityPropTax}</td>
                                                        </tr>
                                                        <tr className={subtotalClass}>
                                                            <td className="text-white text-bold">Escrow Items<div className='text-xl md:text-xl italic font-light'>(Will be same across all lenders)</div></td>
                                                            <td id="q1-escrowTotal" className="text-white text-bold">{currency.format(out.q1.escrowTotal)}</td>
                                                            <td id="q2-escrowTotal" className="text-white text-bold">{currency.format(out.q1.escrowTotal)}</td>
                                                            <td id="q3-escrowTotal" className="text-white text-bold">{currency.format(out.q1.escrowTotal)}</td>
                                                            <td id="q4-escrowTotal" className="text-white text-bold">{currency.format(out.q1.escrowTotal)}</td>
                                                        </tr>
                                                        <tr className="h-8"></tr>
                                                        <tr>
                                                            <td rowSpan='5'  className={legendClass2}><div className={lHeadingClass}>HOA Items</div>{catDescriptions.HOADues}</td>
                                                            <td>HOA Initiation Dues</td>
                                                            <td><input id="q1-HOAInitiationDues" className="" value={data.q1.HOAInitiationDues||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            
                                                            <td id="q2-HOAInitiationDues" className="">{data.q1.HOAInitiationDues}</td>
                                                            <td id="q3-HOAInitiationDues" className="">{data.q1.HOAInitiationDues}</td>
                                                            <td id="q4-HOAInitiationDues" className="">{data.q1.HOAInitiationDues}</td>
                                                        </tr>
                
                                                        <tr>
                                                            <td>Pro-rated HOA Dues</td>
                                                            <td><input id="q1-ProratedHOADues" className="" value={data.q1.ProratedHOADues||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            
                                                            <td id="q2-ProratedHOADues" className="">{data.q1.ProratedHOADues}</td>
                                                            <td id="q3-ProratedHOADues" className="">{data.q1.ProratedHOADues}</td>
                                                            <td id="q4-ProratedHOADues" className="">{data.q1.ProratedHOADues}</td>
                                                        </tr>  
                                                        <tr>
                                                            <td>HOA closing Letter</td>
                                                            <td><input id="q1-HOAClosingLetter" className="" value={data.q1.HOAClosingLetter||""} onChange={handleChange} type="number" step=".01"/></td>
                                                           
                                                            <td id="q2-HOAClosingLetter" className="">{data.q1.HOAClosingLetter}</td>
                                                            <td id="q3-HOAClosingLetter" className="">{data.q1.HOAClosingLetter}</td>
                                                            <td id="q4-HOAClosingLetter" className="">{data.q1.HOAClosingLetter}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>HOA Capital Contribution</td>
                                                            <td><input id="q1-HOACapitalContr" className="" value={data.q1.HOACapitalContr||""} onChange={handleChange} type="number" step=".01"/></td>
                                                          
                                                            <td id="q2-HOACapitalContr" className="">{data.q1.HOACapitalContr}</td>
                                                            <td id="q3-HOACapitalContr" className="">{data.q1.HOACapitalContr}</td>
                                                            <td id="q4-HOACapitalContr" className="">{data.q1.HOACapitalContr}</td>
                                                        </tr>
                                                        <tr className={subtotalClass}>
                                                            <td className="text-white text-bold">HOA Items<div className='text-xl md:text-xl italic font-light'>(Will be same across all lenders)</div></td>
                                                            <td id="q1-HOATotal" className="text-white text-bold">{currency.format(out.q1.HOATotal)}</td>
                                                            <td id="q2-HOATotal" className="text-white text-bold">{currency.format(out.q1.HOATotal)}</td>
                                                            <td id="q3-HOATotal" className="text-white text-bold">{currency.format(out.q1.HOATotal)}</td>
                                                            <td id="q4-HOATotal" className="text-white text-bold">{currency.format(out.q1.HOATotal)}</td>
                                                        </tr>
                                                        <tr className="h-8"></tr>
                                                        <tr>
                                                            <td rowSpan='3'  className={legendClass3}><div className={lHeadingClass}>Builder/Lender Credits</div>{catDescriptions.credits}</td>
                                                            <td>Builder Credit Towards Closing Costs</td>
                                                            <td><input id="q1-builderCredit" className="" value={data.q1.builderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-builderCredit" className="" value={data.q2.builderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-builderCredit" className="" value={data.q3.builderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-builderCredit" className="" value={data.q4.builderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Lender Credit Towards Closing Costs</td>
                                                            <td><input id="q1-lenderCredit" className="" value={data.q1.lenderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q2-lenderCredit" className="" value={data.q2.lenderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q3-lenderCredit" className="" value={data.q3.lenderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                            <td><input id="q4-lenderCredit" className="" value={data.q4.lenderCredit||""} onChange={handleChange} type="number" step=".01"/></td>
                                                        </tr> 
                                                        <tr className={subtotalClass}>
                                                            <td className="text-white text-bold">Builder/Lender Credits</td>
                                                            <td id="q1-creditTotal" className="text-white text-bold">{currency.format(out.q1.creditTotal)}</td>
                                                            <td id="q2-creditTotal" className="text-white text-bold">{currency.format(out.q2.creditTotal)}</td>
                                                            <td id="q3-creditTotal" className="text-white text-bold">{currency.format(out.q3.creditTotal)}</td>
                                                            <td id="q4-creditTotal" className="text-white text-bold">{currency.format(out.q4.creditTotal)}</td>
                                                        </tr>
                                                        <tr className="h-8"></tr>
                                                        <tr className={totalClass}>
                                                            <td></td>
                                                            <td className="text-white text-bold">Normalized Costs</td>
                                                            <td id="q1-totalCosts" className="text-white text-bold">{currency.format(out.q1.totalCosts)}</td>
                                                            <td id="q2-totalCosts" className="text-white text-bold">{currency.format(out.q2.totalNormalizedCosts)}</td>
                                                            <td id="q3-totalCosts" className="text-white text-bold">{currency.format(out.q3.totalNormalizedCosts)}</td>
                                                            <td id="q4-totalCosts" className="text-white text-bold">{currency.format(out.q4.totalNormalizedCosts)}</td>
                                                        </tr>
                                                        <tr className="h-8"></tr>
                                                        <tr className={diffClass+" align-right text-rose-600"}>
                                                            <td></td>
                                                            <td className="align-right text-text-slate-800">Cost Difference</td>
                                                            <td id="q1-totalDiff" className={q1DiffClass}>{currency.format(out.q1.totalDiff)}</td>
                                                            <td id="q2-totalDiff" className={q2DiffClass}>{currency.format(out.q2.totalDiff)}</td>
                                                            <td id="q3-totalDiff" className={q3DiffClass}>{currency.format(out.q3.totalDiff)}</td>
                                                            <td id="q4-totalDiff" className={q4DiffClass}>{currency.format(out.q4.totalDiff)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div className='calcAmort-btn  form-btn'><button onClick={(event)=>handleSelect(event, "1")}>Go to Original View</button></div>
                                            </Tab>
                                        </Tabs>
                                    </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuoteAnalysis;