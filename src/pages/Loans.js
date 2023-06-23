import LoanComp from './loanComp';
import {Fragment} from 'react';

function Loans () {

    return (
        <div className="mb-84 container-fluid">
            <div className="container">
                <div  className="site-container">
                    <div className="content-area">
                        <h3 className="heading-primary centered-text">Loan Rate/Term Sensitivity Analysis</h3>
                        <h4 className="heading-tertiary centered-text">See how loan rate and term affect your monthly payments!</h4>
                        <br></br>
                        <p className="main-text max-text-box"> This simple to use, yet a very helpful comparison chart, lets you see at a glance, 
                        the impact of different rates and loan terms, on your monthly payments. It also shows your total interest payments
                        over the course of the loan (total cost of the loan). This should help you determine the best loan terms that you can afford.
                        </p>
                        <div style={{marginTop:'4rem'}}>
                            <div className='flex flex-row'>
                                <span className="basis-1/3"><LoanComp num={1}/></span>
                                <span className="basis-1/3"><LoanComp num={2}/></span>
                                <span className="basis-1/3"><LoanComp num={3}/></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Loans;