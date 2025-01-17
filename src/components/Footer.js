import Container from "react-bootstrap/Container";
// import {Row, Col} from 'react-bootstrap';

const Footer = () => {
  return (
    <div className="bg-secondary mt-auto">
      <Container className="p-3">
        <div className="footer-section">
          <p className="footer-2">
            Thank You for using this website! We hope it has helped you in
            making a good choice with your home purchase. Once you have found
            the right property, please reach out to us for a formal pre-approval
            or thoughtful advice at
            <a
              href="/contact"
              //   href="https://banksouthmortgage.com/loan-officer/shachi-bhardwaj/"
              //   target="_blank"
              //   rel="noopener noreferrer"
              className="bold-text accent-color"
            >
              &nbsp;contact us.
            </a>
          </p>
          <div className="disclaimer">
            <img
              src="https://uploads-ssl.webflow.com/633834c81badd95acacc6534/633f23a51a598603e95c74df_EHL%20White%20on%20Gray%402x.png"
              loading="lazy"
              alt=""
              className="image-8"
            ></img>
            <div className="text-8">
              Credit and collateral are subject to approval. Terms and
              conditions apply. Rates, program terms and conditions are subject
              to change without notice. Some programs have geographic
              restrictions. This is not a commitment to lend.
            </div>
          </div>
        </div>
        {/* <Row>
                    <Col className="text-center">
                        <a href="/">Instagram</a>
                    </Col>
                    <Col className="text-center">
                        <a href="/">Facebook</a>
                    </Col>
                    <Col className="text-center">
                        <a href="/">Twitter</a>
                    </Col>
                </Row> */}
      </Container>
    </div>
  );
};

export default Footer;
