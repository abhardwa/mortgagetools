import ChartComponent, {renderChart } from "./chart.js";
import { useState, useEffect, useRef} from "react";
import {Tab, Tabs, Accordion} from "react-bootstrap";
import axios from "axios";
import DatePicker from 'react-datepicker'
import LoanTable from "./AmortTable.js";

function Amortization() {
    const [data, setData] = useState({
        "startDate": (new Date()).toISOString().substring(0, 10),
        "lamount": 225000,
        "lrate": 6.25,
        "lterm":30,
        "recurMAmt":0,
        "recurMDate":(new Date()).toISOString().substring(0, 10),
        "recurAAmt":0,
        "recurADate":(new Date()).toISOString().substring(0, 10),
        "onePayAmt":0,
        "onePayDate":(new Date()).toISOString().substring(0, 10),
    })
    const [result,setResult]  = useState( {
        intSavings:0,
        payOffSavings:0,
        mPayment:0,
        months:0,
        totalInt:0,
        totalCost:0,
        payOffDate:0,
    });

    const [btnState, setBtnState] = useState(false);
    const [state, setState] = useState('done');
    const [ltbl, setLtbl] = useState([]);
    const [loan, setLoan] = useState({});
    const [slider, setSlider] = useState({
        "rs-range-line":0,
        "rs-bullet":"",
    });
    const currency = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });


    const getLoan = async (arg) => {
        setState('pending');
        try {
            const response = await axios.get(arg);
            // console.log(response.data);
            // console.log(response.status);
            // console.log(response.statusText);
            // console.log(response.headers);
            // console.log(response.config);
              return response.data;
        } catch (error) {
            setState('error');
            console.error(error);
            return null;
        }
        
    }

    function calcAmortization() {

        let loan, baseLoan;
        const out = {
            intSavings:0,
            payOffSavings:0,
            mPayment:0,
            months:0,
            totalInt:0,
            totalCost:0,
            payOffDate:0,
        }
   
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // set up slider variables for use in the following code lines
        const rangeSlider = document.getElementById("rs-range-line");
        const rangeBullet = document.getElementById("rs-bullet");
        
        const arg0 ="/api/add?" +
        "lamount=" +
        data.lamount +
        "&lrate=" +
        data.lrate +
        "&lterm=" +
        data.lterm +
        "&lStartDate=" +
        data.startDate +
        "&recurMAmt=" +
        0 +
        "&recurMDate=" +
        data.recurMDate +
        "&recurAAmt=" +
        0 +
        "&recurADate=" +
        data.recurADate +
        "&onePayAmt=" +
        0 +
        "&onePayDate=" +
        data.onePayDate;

        const arg1 ="/api/add?" +
        "lamount=" +
        data.lamount +
        "&lrate=" +
        data.lrate +
        "&lterm=" +
        data.lterm +
        "&lStartDate=" +
        data.startDate +
        "&recurMAmt=" +
        data.recurMAmt +
        "&recurMDate=" +
        data.recurMDate +
        "&recurAAmt=" +
        data.recurAAmt +
        "&recurADate=" +
        data.recurADate +
        "&onePayAmt=" +
        data.onePayAmt +
        "&onePayDate=" +
        data.onePayDate;

        // call getLoan to get the baseLoan and loan data
        return (async () => {
            baseLoan = await getLoan(arg0)
            loan = await getLoan(arg1);
            // calcButton();
            // console.log(out);
            const [loantbl, xLoan] = calcButton();
            // console.log(xLoan);
            return[out, loantbl, xLoan];
        })();

        function calcButton() {
            let cumP, cumI, totalIntBase;
            out.totalInt = out.totalCost = totalIntBase= 0;
            cumP = [];
            cumI = [];
  
            out.mPayment = loan[0].mPayment;
            let dt2 = new Date(data.startDate);
            // console.log(loan);
            for (let i in loan) {
                out.totalInt += loan[i].interest;
                out.totalCost += loan[i].interest + loan[i].principal;
                dt2.setMonth(dt2.getMonth() + 1);
                loan[i].year = dt2.getFullYear();
                loan[i].month = months[dt2.getMonth()];
            }
            /// Calculate total interest and payoff period with no optional payments
            for (let i in baseLoan) {
                totalIntBase += baseLoan[i].interest;
            }
            // Display a message if there are savings from optional payments

            if (totalIntBase > out.totalInt) {
                out.intSavings = totalIntBase - out.totalInt;
                out.payOffSavings = baseLoan.length - loan.length;
            }
            out.months = loan.length;
            out.payOffDate = monthYear(new Date(data.startDate), loan.length);
            const cbalance = loan.map(({ balance }) => Math.trunc(balance));
            let cumSum = 0;
            cumP = loan.map(({principal}) => {
                cumSum += Math.trunc(principal);
                return cumSum;
            });
            cumSum = 0;
            cumI = loan.map(({interest}) => {
                cumSum += Math.trunc(interest);
                return cumSum;
            });
            const timeLabels = loan.map(({ month }) => month);
            let loanLabels = [0, 100000, 200000, 300000, 400000];
            // console.log(out);
            // console.log(cbalance);
            renderChart(data.startDate, cbalance, cumP, cumI, timeLabels, loanLabels);
            return[generateSchedule(loan, data.startDate), loan];
        }
        
        // Function to load the amortization schedule in a table and present it on the web page
        function generateSchedule(data, lStartDate) {

            const hdr = ["Date", "Loan Balance", "Interest", "Principal"];
            const currency = new Intl.NumberFormat("us-US", { style: "currency", currency: "USD", useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 });
            let ybalance, yprincipal, yinterest;

            const renderHeader = () => {
                return (<tr className="banner"> 
                    {hdr.map((item, idx) => <th key={idx}>{item}</th>)}
                    </tr>
                );
            }

            // console.log(renderHeader);
            let dt = new Date(lStartDate);
            let dt1 = dt;
            dt.setMonth(dt1.getMonth());
            let prevYear = 1970;
            let loantbl =[];
            let yidx = -1;

            // // creating all cells
            for (let i = 0; i < data.length; i++) {
                if (loan[i].year > prevYear) {

                    ybalance = yprincipal = yinterest = 0;
                    loan.forEach((item,idx) => {
                        if (item.year === loan[i].year) {
                            yprincipal += item.principal;
                            yinterest += item.interest;
                            ybalance = item.balance;
                        }
                    });
                    yidx +=1;
                    prevYear = loan[i].year;
                    loantbl.push({ id:loan[i].year, Date:loan[i].year, Balance:currency.format(ybalance), Interest:currency.format(yinterest), Principal:currency.format(yprincipal), detail:[]});
                }
                // console.log(i, yidx, loantbl[yidx] );
                loantbl[yidx].detail.push({ id:i, Date:loan[i].year+" "+loan[i].month, Balance:currency.format(loan[i].balance), Interest:currency.format(loan[i].interest), Principal:currency.format(loan[i].principal)});
            }
            // console.log(Array.from(loantbl));
            return(Array.from(loantbl));

        }
    }

    function download(loan) {
        const data = loan;
        const currency = new Intl.NumberFormat("us-US", { style: "currency", currency: "USD", useGrouping: false });
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += Object.keys(data[0]).join(",") + "\r\n";
        data.forEach((object) => {
            const rowValues = Object.values(object).map((v) => `${v - Math.floor(v) !== 0 ? currency.format(v) : v}`);
            csvContent += rowValues.join(",") + "\r\n";
        });
        // create a download link for the CSV file
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "amortization.csv");
        document.getElementById("csv").appendChild(link);

        link.click();
        // return (
        //     <a href={encodeURI} download="amortization.csv">Amortization Data</a>
        // );
    };

    function calcSliderValues() {
        //i = the selected month
        // based on the selected month, calculate the display offset and read loan json object to
        // build the amortization data slider info.

        // set up slider variables for use in the following code lines
        const rangeSlider = document.getElementById("rs-range-line");
        const rangeBullet = document.getElementById("rs-bullet");

        rangeSlider.max = loan.length;  
        let i = (Number(rangeSlider.value)<rangeSlider.max?Number(rangeSlider.value): rangeSlider.max-1);
        if (!rangeSlider.max) {
        rangeSlider.max = "";
        }
        console.log(rangeSlider.value, i, rangeSlider.max);

        let sliderPosition = (Number(rangeSlider.value)<rangeSlider.max?Number(rangeSlider.value): rangeSlider.max-1) / rangeSlider.max;
        let viewportWidth = window.innerWidth;
        let bulletPosition = sliderPosition * 0.17 * viewportWidth;
        rangeBullet.style.left = bulletPosition;
        document.getElementById("box-max").innerHTML = rangeSlider.max;
        setSlider(slider=>({...slider, "rs-bullet":bulletPosition}));

        // console.log(rangeSlider.value, i, rangeSlider.max, bulletPosition);

        const princ = loan[i].principal.toLocaleString("us-US", { style: "currency", currency: "USD" });
        const int = loan[i].interest.toLocaleString("us-US", { style: "currency", currency: "USD" });
        const bal = loan[i].balance.toLocaleString("us-US", { style: "currency", currency: "USD" });
        // This statement constructs the pop up window details from the loan json object
        rangeBullet.innerHTML =
        "<p>Month:     " +
        "<span style='color:black; font-weight:700;'>" +
        (Number(i) + 1) +
        "</span></p>" +
        "<p>Principal: " +
        "<span style='color:black; font-weight:700;'>" +
        princ +
        "</span></p>" +
        "<p>Interest:  " +
        "<span style='color:black; font-weight:700;'>" +
        int +
        "</span></p>" +
        "<p>Balance:   " +
        "<span style='color:black; font-weight:700;'>" +
        bal +
        "</span></p>";

        rangeBullet.style.visibility = "visible";
    }
    function monthYear(dt, nbr) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        dt.setMonth(dt.getMonth() + nbr);
        const pmonth = months[dt.getMonth()];
        const pyear = dt.getFullYear();
        return pmonth + " " + pyear;
    }

    const handleChange = (e) => {

        if (e.target.id==="rs-range-line" && ltbl.length) {
            setSlider(slider => {
                return {
                ...slider, [e.target.id]:Number(e.target.value)
                }
            });
        } else {
            setData(data => {
                return {
                ...data, [e.target.id]:Number(e.target.value)
                }
            });
        }

        if (e.target.id==="rs-range-line" && ltbl.length)
            calcSliderValues();
    };

    const handleDownload = (e) => {
        console.log(loan);
        download(loan);

    };
    
    const handleStartDateChange = (e) => {
        setData(data => {return {...data, 'startDate':(e).toISOString().substring(0, 10)}});
    };

    const handleRecurMDateChange = (e) => {
        setData(data => {return {...data, 'recurMDate':(e).toISOString().substring(0, 10)}});
    };

    const handleRecurADateChange = (e) => {
        setData(data => {return {...data, 'recurADate':(e).toISOString().substring(0, 10)}});
    };

    const handleOnePayDateChange = (e) => {
        setData(data => {return {...data, 'onePayDate':(e).toISOString().substring(0, 10)}});
    };
    // const RenderSched = useRef('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [res, loantbl, xLoan] = await calcAmortization(); // Wait for the promise to resolve
                // console.log(xLoan);
                if (res) {
                    setResult(result => ({ ...result, ...res })); // Update the result state
                    setState('done');
                    setLtbl([...loantbl]);
                    setLoan(xLoan);
                } else {
                    console.log("Error: Async function pending...");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData(); // Call the asynchronous function
        
    }, [btnState]);


    if (state==="pending") {       // || state==="done"
            console.log("Loading...")
            return <div>Loading...</div>
    };
    // console.log(sched, state);
    return (
        <div id="amortization" className="tabcontent">
            <section className="colored-section" id="title">
                <div className="container-fluid">
                    <h3 className="heading-primary centered-text">Amortization Schedule Calculator</h3>
                    <p className="main-text max-text-box"> Amortization is paying off a debt over time in equal payments. A portion of each payment goes toward the
                        loan principal,
                        and another portion goes toward interest. As time passes, the amount going toward principal gradually
                        grows larger month by month. In the following amortization schedule, you can see how much money you pay
                        in
                        principal and interest
                        over time. Use this calculator to input the details of your loan and see how those payments break down
                        over your loan
                        term.
                    </p>
                    <section className="white-section" id="pricing">
                        <div className="row">
                            <div className="col-lg-3 col-md-1">
                                <div className="loan-input">
                                    <form className="input-item item-separator">
                                        <label className="small-text">Loan Amount</label>
                                        <input id="lamount" className="form-input currency" name="lamount" step="5000"
                                            pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" value={data.lamount} onChange={handleChange} data-type="currency"
                                            type="text" />
                                    </form>
                                    <form className="input-item item-separator">
                                        <label className="small-text">Loan Term</label>
                                        <select id="lterm" name="lterm" data-type="number" className="form-input" value={data.lterm} onChange={handleChange} >
                                            <option value="30" defaultValue="">30 years</option>
                                            <option value="20">20 years</option>
                                            <option value="15">15 years</option>
                                            <option value="10">10 years</option>
                                        </select>
                                    </form>
                                    <form className="input-item item-separator">
                                        <label className="small-text">Interest Rate %</label>
                                        <input id="lrate" className="form-input" name="lrate" step=".125" data-type="pct"
                                            type="number"  value={data.lrate} onChange={handleChange}  />
                                    </form>
                                    <form className="input-item item-separator">
                                        <label className="small-text">Loan Start Date </label>
                                        <div className="input-group date startDate">
                                            <DatePicker className="form-input" id="startDate"  selected={new Date(data.startDate)} onChange={handleStartDateChange}/>
                                        </div>
                                    </form>

                                    <Accordion defaultActiveKey="1">
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header style={{color:"blue", fontSize:"2rem"}}>
                                                Optional: Enter extra payments that you may like to make:
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div className="optional" id="">
                                                    <div className="card optional-body">
                                                        <p className="optional-body-msg main-text"> By adding extra payments, you can lower total interest
                                                            paid and
                                                            payoff
                                                            the loan faster.
                                                        </p>
                                                        <form className="small-text">
                                                            <label className="optional-label">Monthly
                                                                Amt</label>
                                                            <input name="recurMAmt" id="recurMAmt" value={data.recurMAmt} onChange={handleChange}
                                                                pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" data-type="currency" type="text"
                                                                className="optional-data form-input"/>
                                                        </form>
                                                        <form className="">
                                                            <label className="optional-label" >Start Date</label>
                                                            <div className="input-group date">
                                                                <DatePicker className="optional-data form-input" id="recurMDate" selected={new Date(data.recurMDate)} onChange={handleRecurMDateChange}/>
                                                            </div>
                                                        </form>
                                                        <form className="">
                                                            <label className="optional-label">Annual Amt</label>
                                                            <input name="recurAAmt" id="recurAAmt"  value={data.recurAAmt} onChange={handleChange}
                                                                pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" data-type="currency" type="text"
                                                                className="optional-data form-input"/>
                                                        </form>
                                                        <form className="">
                                                            <label className="optional-label">Start Date</label>
                                                            <div className="input-group date">
                                                                <DatePicker className="optional-data form-input" id="recurADate" selected={new Date(data.recurADate)} onChange={handleRecurADateChange}/>
                                                            </div>
                                                        </form>
                                                        <form className="">
                                                            <label className="optional-label" >One time Amt</label>
                                                            <input name="onePayAmt" id="onePayAmt"  value={data.onePayAmt} onChange={handleChange}
                                                                pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" data-type="currency" type="text"
                                                                className="optional-data form-input"/>
                                                        </form>
                                                        <form className="">
                                                            <label className="optional-label" >Start Date</label>
                                                            <div className="input-group date">
                                                                <DatePicker className="optional-data form-input" id="onePayDate" selected={new Date(data.onePayDate)} onChange={handleOnePayDateChange}/>

                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion> 
                                    <button id="calcAmort-btn" onClick={() => {setBtnState(btnState => !btnState)}} type = "button" className="calcAmort-btn form-btn small-text">Calculate Amortization</button>
                                </div>

                            </div>
                            <div className="col-lg-9 col-md-3">
                                <div className="card loan-output">
                                    <div className="card2-header ">
                                        <p className="card2-title-left tiny-text bold-text main-color">SUMMARY</p>
                                        <p className="card2-title-right tiny-text bold-text main-color">Number of Payments:<span id="months">{result.months}</span></p>
                                        <p className="card2-header-line"></p>
                                    </div>
                                    <div className="card2-body">
                                        <label className="card2-body-label">Monthly Payment</label>
                                        <p id="mPayment" className="card2-data">{currency.format(result.mPayment)}</p>
                                        <label className="card2-body-label">Total Interest Paid</label>
                                        <p id="totalInt" className="card2-data">{currency.format(result.totalInt)}</p>
                                        <label className=" card2-body-label-2" >Total Cost of
                                            Loan</label>
                                        <p id="totalCost" className="card2-body-data-2">{currency.format(result.totalCost)}</p>
                                        <label className=" card2-body-label-2" >Payoff Date</label>
                                        <p id="payOffDate" className="card2-body-data-2">{result.payOffDate}</p>
                                        <p id = "savingsMsg" className = "small-text bold-text main-color" style={{display:(result.intSavings)?"block":"none", color:"blue"}}>
                                            Your additional payments will reduce your total interest payment by&nbsp;<b><span id = "intSavings" className = "subheading"></span>
                                            {currency.format(result.intSavings)}</b>&nbsp;and will also help pay off your loan&nbsp;<b>
                                            {result.payOffSavings}</b>&nbsp;months sooner. </p>
                                    </div>
                                </div>

                                <br></br>
                                <div className="card loan-output">
                                    <div>
                                        <Tabs defaultActiveKey="first" style={{fontSize:"1.8rem"}}>
                                            <Tab eventKey="first" title="Chart">
                                                <div className="grid-item line-chart">
                                                    <p className="main-text left-text bold-text main-color">How payments change over the life of a <span
                                                            id="loan-years">{data.lterm}</span>-year loan</p>
                                                    <p className ="small-text">As the term of your mortgage progresses, a larger share of your payment goes toward
                                                        paying down the principal until the loan is paid in full at the end of your term.
                                                    </p>

                                                    <div className="chart-grid">
                                                        <div className="chart-grid-chart">

                                                            <ChartComponent/>
                                                        </div>
                                                        <div className="chart-grid-second-column">
                                                            <div className="chart-grid-table">
                                                                <p className="line-heading chart-grid-table-item">As of <span
                                                                        id="line-date"></span></p>

                                                                <p className="chart-table-line"></p>
                                                                <p className="line-color chart-grid-table-item"
                                                                    style={{backgroundColor:"#3cba9f"}}> </p>
                                                                <p className="line-label chart-grid-table-item">Interest Paid</p>
                                                                <p className="line-data chart-grid-table-item" id="line-interest"></p>                                                    
                                                                <p className="chart-table-line"></p>
                                                                                                                    <p className="line-color chart-grid-table-item"
                                                                    style={{backgroundColor:"#8e5ea2"}}> </p>
                                                                <p className="line-label chart-grid-table-item">Principal Paid</p>
                                                                <p className="line-data chart-grid-table-item" id="line-principal"></p>
                                                                <p className="chart-table-line"></p>

                                                                <p className="line-color chart-grid-table-item"
                                                                    style={{backgroundColor:"#3e95cd"}}> </p>
                                                                <p className="line-label chart-grid-table-item">Loan Balance</p>
                                                                <p className="line-data chart-grid-table-item" id="line-balance"></p>
                                                                <p className="chart-table-line"></p>
                                                            </div>
                                                            <br></br>
                                                            <Accordion defaultActiveKey="1">
                                                                <Accordion.Item eventKey="0">
                                                                    <Accordion.Header>
                                                                        Amortization Slider Tool and table download:
                                                                    </Accordion.Header>
                                                                    <Accordion.Body>
                                                                        <div className="container slider-section">
                                                                            <div className="range-slider">
                                                                                <div className="">
                                                                                    <span id="rs-bullet" className="rs-label" style={{left:slider["rs-bullet"]}}></span>
                                                                                    <input id="rs-range-line" className="rs-range" type="range"  value={slider["rs-range-line"]} onChange={handleChange}
                                                                                        min="0" max="200" />
                                                                                </div>
                                                                                <div className="box-minmax"><span id="box-min">0</span><span
                                                                                        id="box-max">360</span></div>
                                                                            </div>
                                                                            <br></br>
                                                                            <div id="csv">
                                                                                <button type="button" id="download" className="form-btn" disabled={ltbl.length?false:true} onClick= {handleDownload}>Download
                                                                                    Amortization
                                                                                    Table</button>
                                                                            </div>
                                                                        </div>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>
                                                            </Accordion>                                                             
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab>
                                            <Tab eventKey="second" title="Schedule">
                                                <div className="sched-table">
                                                    <p className="left-aligned-hdr main-text left-text bold-text main-color">Amortization Schedule Breakdown</p>
                                                    <p className="small-text">This table lists how much principal and interest are paid in each scheduled
                                                        mortgage payment.</p>
                                                    <div className="table-hdr-grid">
                                                        <label className="table-hdr-grid-item-label" >First Payment</label>
                                                        <div className="table-hdr-grid-item-data date" id="firstPay">{monthYear(new Date(data.startDate), 1)}</div>
                                                        <label className="table-hdr-grid-item-label" >Last Payment</label>
                                                        <div id="lastPay" className="table-hdr-grid-item-data date">{result.payOffDate}</div>
                                                    </div>
                                                    <LoanTable value={ltbl} length={ltbl.length}/>
                                                </div>
                                            </Tab>
                                        </Tabs>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    )
}

export default Amortization;