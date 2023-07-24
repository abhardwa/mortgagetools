import {useState} from "react";
import months from '../components/months';


function Escrow() {
    const [data, setData] = useState({
                        "strtyr": 2023,
                        "firstPM": 1,
                        "input-ins-hi": 0,
                        "month-due-hi": 0,
                        "input-cushion-hi": 2,
                        "input-ins-mi": 0,
                        "month-due-mi": 0,  
                        "input-cushion-mi": 2,         
                        "input-ins-fi": 0,
                        "month-due-fi": 0,  
                        "input-cushion-fi": 2,   
                        "input-ins-cnt": 0,
                        "month-due-cnt": 0,  
                        "input-cushion-cnt": 2, 
                        "input-ins-ctt": 0,
                        "month-due-ctt": 0,  
                        "input-cushion-ctt": 2,    
                    });
    const out = {
        vmonthlyPymtHi:0,
        vcushionAmtHi:0,
        vmonthlyPymtMi:0,
        vcushionAmtMi:0,
        vmonthlyPymtFi:0,
        vcushionAmtFi:0,
        vmonthlyPymtCnt:0,
        vcushionAmtCnt:0,
        vmonthlyPymtCtt:0,
        vcushionAmtCtt:0,
        hiMonths:0,
        fiMonths:0,
        cntMonths:0,
        cttMonths:0,
        totAnnualPymt:0,
        totMonthlyPymt:0,
        totCushionAmt:0,
        initAmount:0,
        aggrAdjustment:0,
    };

    function calAggrAdjustment() {

        // Calculate the number of months needed for each Insurance and Tax Payment

        out.vmonthlyPymtHi=(data["input-ins-hi"] / 12);
        out.vcushionAmtHi=(out.vmonthlyPymtHi * data["input-cushion-hi"]);
        out.vmonthlyPymtMi=(data["input-ins-mi"] / 12);
        out.vcushionAmtMi=(out.vmonthlyPymtMi * data["input-cushion-mi"]);
        out.vmonthlyPymtFi=(data["input-ins-fi"] / 12);
        out.vcushionAmtFi=(out.vmonthlyPymtFi * data["input-cushion-mi"]);
        out.vmonthlyPymtCnt=(data["input-ins-cnt"] / 12);
        out.vcushionAmtCnt=(out.vmonthlyPymtCnt * data["input-cushion-cnt"]);
        out.vmonthlyPymtCtt=(data["input-ins-ctt"] / 12);
        out.vcushionAmtCtt=(out.vmonthlyPymtCtt * data["input-cushion-ctt"]);

        out.hiMonths = 11 + data["input-cushion-hi"] - (data["month-due-hi"] - data["firstPM"] >= 0 ? data["month-due-hi"] - data["firstPM"] : 11 - data["firstPM"] + data["month-due-hi"] + 1);
        out.fiMonths = 11 + data["input-cushion-fi"] - (data["month-due-fi"] - data["firstPM"] >= 0 ? data["month-due-fi"] - data["firstPM"] : 11 - data["firstPM"] + data["month-due-fi"] + 1);
        out.cntMonths = 11 + data["input-cushion-cnt"] - (data["month-due-cnt"] - data["firstPM"] >= 0 ? data["month-due-cnt"] - data["firstPM"] : 11 - data["firstPM"] + data["month-due-cnt"] + 1);
        out.cttMonths = 11 + data["input-cushion-ctt"] - (data["month-due-ctt"] - data["firstPM"] >= 0 ? data["month-due-ctt"] - data["firstPM"] : 11 - data["firstPM"] + data["month-due-ctt"] + 1);

        out.totAnnualPymt = data["input-ins-hi"] + data["input-ins-mi"] + data["input-ins-fi"] + data["input-ins-cnt"] + data["input-ins-ctt"];
        out.totMonthlyPymt = out.vmonthlyPymtMi + out.vmonthlyPymtHi + out.vmonthlyPymtFi + out.vmonthlyPymtCnt + out.vmonthlyPymtCtt;
        out.totCushionAmt = out.vcushionAmtHi + out.vcushionAmtMi + out.vcushionAmtFi + out.vcushionAmtCnt + out.vcushionAmtCtt;
        
        
        let totPymt =
        out.vmonthlyPymtHi * out.hiMonths + 
        out.vmonthlyPymtFi * out.fiMonths +
        out.vmonthlyPymtCnt * out.cntMonths +
        out.vmonthlyPymtCtt * out.cttMonths;

        let payouts = [];

        payouts.push({ type: "hi", month: data["month-due-hi"], amount: out.vmonthlyPymtHi * 12 });
        // payouts.push({ type: "mi", month: data["month-due-mi"], amount: vmonthlyPymtHi * 12 });
        payouts.push({ type: "fi", month: data["month-due-fi"], amount: out.vmonthlyPymtFi * 12 });
        payouts.push({ type: "cnt", month: data["month-due-cnt"], amount: out.vmonthlyPymtCnt * 12 });
        payouts.push({ type: "ctt", month: data["month-due-ctt"], amount: out.vmonthlyPymtCtt * 12 });

        const [resultsTbl, aggrAdjAmt] = bldPymtTbl(data["firstPM"], out.totMonthlyPymt, payouts, out.totCushionAmt, totPymt);

        out.initAmount = resultsTbl[0].bal;
        out.aggrAdjustment = aggrAdjAmt;

        return (generateTable(resultsTbl));

        // Function to build the Trial Balance for 12 months
        function bldPymtTbl(sMonth, pymt, payouts, cushion, initBal) {
            // Initialize the counters and table
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let payoutAmt = 0;
            let lowBal = initBal;
            let tbl = [{ aggrMonth: "", payment: 0, payout: 0, bal: initBal }];
            for (let i = 0; i < 12; i++) {
            const currMonth = sMonth + i < 12 ? sMonth + i : ((sMonth + i) % 11) - 1;
            payoutAmt = 0;
            for (let t = 0; t < 4; t++) {
                payoutAmt = payouts[t].month === currMonth ? payoutAmt + payouts[t].amount : payoutAmt;
            }
            tbl.push({ aggrMonth: currMonth, payment: pymt, payout: payoutAmt.toFixed(2), bal: tbl[i].bal + pymt - payoutAmt });
            lowBal = tbl[i + 1].bal > lowBal ? lowBal : tbl[i + 1].bal;
            }
            // console.log(tbl);
            const aggrAdjAmt = cushion - lowBal;
            // Now recalculate the balances based on the aggregate adjustment
            for (let i = 0; i < 13; i++) {
            tbl[i].bal = tbl[i].bal + aggrAdjAmt;
            }
            for (let i = 0; i < 13; i++) {
            tbl[i].bal = tbl[i].bal.toFixed(2);
            tbl[i].aggrMonth = tbl[i].aggrMonth === "" ? " " : months[tbl[i].aggrMonth];
            }
            return [tbl, aggrAdjAmt];
        }

        // Function to load the Trial balance in a table and present it on the web page
        function generateTable(data) {
            const hdr = ["Aggregate Month", "Monthly Payment", "Distribution", "Balance"];

            // delete existing table
            // const table = document.getElementById("dyna-tbl");
            // console.log(table);
            // if (table) table.parentNode.removeChild(table);
            const renderHeader = () => {
                return <tr> 
                    {hdr.map((item, idx) => <th  className="banner" key={idx}>{item}</th>)}
                    </tr>
            }

            const renderBody = () => {
                return data.map(({ aggrMonth, payment, payout, bal }) => {
                    return <tr key={aggrMonth} >
                                <td >{aggrMonth}</td>
                                <td >{payment&&payment.toFixed(2)}</td>
                                <td >{payout}</td>
                                <td >{bal}</td>
                            </tr>
                })
            }
            // console.log(renderBody);
            return (
                <div  className="w-2/3" style={{ margin:'auto' }}>
                    <h1>Escrow Table</h1>
                    <table>
                        <tbody>
                            {renderHeader()}
                            {renderBody()}
                        </tbody>
                    </table>
                </div>
            );
            
        }
    }

    const escrowTbl = calAggrAdjustment();
    
    const handleChange = (e) => {
        setData(data => {
            return {
            ...data, [e.target.id]:Number(e.target.value)
            }
        });
    };
    // console.log(out)
    return (
        <div id="aggrAdjustment" className="tabcontent">
    <div className="container-fluid">
        <div className="page-content">
            <form className="contact" name="goodcalc" id="goodcalc">
                <div className="content-area">
                    <h3 className="heading-primary">Escrow Amount Calculator</h3>
                    <h4 className="heading-tertiary">What is Escrow and how much Escrow amount do you need at closing? </h4>
                    <br></br>
                    <p className="main-text">
After you purchase a home, your lender will establish an escrow account to pay for your taxes and insurance. After
closing, your mortgage servicer takes a portion of your monthly mortgage payment and holds it in the escrow account
until your tax and insurance payments are due. <br></br><br></br>


A federally mandated formula is used to figure out exactly how much money is needed to satisfy this initial deposit into the escrow account. 
Your tax bill and insurance premiums can change from year to year.
Your servicer will determine your escrow payments for the next year based on what bills they paid the previous year. To
ensure there is enough cash in escrow, most lenders require a minimum of 2 months worth of extra payments to be held in
your account.<br></br><br></br>


Your lender or servicer will analyze your escrow account annually to make sure they are not collecting too much or too
little. If their analysis of your escrow account determines that they have collected too much money for taxes and
insurance, they will give you what is called an escrow refund. If their analysis shows they have collected too little, you will need to cover the difference. </p><br></br>
                </div>
                <article className="input-fields">
                    <div className="top-section">
                        <p className="year">
                            <label>Start Year:</label>
                            <input type="number" id="strtyr" name="strtyr" className="input-field" value={data.strtyr} min="1900"
                                 onChange={handleChange}/>
                        </p>
                        <p className="first-month">
                            <label>Month of 1<sup>st</sup> Loan Payment:</label>
                            <select name="firstPM" id="firstPM" className="input-field" value={data.firstPM} onChange={handleChange}>
                                {months.map((month, idx) => (
                                    <option key= {idx} value={month.value}>{month.label}</option>
                                ))}
                            </select>
                        </p>
                    </div>
                    <table className="GoodResults small-text  right-text">
                        <tbody>
                            <tr className = "bold-text">
                                <th className="banner">Expense Type</th>
                                <th className="banner">Annual Payment</th>
                                <th className="banner">Month Due</th>
                                <th className="banner">Cushion</th>
                                <th className="banner">Monthly Payment</th>
                                <th className="banner">Cushion Amount</th>

                            </tr>
                            <tr>
                                <td>Homeowner's Insurance:</td>
                                <td><input type="number" className="amts input-field" id="input-ins-hi" name="input-ins-hi"
                                        step="any" value = {data["input-ins-hi"]} onChange={handleChange}/></td>
                                <td>
                                    <select id="month-due-hi" className="input-field" name="month-due-hi" value={data["month-due-hi"]} onChange={handleChange}>
                                        {months.map((month, idx) => (
                                            <option key= {idx} value={month.value}>{month.label}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select id="input-cushion-hi" name="input-cushion-hi" className="input-field" value = {data["input-cushion-hi"]} onChange={handleChange}>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2" defaultValue="">2</option>
                                    </select>
                                </td>

                                <td><span id="monthly-pymt-hi">{out.vmonthlyPymtHi.toFixed(2)}</span></td>
                                <td><span id="cushion-amt-hi">{out.vcushionAmtHi.toFixed(2)}</span></td>

                            </tr>
                            <tr>
                                <td>Mortgage Insurance:</td>
                                <td><input type="number" id="input-ins-mi" className="amts input-field" name="input-ins-mi"
                                        step="any"  value = {data["input-ins-mi"]} onChange={handleChange}/></td>
                                <td>
                                    <select id="month-due-mi" name="month-due-mi" className="input-field" value = {data["month-due-mi"]} onChange={handleChange}>
                                        <option value="-1">n/a</option>
                                        <option value="0" defaultValue="">All Months</option>
                                    </select>
                                </td>
                                <td>
                                    <select id="input-cushion-mi" name="input-cushion-mi" className="input-field" value = {data["input-cushion-mi"]} onChange={handleChange}>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2" defaultValue="">2</option>
                                    </select>
                                </td>

                                <td><span id="monthly-pymt-mi" >{out.vmonthlyPymtMi.toFixed(2)}</span></td>
                                <td><span id="cushion-amt-mi" >{out.vcushionAmtMi.toFixed(2)}</span></td>

                            </tr>
                            <tr>
                                <td>Flood Insurance:</td>
                                <td><input type="number" id="input-ins-fi" className="amts input-field" name="input-ins-fi"
                                        step="any"  value = {data["input-ins-fi"]} onChange={handleChange}/></td>
                                <td>
                                    <select id="month-due-fi" name="month-due-fi"  value = {data["month-due-fi"]} onChange={handleChange} className="input-field">
                                        {months.map((month, idx) => (
                                            <option key= {idx} value={month.value}>{month.label}</option>
                                        ))}                                
                                    </select>
                                </td>
                                <td>
                                    <select id="input-cushion-fi" name="input-cushion-fi" className="input-field"  value = {data["input-cushion-fi"]} onChange={handleChange}>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2" defaultValue="">2</option>
                                    </select>
                                </td>
                                <td><span id="monthly-pymt-fi" value={out.vmonthlyPymtFi.toFixed(2)}>0.00</span></td>
                                <td><span id="cushion-amt-fi" value={out.vcushionAmtFi.toFixed(2)}>0.00</span></td>

                            </tr>
                            <tr>
                                <td>County Taxes:</td>
                                <td><input type="number" id="input-ins-cnt" className="amts input-field"
                                        name="input-ins-cnt" step="any"  value = {data["input-ins-cnt"]} onChange={handleChange}/></td>
                                <td>
                                    <select id="month-due-cnt" name="month-due-cnt" className="input-field"   value = {data["month-due-cnt"]} onChange={handleChange}>
                                        {months.map((month, idx) => (
                                            <option key= {idx} value={month.value}>{month.label}</option>
                                        ))}                                
                                    </select>
                                </td>
                                <td>
                                    <select id="input-cushion-cnt" name="input-cushion-cnt" className="input-field"   value = {data["input-cushion-cnt"]} onChange={handleChange}>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2" defaultValue="">2</option>
                                    </select>
                                </td>

                                <td><span id="monthly-pymt-cnt" >{out.vmonthlyPymtCnt.toFixed(2)}</span></td>
                                <td><span id="cushion-amt-cnt" >{out.vcushionAmtCnt.toFixed(2)}</span></td>

                            </tr>
                            <tr>
                                <td>City Taxes:</td>
                                <td><input type="number" id="input-ins-ctt" className="amts input-field"
                                        name="input-ins-ctt" step="any" value = {data["input-ins-ctt"]} onChange={handleChange}/></td>
                                <td>
                                    <select id="month-due-ctt" name="month-due-ctt" className="input-field" value = {data["month-due-ctt"]} onChange={handleChange}>
                                        {months.map((month, idx) => (
                                            <option key= {idx} value={month.value}>{month.label}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select id="input-cushion-ctt" name="input-cushion-ctt" className="input-field" value = {data["input-cushion-ctt"]} onChange={handleChange}>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2" defaultValue="">2</option>
                                    </select>
                                </td>

                                <td><span id="monthly-pymt-ctt" >{out.vmonthlyPymtCtt.toFixed(2)}</span></td>
                                <td><span id="cushion-amt-ctt" >{out.vcushionAmtCtt.toFixed(2)}</span></td>
                            </tr>
                            <tr >
                                <td><b>Total:</b></td>
                                <td><span id="tot-annual-pymt">{out.totAnnualPymt.toFixed(2)}</span></td>
                                <td><span id="cc1"></span></td>
                                <td></td>
                                <td><span id="tot-monthly-pymt">{out.totMonthlyPymt.toFixed(2)}</span></td>
                                <td><span id="tot-cushion-amt" >{out.totCushionAmt.toFixed(2)}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </article>
                <table className="GoodResults  small-text  right-text bold-text ">
                    <tbody>
                        <tr>
                            <th className="banner left-text">Closing Disclosure</th>
                            <th className="banner"></th>
                        </tr>
                        <tr>
                            <td>Initial Escrow Payment at Closing</td>
                            <td className="" id="calc-initial-amt">{out.initAmount}</td>
                        </tr>
                        <tr>
                            <td>
                                Homeowner's Insurance: <span id="calc-hi-mths" >{out.vmonthlyPymtHi > 0 ? out.vmonthlyPymtHi.toFixed(2):'__'}</span> per
                                month
                                for
                                <span id="hi-months">{out.vmonthlyPymtHi > 0 ? out.hiMonths:'__'}</span> month(s)
                            </td>
                            <td id="calc-hi-amt" >{out.vmonthlyPymtHi > 0 ? (out.vmonthlyPymtHi * out.hiMonths).toFixed(2):'0.00'}</td>
                        </tr>
                        <tr>
                            <td>
                                Mortgage Insurance: <span id="calc-mi-mths">__</span> per month
                                for
                                <span id="mi-months">__</span> month(s)
                            </td>
                            <td id="calc-mi-amt">0.00</td>
                        </tr>
                        <tr>
                            <td>
                                Flood Insurance: <span id="calc-fi-mths" >{out.vmonthlyPymtFi > 0 ? out.vmonthlyPymtFi.toFixed(2):'__'}</span> per month
                                for
                                <span id="fi-months"  >{out.vmonthlyPymtFi > 0 ? out.fiMonths:'__'}</span> month(s)
                            </td>
                            <td id="calc-fi-amt" >{out.vmonthlyPymtFi > 0 ? (out.vmonthlyPymtFi * out.fiMonths).toFixed(2):'0.00'}</td>
                        </tr>
                        <tr>
                            <td >
                                County Taxes: <span id="calc-cnt-mths" >{out.vmonthlyPymtCnt > 0 ? out.vmonthlyPymtCnt.toFixed(2):'__'}</span> per month for
                                <span id="cnt-months" >{out.vmonthlyPymtCnt > 0 ? out.cntMonths:'__'}</span> month(s)
                            </td>
                            <td id="calc-cnt-amt" >{out.vmonthlyPymtCnt > 0 ? (out.vmonthlyPymtCnt * out.cntMonths).toFixed(2):'0.00'}</td>
                        </tr>

                        <tr>
                            <td>
                                City Taxes: <span id="calc-ctt-mths"  >{out.vmonthlyPymtCtt > 0 ? out.vmonthlyPymtCtt.toFixed(2):'__'}</span> per month for
                                <span  id="ctt-months" >{out.vmonthlyPymtCtt > 0 ? out.cttMonths:'__'}</span> month(s)
                            </td>
                            <td id="calc-ctt-amt" >{out.vmonthlyPymtCtt > 0 ? (out.vmonthlyPymtCtt * out.cttMonths).toFixed(2):'0.00'}</td>
                        </tr>
                        <tr>
                            <td>Aggregate Adjustment:</td>
                            <td className="" id="aggr-adj">{out.aggrAdjustment.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    </div>
    <div>
        {escrowTbl}
    </div>
</div>

    )
}

export default Escrow;