import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './home.css';
import logo from '../../components/assets/images/guide2solve.png';
import logo_light from '../../components/assets/images/guide2solve light.png';
// import aboutimg from '../../components/assets/images/aboutimg.png';
// import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';

// icons imported as image
import Icon1 from "../../components/assets/images/icon-1.png";
import Icon2 from "../../components/assets/images/icon-2.png";
import Icon3 from "../../components/assets/images/icon-3.png";
import Icon4 from "../../components/assets/images/icon-4.png";
import Icon5 from "../../components/assets/images/icon-5.png";

// images listed in website
import B2B from "../../components/assets/images/b2b.jpg";
import B2C from "../../components/assets/images/b2c.jpg";
import MANUFACTURING from "../../components/assets/images/manufacturing.jpg";

//Lock-icons
import LOCK1 from "../../components/assets/images/icons set/lock-icon1.png";
import LOCK2 from "../../components/assets/images/icons set/lock-icon2.png";
import LOCK3 from "../../components/assets/images/icons set/lock-icon3.png";
import LOCK4 from "../../components/assets/images/icons set/lock-icon4.png";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='total-page-index'>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm p-3 mb-5 bg-body-tertiary rounded">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src={logo} alt="Logo" className="me-2" style={{width:"200px"}}/>
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
                <a className="nav-link" href="#aboutus">ABOUT</a>
              </li>
              {/* <li className="nav-item dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="solutionsDropdown" className="nav-link dropdown-toggle">
                    SOLUTIONS
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#action1">Action 1</Dropdown.Item>
                    <Dropdown.Item href="#action2">Action 2</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
              <li className="nav-item dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="resourcesDropdown" className="nav-link dropdown-toggle">
                    RESOURCES
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#action1">Action 1</Dropdown.Item>
                    <Dropdown.Item href="#action2">Action 2</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li> */}
              <li className="nav-item">
                <a className="nav-link" href="#solution">SOLUTION</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#privacy">PRIVACY</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#subscribe">SUBSCRIBE</a>
              </li>
            </ul>
            <div className="d-flex">
            <Link to="/login"><button className="btn btn-outline-primary me-2"> Login/Signup </button> </Link>
              <a href="mailto:outreach@mail.statix.pro"><button className="btn btn-primary">Contact us</button> </a>
            </div>
          </div>
        </div>
      </nav>
      {/* nav bar ends here */}
      {/* home section starts here */}
       <div className="hero-section container-fluid" >
      <div className="row justify-content-center text-center">
        <div className="col-md-8" >
          <span className="leader-badge">Beta V-0.1</span>
          <h1 className="hero-title">
          Your Startup with Precision Financial <br/>Forecasting <span  style={{color:"#F16635"}}>Using AI</span>
          </h1>
          <p className="hero-subtitle">
          From us - Gain Actionable insights, Plan for Financial Growth, and Get High accuracy in Fund Forecasting 
          </p>
          {/* <div className="cta-buttons "> */}
          <Link to="/login"><button className="btn btn-primary btn-lg me-3">
            Get started
            </button> </Link>
            {/* <button className="btn btn-outline-primary btn-lg">Get started</button> */}
          {/* </div> */}
          {/* <p className="trial-info">Free Demo. Cancel anytime. No hidden charges.</p> */}
        </div>
      </div>

{/* 4 container section starts here */}
<div className="container my-3 positioning-statement-container">
      <hr className="positioning-statement-line" />
      <div className="d-flex justify-content-between align-items-center text-center positioning-statement-row">
        <div className="positioning-statement-item">
        <img src={Icon1} alt="Early-Stage Startups" className="positioning-statement-icon" />
          <span>Specifically designed for startups & small businesses</span>
        </div>
        <div className="positioning-statement-item">
          <img src={Icon2} alt="Effective Financial Tools" className="positioning-statement-icon" />
          <span>10,000+ early-stage startups & entrepreneurs onboard</span>
        </div>
        <div className="positioning-statement-item">
          <img src={Icon3} alt="Comprehensive Application" className="positioning-statement-icon" />
          <span>Scalable financial tools that grow with your business</span>
        </div>
        <div className="positioning-statement-item">
          <img src={Icon4} alt="Comprehensive Application" className="positioning-statement-icon" />
          <span>Engages with your startup in a way that feels unique & relevant</span>
        </div>
        <div className="positioning-statement-item">
          <img src={Icon5} alt="Unique Offering" className="positioning-statement-icon" />
          <span>AI-powered Instant, expert financial advice based on business type</span>
        </div>
      </div>
    </div>
    {/* four container section ends here */}
    </div>
      {/* home section ends here */}

{/* second section about us starts here */}

<div className='container' id='aboutus'>
    <div className='row'>
    <div className='text-center' style={{paddingTop:"50px", paddingBottom:"50px"}}>
            <h6 className="nn-subtitle">About us</h6>
            <h2 className="nn-title">Why startups needs us?</h2>
            </div>
        <div className='col-md-6' style={{marginTop:"20px"}}>
        <div className='second-section-card-one'>
    <div className='second-section-subtitle'>Turn messy numbers into money-making insights
    </div>
    <h3 className='second-section-title'>
    Good-Bye to the spreadsheet headaches
    </h3>
    <div className='second-section-subtext'>
    Streamline your financial management with our all-in-one platform. Monitor sales, track profits, and analyze operating expenses in real-time. With everything in one place, you can focus on what truly matters—growing your business.
    </div>
    </div>
        </div>

        <div className='col-md-6' style={{marginTop:"20px"}}>
        <div className='second-section-card-two'>
    <div className='second-section-subtitle'>Your Business, Empowered by Financial Insights
    </div>
    <h3 className='second-section-title'>
    Harness the power of AI-forecasting
    </h3>
    <div className='second-section-subtext'>
    AI-driven forecasting to make informed decisions. Our platform not only predicts future trends but also offers actionable insights, enabling you to plan strategically and secure the funding your startup needs.
    </div>
    </div>
        </div>
        
    </div>
    
</div>

{/* second section ends here */}


{/* numbers section */}
<div className="container-fluid" style={{marginTop:"60px"}}>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12 value-card-container">
          <div className="row text-center">
          <div className="col-md-6 value-card-header" style={{textAlign:"left"}}>
              <p className="value-card-subtitle" style={{textTransform:"uppercase", fontSize:"13px"}}>Value You Can Measure</p>
              <h2 className="value-card-title-large">Achieve financial clarity and confidence faster than ever before.
              </h2>
            </div>
            <div className="col-md-2 value-card-item">
              <p className="value-card-title">4.2x</p>
              <p className="value-card-subtitle">Improvement in financial decision-making accuracy</p>
            </div>
            <div className="col-md-2 value-card-item">
              <p className="value-card-title">92%</p>
              <p className="value-card-subtitle">Reduction in time spent on financial forecasting</p>
            </div>
            <div className="col-md-2 value-card-item">
              <p className="value-card-title">5x</p>
              <p className="value-card-subtitle">Increase in successful funding rounds</p>
            </div>
          </div>
        </div>
      </div>
    </div>

{/* number section ends here */}


{/* third section starts here */}

<section className="nn-section" id='solution'>
      <div className="nn-container">
        <div className='text-center' style={{paddingTop:"50px", paddingBottom:"30px"}}>
            <h6 className="nn-subtitle">WHAT OTHERS ARE AUTOMATING</h6>
            <h2 className="nn-title">How businesses use <span  style={{color:"#F16635"}}>Guide2Profit </span></h2>
            </div>
            {/* usage 1 */}
        <div className="nn-row">
          <div className="nn-text-col">
            <h6 className="nn-industry">B2B</h6>
            <h3 className="nn-highlight">
            Optimize Client Management and Financial Forecasting
            </h3>
            <p className="nn-description">
            B2B companies can leverage the Sales Forecast feature to project revenue from long-term contracts and recurring clients. They can also use the Break-Even Analysis for pricing bulk orders and service packages, and the Forecast P&L to manage cash flow in longer payment cycles.
            </p>
            <a href="#!" className="nn-link">Explore document types &rarr;</a>
          </div>
          <div className="nn-image-col">
            <img src={B2B} alt="Guide2Profit AI Use Case" className="nn-image" />
          </div>
        </div>
        {/* usage 1 ends here */}

        {/* usage 2 */}
        <div className="nn-row">
        <div className="nn-image-col">
            <img src={B2C} alt="Guide2Profit AI Use Case" className="nn-image" />
          </div>
          <div className="nn-text-col" style={{paddingLeft:"50px"}}>
            <h6 className="nn-industry">B2C</h6>
            <h3 className="nn-highlight">
            Enhance Consumer Insights and Revenue Tracking
            </h3>
            <p className="nn-description">
            B2C companies can leverage the COGS Calculator to track and optimize product costs in a fast-moving consumer goods environment. They can use the Sales Forecast to plan for seasonal demand fluctuations and the Startup Cost calculator to estimate investments for new product lines or store locations.
            </p>
            <a href="#!" className="nn-link">Explore document types &rarr;</a>
          </div>
          
        </div>
        {/* usage 2 ends here */}

        {/* usage 3 */}
        <div className="nn-row">
          <div className="nn-text-col">
            <h6 className="nn-industry">Manufacturers</h6>
            <h3 className="nn-highlight">
            Streamline Supply Chain and Production Costs
            </h3>
            <p className="nn-description">
            Manufacturing companies can employ the COGS Calculator to track raw material costs, labor, and overhead expenses. They can use the Employee Payrolls feature to manage shift-based workforce expenses and leverage the Break-Even Analysis to determine optimal production volumes.
            </p>
            <a href="#!" className="nn-link">Explore document types &rarr;</a>
          </div>
          <div className="nn-image-col">
            <img src={MANUFACTURING} alt="Guide2Profit AI Use Case" className="nn-image" />
          </div>
        </div>
        {/* usage 3 ends here */}


        

        
      </div>
</section>
{/* third section ends here */}


{/* fourth section starts here */}
<div className="container my-5 security-info-container" id='privacy'>
      <div className="row text-center">
        <div className="col-12 security-info-header">
          <img src={LOCK1} alt="Lock Icon" className="security-info-icon" />
          <h2>Your Information is Secure. And It Belongs to You.</h2>
          <p>We implement the highest level of security standards. Your data is always encrypted, ensuring that your financial information remains safe and private.  <br/>We never share your data with third parties.
          </p>
        </div>
      </div>
      <div className="row text-center security-info-items">
        <div className="col-md-4">
          <div className="security-info-item">
            <img src={LOCK2}  alt="Read Only Icon" className="security-info-item-icon" />
            <h5>Encrypted.</h5>
            <p>We utilize advanced encryption to protect your data both at rest and in transit. Only you have access to your financial information.

</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="security-info-item">
            <img src={LOCK3}  alt="Insured Icon" className="security-info-item-icon" />
            <h5>Protected.</h5>
            <p>Your data is safeguarded with the latest security protocols and monitored 24/7 by our dedicated security team, ensuring continuous protection.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="security-info-item">
            <img src={LOCK4}  alt="Independent Icon" className="security-info-item-icon" />
            <h5>Private.</h5>
            <p>We respect your privacy. Your financial data is solely yours and is never shared without your explicit consent. Transparency and privacy are at the core of our service.</p>
          </div>
        </div>
      </div>
    </div>

    {/* fourth section ends here */}

    {/* testimonial starts here */}
    {/* <div id="testimonialCarousel" className="carousel slide testimonial-container" data-bs-ride="carousel">
            <h3 className="testimonial-title">Testimonial</h3>
            <h1 className="testimonial-heading">What Say Our Students</h1>
            
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <div className="testimonial-content">
                        <p className="testimonial-quote">
                            <i className="fas fa-quote-left quote-icon"></i>
                            Dolor eirmod diam stet kasd sed. Aliqu rebum est eos. 
                            Rebum elitr dolore et eos labore, stet justo sed est sed. 
                            Diam sed sed dolor stet amet eirmod eos labore diam.
                        </p>
                        <div className="testimonial-client">
                            <img src="https://via.placeholder.com/80" alt="Client" className="client-img"/>
                            <div className="client-info">
                                <h4 className="client-name">Client Name 1</h4>
                                <p className="client-profession">Profession 1</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    <div className="testimonial-content">
                        <p className="testimonial-quote">
                            <i className="fas fa-quote-left quote-icon"></i>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
                        </p>
                        <div className="testimonial-client">
                            <img src="https://via.placeholder.com/80" alt="Client" className="client-img"/>
                            <div className="client-info">
                                <h4 className="client-name">Client Name 2</h4>
                                <p className="client-profession">Profession 2</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    <div className="testimonial-content">
                        <p className="testimonial-quote">
                            <i className="fas fa-quote-left quote-icon"></i>
                            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.
                        </p>
                        <div className="testimonial-client">
                            <img src="https://via.placeholder.com/80" alt="Client" className="client-img"/>
                            <div className="client-info">
                                <h4 className="client-name">Client Name 3</h4>
                                <p className="client-profession">Profession 3</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="carousel-indicators testimonial-indicators">
                <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="0" className="active" aria-current="true"></button>
                <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="2"></button>
            </div>
        </div> */}
    {/* testimonial ends here */}

    <footer className="bg-dark text-white py-5">
  <div className="container" id='subscribe'>
    <div className="row">
      <div className="col-md-6 mb-4 mb-md-0">
        <img src={logo_light} alt="Logo" className="me-2" style={{ width: "250px" }} />
        <p>Smart Finance, For Every Business Move!</p>
      </div>
      <div className="col-md-6 ">
        <h6>FINANCIAL INSIGHTS TAILORED FOR YOUR BUSINESS STRAIGHT TO YOUR INBOX</h6><br/>
        <form className="mt-3">
          <div className="form-group">
            <input
              type="email"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Your Email"
              style={{ borderRadius: '25px', width:"60%"}}
            />
            <button
              className="btn btn-primary"
              type="submit" style={{borderRadius: '25px',marginLeft:"10px", height:"40px"}}
            >
              Subscribe Now
            </button>
          </div>
        </form>
      </div>
    </div>
    <hr className="my-4" />
    <div className="row">
      <div className="col-md-6 mb-3 mb-md-0">
        <small>© 2024 <a href='https://statix.pro/' style={{textDecoration:"none", color:"#fff"}}>Statix.Pro</a>. AI-Based Digital Marketing & Branding Agency. All Rights Reserved.</small>
      </div>
      <div className="col-md-6 text-md-end">
        <small><a href="./" className="text-white text-decoration-none me-3">Privacy Policy</a></small>
        <small><a href="./" className="text-white text-decoration-none">Terms and Conditions</a></small>
      </div>
    </div>
  </div>
</footer>




    </div>
  );
};

export default Home;
