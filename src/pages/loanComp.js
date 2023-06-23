import { useFetchAmortizationQuery} from '../store/store';
import Skeleton from '../components/Skeleton';
import {Form, Button} from 'react-bootstrap';
import {useState} from 'react';
import {setArgs, setLtable } from '../store/store';
import { useDispatch, useSelector} from 'react-redux';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Slider from "../components/MySlider.js";
import classNames from 'classnames';


function LoanComp({num}) {

    const dispatch = useDispatch();
    const args = useSelector((state) => state.amort.args);
    // const loanData = useSelector((state)=>state.amort.ltable);
    const [loan, setLoan] = useState({
        lamount: 350000,
        lterm: 30,
        lrate: 6.25,
        startDate:(new Date()).toISOString().substring(0, 10),
        recurMAmt: 0,
        recurMDate: (new Date()).toISOString().substring(0, 10),
        recurAAmt: 0,
        recurADate: (new Date()).toISOString().substring(0, 10),
        onePayAmt: 0,
        onePayDate: (new Date()).toISOString().substring(0, 10),
    });
    const [skip, setSkip] = useState(false);
    const [lamountVal, setLamountVal] = useState(350000);
    const [lrateVal, setLrateVal] = useState(6.25);
    const [ltermVal, setLtermVal] = useState(30);
    const [lData, setLData] = useState([{
        month: 0, 
        principal:0,
        interest:0,
        balance:0,
        mPayment:0,
    }]);

    const cardClassName = classNames("rounded shadow-lg card", "card-year"+num);

    const currency = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    const {data, error, isLoading}= useFetchAmortizationQuery(loan,{skip,});
    // console.log(data, error, isLoading);
    let content =<div>Empty Div</div>;
    if(isLoading) {
        content=<Skeleton times={6}/>
    } else if (error) {
        content = <div>Error Fetching Amortization data.</div>
    } else if (data) {
        setLData(data);
        setSkip(true);
        dispatch(setLtable(data));
    };

    const handleOnChange = (e) => {
        setSkip(true);
        // console.log(e.target.id, Number(e.target.value))
        // console.log(loan)
        setLoan(loan=>({...loan, [e.target.id]:Number(e.target.value)})
        );
    };

    const handleOnBlur = (e) => {
        console.log(e.type==='blur' || e.key==='Enter');
        if (e.type==='blur' || e.key==='Enter') {
            if (e.target.id==='lamount') setLamountVal(e.target.value)
            else if (e.target.id==='lrate') setLrateVal(e.target.value)
            else setLtermVal(e.target.value);
            console.log(lamountVal, lrateVal, ltermVal);
            dispatch(
            setArgs({
                key: e.target.id,
                value: Number(e.target.value),
            })
            );
            setSkip(false);
        }
    };

    const handleChange = (e) => {
        // Get the next sibling element
        const target = e.target.parentElement.parentElement.previousElementSibling;
        // console.log(e.target, target);
        if (target.matches('.lamount, .lrate, .lterm'))
            setLoan(loan=>({...loan, [target.id]:Number(e.target.value)}))
        // setValue(e.target.value)
    };

    const handleSliderUpdate = (e) => {
        // Get the next sibling element
        const target = e.target.parentElement.parentElement.previousElementSibling;
        console.log(e);
        // console.log(e.target, target);
        if (target.matches('.lamount, .lrate, .lterm'))
            setLoan(loan=>({...loan, [target.id]:Number(e.target.value)}))
            console.log(e.type==='mouseup');
            if (e.type==='mouseup') {
                dispatch(
                setArgs({
                    key: target.id,
                    value: Number(e.target.value),
                })
                );
                setSkip(false);
            }
        // setValue(e.target.value)
    };

    const handleOnClick = (e) => {
        setSkip(false);
    }

    return (
        <div className="mb-96 container-fluid">
            <div className="container">
                <div  className="site-container  bg-slate-200 ">
                    <Card style={{ width: '100%'}} className={cardClassName}>
                        {/* <Card.Img variant="top" src="holder.js/100px180?text=Image cap" /> */}
                        <Card.Body style={{justifyContent:'center', marginBottom:'5%'}}>
                            {/* <Card.Title className="mt-2" style={{fontSize:'1.8rem', fontWeight:'bold'}}>First Loan</Card.Title> */}
                            {/* <Card.Text>
                            Enter loan amount, interest rate, and term to see your monthly payments and other detail
                            </Card.Text> */}
                            <Form style={{ gridColumn: '1/3', marginLeft:"5%", marginRight:"5%"}}>
                                <Form.Group  className="card-header" style={{display:'flex', justifyContent:'center', marginTop: '-2%', marginLeft:"-8%", marginRight:"-8%"}}>
                                    <Form.Label className="mt-4" style={{fontSize:'2rem',fontWeight:'bold'}}>{num===1?'Reference Loan':'Loan #'+(num-1)}</Form.Label>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className = "mt-8" style={{fontSize:'1.6rem'}}>Loan Amount</Form.Label>
                                    <Form.Control
                                        id='lamount'
                                        style={{fontSize:'1.6rem'}}
                                        className="input-field lamount"
                                        type="number"
                                        value={loan.lamount||''}
                                        min ={1000}
                                        step={1000}
                                        onChange={handleOnChange}
                                        onBlur={handleOnBlur}
                                        onKeyUp={handleOnBlur}
                                    />
                                    <div className="range-slider">
                                        <Slider min ={10000} max={1000000} step={'10000'} summary={false} minmax="none" value={lamountVal} handleChange={handleChange} handleSliderUpdate={handleSliderUpdate}/>
                                    </div>
                                    <Form.Label className = "mt-8" style={{fontSize:'1.6rem'}}>Interest Rate</Form.Label>
                                    <Form.Control
                                        id='lrate'
                                        style={{fontSize:'1.6rem'}}
                                        className="input-field lrate"
                                        type="number"
                                        step="0.125" 
                                        min = "0"
                                        max= "10"
                                        value={loan.lrate||''}
                                        onChange={handleOnChange}
                                        onBlur={handleOnBlur}
                                        onKeyUp={handleOnBlur}
                                    />
                                    <div className="range-slider ">
                                        <Slider min ={1} max={10} step={'.125'} summary={false} minmax="none" value={lrateVal} handleChange={handleChange}  handleSliderUpdate={handleSliderUpdate}/>
                                    </div>
                                    <Form.Label className = "mt-8" style={{fontSize:'1.6rem'}}>Loan Term (Years)</Form.Label>
                                    <Form.Control
                                        id='lterm'
                                        style={{fontSize:'1.6rem'}}
                                        className="input-field lterm"
                                        type="number"
                                        value={loan.lterm||''}
                                        min ={10}
                                        max={30}
                                        step='5'
                                        onChange={handleOnChange}
                                        onBlur={handleOnBlur}
                                        onKeyUp={handleOnBlur}
                                    />
                                    <div className="range-slider ">
                                        <Slider min ={10} max={30} step={'5'} summary={false} minmax="none" value={ltermVal} handleChange={handleChange}  handleSliderUpdate={handleSliderUpdate}/>
                                    </div>
                                    <div style={{marginTop:'5rem', display:'flex', justifyContent:'center'}}>
                                        <Button className='login form-btn' style={{width:'80%', margin:'auto', fontSize:"1.6rem"}} onClick={handleOnClick}>
                                            Calculate Payments
                                        </Button>
                                    </div>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                        <ListGroup className="list-group-flush mt-2" style={{fontSize:'1.6rem', fontWeight:'bold'}}>
                            <ListGroup.Item>
                                <div className="flex justify-between">
                                    <label style={{fontWeight:'bold'}}>Monthly Payment (P&I):&nbsp;</label>
                                    <label>{lData?currency.format(lData[0].mPayment):0}</label>
                                </div>
                        </ListGroup.Item>
                            <ListGroup.Item>
                                <div className="flex justify-between">
                                    <label  style={{fontWeight:'bold'}}>Total Interest:&nbsp;</label>
                                    <label>{currency.format(lData?.map(({interest})=>interest).reduce((cum,cur)=>cum+cur,0))}</label>
                                </div>
                        </ListGroup.Item>
                            <ListGroup.Item>                
                                <div className="flex justify-between">
                                    <label style={{fontWeight:'bold'}}>PayOff Period:&nbsp;</label>
                                    <label>{(lData?.length/12).toFixed(0)}<span>&nbsp;years</span></label>
                                </div>
                        </ListGroup.Item>
                        </ListGroup>
                        {/* <Card.Body>
                            <Card.Link href="#">Card Link</Card.Link>
                            <Card.Link href="#">Another Link</Card.Link>
                        </Card.Body> */}
                    </Card>
                </div>
            </div>
            {/* {content} */}
        </div>
    );
}

export default LoanComp;