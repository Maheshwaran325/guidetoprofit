import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './home.css';
import logo from '../../components/assets/images/guide2solve.png';
// import aboutimg from '../../components/assets/images/aboutimg.png';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';


const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='total-page-index'>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm p-3 mb-5 bg-body-tertiary rounded">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src={logo} alt="Logo" className="me-2" style={{width:"150px"}} />
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
              <li className="nav-item dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="platformDropdown" className="nav-link dropdown-toggle">
                    PLATFORM
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#action1">Action 1</Dropdown.Item>
                    <Dropdown.Item href="#action2">Action 2</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
              <li className="nav-item dropdown">
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
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#m">PRICING</a>
              </li>
            </ul>
            <div className="d-flex">
            <Link to="/login"><button className="btn btn-outline-primary me-2"> Get Started </button> </Link>
              <button className="btn btn-primary">Request a Demo</button>
            </div>
          </div>
        </div>
      </nav>
      {/* nav bar ends here */}
      {/* home section starts here */}
       <div className="hero-section container-fluid" >
      <div className="row justify-content-center text-center">
        <div className="col-md-8">
          <span className="leader-badge">Leader 2024</span>
          <h1 className="hero-title">
          Your Startup with Precision Financial <br/>Forecasting <span  style={{color:"#F16635"}}>Using AI</span>
          </h1>
          <p className="hero-subtitle">
          From us - Gain Actionable insights, Plan for Financial Growth, and Get High accuracy in Fund Forecasting 
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-lg me-3">
              Book a Demo
            </button>
            <button className="btn btn-outline-primary btn-lg">Get started</button>
          </div>
          <p className="trial-info">Free Demo. Cancel anytime. No hidden charges.</p>
        </div>
      </div>
    </div>
      {/* home section ends here */}

{/* second section about us starts here */}

<div className='container'>
    <div className='row'>
    <div className='text-center' style={{paddingTop:"50px", paddingBottom:"50px"}}>
            <h6 className="nn-subtitle">About us</h6>
            <h2 className="nn-title">Why startups needs us?</h2>
            </div>
        <div className='col-6'>
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

        <div className='col-6'>
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
          <div className="col-6 value-card-header" style={{textAlign:"left"}}>
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

<section className="nn-section">
      <div className="nn-container">
        <div className='text-center' style={{paddingTop:"50px", paddingBottom:"30px"}}>
            <h6 className="nn-subtitle">WHAT OTHERS ARE AUTOMATING</h6>
            <h2 className="nn-title">How businesses use CashCompass</h2>
            </div>
            {/* usage 1 */}
        <div className="nn-row">
          <div className="nn-text-col">
            <h6 className="nn-industry">B2B</h6>
            <h3 className="nn-highlight">
            Optimize Client Management and Financial Forecasting
            </h3>
            <p className="nn-description">
            Manage complex client portfolios and streamline financial operations. Our system allows B2B businesses to track sales cycles, optimize cash flow, and generate accurate financial forecasts to drive strategic decisions.
            </p>
            <a href="#!" className="nn-link">Explore document types &rarr;</a>
          </div>
          <div className="nn-image-col">
            <img src="path_to_your_image.png" alt="Cashcompass AI Use Case" className="nn-image" />
          </div>
        </div>
        {/* usage 1 ends here */}

        {/* usage 2 */}
        <div className="nn-row">
        <div className="nn-image-col">
            <img src="path_to_your_image.png" alt="Cashcompass AI Use Case" className="nn-image" />
          </div>
          <div className="nn-text-col">
            <h6 className="nn-industry">B2C</h6>
            <h3 className="nn-highlight">
            Enhance Consumer Insights and Revenue Tracking
            </h3>
            <p className="nn-description">
            For B2C businesses, our system offers deep insights into consumer behavior, allowing you to align financial planning with customer demands. Monitor revenue streams, manage expenses, and adjust strategies in real-time to stay ahead in a competitive market.
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
            Manufacturers can leverage our system to manage and optimize supply chains, reduce production costs, and maintain financial accuracy across all stages of manufacturing. From raw material procurement to product delivery, keep your finances in check and operations running smoothly.
            </p>
            <a href="#!" className="nn-link">Explore document types &rarr;</a>
          </div>
          <div className="nn-image-col">
            <img src="path_to_your_image.png" alt="Cashcompass AI Use Case" className="nn-image" />
          </div>
        </div>
        {/* usage 3 ends here */}


        

        
      </div>
</section>
{/* third section ends here */}


{/* fourth section starts here */}
<div className="container my-5 security-info-container">
      <div className="row text-center">
        <div className="col-12 security-info-header">
          <img src="lock-icon.png" alt="Lock Icon" className="security-info-icon" />
          <h2>Your information is secure. And it belongs to you.</h2>
          <p>We use the same security measures as banks, governments, and the military. Your information is always encrypted, and we won’t sell your data to third parties.</p>
        </div>
      </div>
      <div className="row text-center security-info-items">
        <div className="col-md-4">
          <div className="security-info-item">
            <img src="read-only-icon.png" alt="Read Only Icon" className="security-info-item-icon" />
            <h5>Read only.</h5>
            <p>We can only fetch your information. No one can touch your money.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="security-info-item">
            <img src="insured-icon.png" alt="Insured Icon" className="security-info-item-icon" />
            <h5>Insured.</h5>
            <p>You can feel reassured because we're insured by Beazley.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="security-info-item">
            <img src="independent-icon.png" alt="Independent Icon" className="security-info-item-icon" />
            <h5>Independent.</h5>
            <p>Established in 2012. Hundreds of thousands of South Africans trust us with their money stuff.</p>
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




    </div>
  );
};

export default Home;
