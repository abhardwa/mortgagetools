export function amortization(purchase, action) {
  // purchase => {loanAmt, intRate, term} ; action => "", or "amortization"
  // console.log(purchase);
  const loanTerm = 12 * purchase.term;
  const R = 1 + purchase.intRate / (12 * 100);
  const monthlyRate = purchase.intRate / 100 / 12;
  const X2 = (purchase.loanAmt * R ** loanTerm * (1 - R)) / (1 - R ** loanTerm); // X is monthly loan payment
  const X = (purchase.loanAmt * monthlyRate) / (1 - (1 + monthlyRate) ** -loanTerm);
  // console.log(`Old monthlyPayAmt: ${X2}`);
  // console.log(`New monthlyPayAmt: ${X}`);
  if (action === "amortization") {
    const amortization = [];
    let loanAmount=purchase.loanAmt;
    for (let i = 1; i <= loanTerm + 1; i++) {
      const interest = loanAmount * (R - 1);
      const principal = X - interest;
      loanAmount = loanAmount - (X - interest);
      const loanDict = { id: i, principal: principal, interest: interest, balance: loanAmount };
      amortization.push(loanDict);
    }
    return amortization;
  } else return X;
}
