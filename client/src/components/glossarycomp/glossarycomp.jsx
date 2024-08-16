import React, { useState, useEffect, useMemo, useCallback } from 'react';

function Glossarycomp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');

  const glossaryTerms = useMemo(() => [
{ word: 'Asset', definition: 'Any resource owned by an individual or organization that holds value.', topic: 'Finance' },
{ word: 'Liability', definition: 'A financial obligation or debt owed by an individual or organization.', topic: 'Finance' },
{ word: 'Equity', definition: 'The value of ownership interest in a company, calculated as total assets minus total liabilities.', topic: 'Finance' },
{ word: 'Revenue', definition: 'Income generated from normal business operations and activities.', topic: 'Finance' },
{ word: 'Expense', definition: 'The cost incurred in the process of earning revenue.', topic: 'Finance' },
{ word: 'Net Income', definition: 'The profit of a company after all expenses and taxes have been deducted from revenue.', topic: 'Finance' },
{ word: 'Balance Sheet', definition: 'A financial statement that summarizes a company\'s assets, liabilities, and equity at a specific point in time.', topic: 'Finance' },
{ word: 'Cash Flow', definition: 'The net amount of cash being transferred into and out of a business.', topic: 'Finance' },
{ word: 'Dividend', definition: 'A portion of a company\'s earnings distributed to shareholders.', topic: 'Finance' },
{ word: 'Interest Rate', definition: 'The percentage charged on a loan or paid on savings.', topic: 'Finance' },
{ word: 'Inflation', definition: 'The rate at which the general level of prices for goods and services rises.', topic: 'Economics' },
{ word: 'Stock', definition: 'A type of security that represents ownership in a corporation and a claim on part of its assets and earnings.', topic: 'Finance' },
{ word: 'Bond', definition: 'A fixed income instrument that represents a loan made by an investor to a borrower.', topic: 'Finance' },
{ word: 'Mutual Fund', definition: 'An investment vehicle made up of a pool of funds collected from many investors to invest in securities like stocks and bonds.', topic: 'Finance' },
{ word: 'Capital', definition: 'Wealth in the form of money or assets, used or accumulated in a business by an individual or organization.', topic: 'Finance' },
{ word: 'Depreciation', definition: 'The reduction in the value of an asset over time, particularly in regards to fixed assets.', topic: 'Accounting' },
{ word: 'Amortization', definition: 'The process of gradually paying off a debt over time through regular payments.', topic: 'Accounting' },
{ word: 'Liquidity', definition: 'The ease with which an asset can be converted into cash without affecting its market price.', topic: 'Finance' },
{ word: 'Portfolio', definition: 'A range of investments held by an individual or institution.', topic: 'Finance' },
{ word: 'Risk', definition: 'The possibility of losing some or all of an investment.', topic: 'Finance' },
{ word: 'Yield', definition: 'The income return on an investment, typically expressed as a percentage.', topic: 'Finance' },
{ word: 'Interest', definition: 'The charge for borrowing money, typically expressed as an annual percentage rate.', topic: 'Finance' },
{ word: 'Dividend Yield', definition: 'A financial ratio that shows how much a company pays out in dividends each year relative to its stock price.', topic: 'Finance' },
{ word: 'Market Capitalization', definition: 'The total market value of a company\'s outstanding shares of stock.', topic: 'Finance' },
{ word: 'Price-to-Earnings Ratio (P/E)', definition: 'A valuation ratio of a company\'s current share price compared to its per-share earnings.', topic: 'Finance' },
{ word: 'Gross Domestic Product (GDP)', definition: 'The total value of goods produced and services provided in a country during one year.', topic: 'Economics' },
{ word: 'Inflation Rate', definition: 'The percentage increase in the price level of goods and services over a period of time.', topic: 'Economics' },
{ word: 'Deflation', definition: 'A decrease in the general price level of goods and services.', topic: 'Economics' },
{ word: 'Recession', definition: 'A period of temporary economic decline during which trade and industrial activity are reduced.', topic: 'Economics' },
{ word: 'Depression', definition: 'A long and severe recession in an economy or market.', topic: 'Economics' },
{ word: 'Fiscal Policy', definition: 'The use of government revenue collection and expenditure to influence the economy.', topic: 'Economics' },
{ word: 'Monetary Policy', definition: 'The process by which a central bank manages money supply to achieve specific goals, such as controlling inflation.', topic: 'Economics' },
{ word: 'Exchange Rate', definition: 'The value of one currency for the purpose of conversion to another.', topic: 'Finance' },
{ word: 'Forex', definition: 'Foreign exchange market, where currencies are traded.', topic: 'Finance' },
{ word: 'Hedge', definition: 'An investment made to reduce the risk of adverse price movements in an asset.', topic: 'Finance' },
{ word: 'Futures Contract', definition: 'An agreement to buy or sell an asset at a future date for a price agreed upon today.', topic: 'Finance' },
{ word: 'Option', definition: 'A financial derivative that gives the buyer the right, but not the obligation, to buy or sell an asset at a set price.', topic: 'Finance' },
{ word: 'Derivatives', definition: 'Financial securities whose value is dependent upon or derived from an underlying asset or group of assets.', topic: 'Finance' },
{ word: 'Margin', definition: 'The difference between the value of securities purchased and the loan amount provided by the broker.', topic: 'Finance' },
{ word: 'Leverage', definition: 'The use of borrowed money to increase the potential return of an investment.', topic: 'Finance' },
{ word: 'Arbitrage', definition: 'The simultaneous purchase and sale of an asset to profit from a difference in the price.', topic: 'Finance' },
{ word: 'Short Selling', definition: 'The sale of a security that the seller has borrowed with the intent of repurchasing it later at a lower price.', topic: 'Finance' },
{ word: 'Buyback', definition: 'When a company purchases its own shares from the marketplace, reducing the number of outstanding shares.', topic: 'Finance' },
{ word: 'Initial Public Offering (IPO)', definition: 'The process of offering shares of a private corporation to the public in a new stock issuance.', topic: 'Finance' },
{ word: 'Secondary Market', definition: 'The market where securities that have already been issued are bought and sold.', topic: 'Finance' },
{ word: 'Underwriting', definition: 'The process by which an underwriter brings a new security issue to the market.', topic: 'Finance' },
{ word: 'Volatility', definition: 'A statistical measure of the dispersion of returns for a given security or market index.', topic: 'Finance' },
{ word: 'Beta', definition: 'A measure of a stock\'s volatility in relation to the overall market.', topic: 'Finance' },
{ word: 'Alpha', definition: 'The excess return of an investment relative to the return of a benchmark index.', topic: 'Finance' },
{ word: 'Index', definition: 'A statistical measure of the changes in a portfolio of stocks representing a portion of the overall market.', topic: 'Finance' },
{ word: 'Bull Market', definition: 'A market condition in which the prices of securities are rising or are expected to rise.', topic: 'Finance' },
{ word: 'Bear Market', definition: 'A market condition in which the prices of securities are falling or are expected to fall.', topic: 'Finance' },
{ word: 'Sector', definition: 'A distinct subset of the economy, consisting of businesses that offer the same or similar products or services.', topic: 'Finance' },
{ word: 'Industry', definition: 'A group of companies that are related based on their primary business activities.', topic: 'Finance' },
{ word: 'Credit Rating', definition: 'An evaluation of the credit risk of a prospective debtor, predicting their ability to pay back the debt.', topic: 'Finance' },
{ word: 'Bond Yield', definition: 'The amount of return an investor realizes on a bond.', topic: 'Finance' },
{ word: 'Coupon Rate', definition: 'The annual interest rate paid on a bond, expressed as a percentage of the face value.', topic: 'Finance' },
{ word: 'Treasury Bond', definition: 'A long-term, fixed-interest government debt security with a maturity of more than 10 years.', topic: 'Finance' },
{ word: 'Corporate Bond', definition: 'A debt security issued by a corporation to raise financing for a variety of reasons.', topic: 'Finance' },
{ word: 'Municipal Bond', definition: 'A bond issued by a local government or territory, or their agencies.', topic: 'Finance' },
{ word: 'Junk Bond', definition: 'A high-yield, high-risk security, typically issued by a company seeking to raise capital quickly.', topic: 'Finance' },
{ word: 'Par Value', definition: 'The face value of a bond, or the stock value stated in the corporate charter.', topic: 'Finance' },
{ word: 'Capital Gain', definition: 'The profit from the sale of an asset or investment.', topic: 'Finance' },
{ word: 'Capital Loss', definition: 'The loss incurred when a capital asset decreases in value.', topic: 'Finance' },
{ word: 'Gross Profit', definition: 'The profit a company makes after deducting the costs associated with making and selling its products.', topic: 'Finance' },
{ word: 'Operating Income', definition: 'A company\'s profit after subtracting operating expenses such as wages and cost of goods sold.', topic: 'Finance' },
{ word: 'Return on Investment (ROI)', definition: 'A measure of the profitability of an investment, calculated as the net profit divided by the initial cost of the investment.', topic: 'Finance' },
{ word: 'Earnings Per Share (EPS)', definition: 'The portion of a company\'s profit allocated to each outstanding share of common stock.', topic: 'Finance' },
{ word: 'Dilution', definition: 'The reduction in the ownership percentage of a share of stock caused by the issuance of new shares.', topic: 'Finance' },
{ word: 'Debt-to-Equity Ratio', definition: 'A measure of a company\'s financial leverage, calculated by dividing its total liabilities by stockholders\' equity.', topic: 'Finance' },
{ word: 'Working Capital', definition: 'The difference between a company\'s current assets and current liabilities.', topic: 'Finance' },
{ word: 'Asset Allocation', definition: 'An investment strategy that aims to balance risk and reward by distributing a portfolio\'s assets according to an individual\'s goals, risk tolerance, and investment horizon.', topic: 'Finance' },
{ word: 'Diversification', definition: 'A risk management strategy that mixes a wide variety of investments within a portfolio.', topic: 'Finance' },
{ word: 'Sovereign Debt', definition: 'Debt issued by a national government in a foreign currency in order to finance the issuing country\'s growth and development.', topic: 'Finance' },
{ word: 'Securities', definition: 'Financial instruments that hold value and can be traded, such as stocks, bonds, and options.', topic: 'Finance' },
{ word: 'Commodities', definition: 'Basic goods used in commerce that are interchangeable with other goods of the same type, such as gold or oil.', topic: 'Finance' },
{ word: 'Real Estate Investment Trust (REIT)', definition: 'A company that owns, operates, or finances income-producing real estate.', topic: 'Finance' },
{ word: 'Annuity', definition: 'A financial product that provides a fixed stream of payments to an individual, typically used as an income stream for retirees.', topic: 'Finance' },
{ word: 'Pension Fund', definition: 'A fund established by an employer to facilitate and organize the investment of employees\' retirement funds.', topic: 'Finance' },
{ word: 'Social Security', definition: 'A government program that provides financial assistance to individuals with an inadequate or no income.', topic: 'Finance' },
{ word: 'Medicare', definition: 'A federal health insurance program for people aged 65 and older and certain younger people with disabilities.', topic: 'Healthcare Finance' },
{ word: 'Insurance Premium', definition: 'The amount of money an individual or business pays for an insurance policy.', topic: 'Insurance' },
{ word: 'Deductible', definition: 'The amount you pay for covered health care services before your insurance plan starts to pay.', topic: 'Insurance' },
{ word: 'Copayment', definition: 'A fixed amount you pay for a covered health care service after you\'ve paid your deductible.', topic: 'Insurance' },
{ word: 'Claim', definition: 'A formal request to an insurance company asking for a payment based on the terms of the insurance policy.', topic: 'Insurance' },
{ word: 'Policyholder', definition: 'The individual or entity that owns an insurance policy.', topic: 'Insurance' },
{ word: 'Underwriter', definition: 'A person or company responsible for evaluating and assuming the risk of an insurance policy.', topic: 'Insurance' },
{ word: 'Risk Management', definition: 'The process of identifying, assessing, and controlling threats to an organization\'s capital and earnings.', topic: 'Finance' },
{ word: 'Credit Default Swap (CDS)', definition: 'A financial derivative that allows an investor to "swap" or offset their credit risk with that of another investor.', topic: 'Finance' },
{ word: 'Mortgage', definition: 'A loan used to purchase or maintain real estate, where the property itself serves as collateral.', topic: 'Finance' },
{ word: 'Fixed-Rate Mortgage', definition: 'A mortgage loan that has a fixed interest rate for the entire term of the loan.', topic: 'Finance' },
{ word: 'Adjustable-Rate Mortgage (ARM)', definition: 'A type of mortgage in which the interest rate applied on the outstanding balance varies throughout the life of the loan.', topic: 'Finance' },
{ word: 'Foreclosure', definition: 'The legal process by which a lender takes control of a property, evicts the homeowner, and sells the home after the homeowner is unable to make full principal and interest payments on his or her mortgage.', topic: 'Finance' },
{ word: 'Credit Score', definition: 'A numerical expression based on a level analysis of a person\'s credit files, representing the creditworthiness of that person.', topic: 'Finance' },
{ word: 'Credit Report', definition: 'A detailed report of an individual\'s credit history prepared by a credit bureau.', topic: 'Finance' },
{ word: 'Bankruptcy', definition: 'A legal process through which people or other entities who cannot repay debts to creditors may seek relief from some or all of their debts.', topic: 'Finance' },
{ word: 'Chapter 7 Bankruptcy', definition: 'A form of bankruptcy that involves the liquidation of assets to pay off debts.', topic: 'Finance' },
{ word: 'Chapter 11 Bankruptcy', definition: 'A form of bankruptcy that involves a reorganization of a debtor\'s business affairs, debts, and assets.', topic: 'Finance' },
{ word: 'Chapter 13 Bankruptcy', definition: 'A form of bankruptcy that allows individuals earning a regular income to develop a plan to repay all or part of their debts.', topic: 'Finance' },
{ word: 'Default', definition: 'Failure to repay a debt including interest or principal on a loan or security.', topic: 'Finance' },
{ word: 'Repossession', definition: 'The action of retaking possession of something, in particular when a buyer defaults on payments.', topic: 'Finance' },
{ word: 'Lien', definition: 'A legal right or interest that a lender has in the borrower\'s property, granted until the debt obligation is satisfied.', topic: 'Finance' },
{ word: 'Escrow', definition: 'A financial arrangement where a third party holds and regulates the payment of funds required for two parties involved in a given transaction.', topic: 'Finance' },
{ word: 'Principal', definition: 'The original sum of money borrowed in a loan or put into an investment.', topic: 'Finance' },
{ word: 'Interest-Only Loan', definition: 'A loan in which for a set term the borrower pays only the interest on the principal balance, with the principal balance unchanged.', topic: 'Finance' },
{ word: 'Amortization Schedule', definition: 'A complete table of loan payments showing the amount of principal and the amount of interest that comprise each payment until the loan is paid off at the end of its term.', topic: 'Finance' },
{ word: 'Fixed Income', definition: 'A type of investment that pays investors fixed interest payments until its maturity date, at which point the principal is repaid.', topic: 'Finance' },
{ word: 'Floating Rate', definition: 'An interest rate that moves up and down with the market or an index.', topic: 'Finance' },
{ word: 'Yield Curve', definition: 'A graph that shows the relationship between interest rates and bonds of equal credit quality but different maturities.', topic: 'Finance' },
{ word: 'Hedge Fund', definition: 'An alternative investment fund that uses pooled funds and employs different strategies to earn active return for its investors.', topic: 'Finance' },
{ word: 'Venture Capital', definition: 'Private equity financing that investors provide to startup companies and small businesses that are believed to have long-term growth potential.', topic: 'Finance' },
{ word: 'Private Equity', definition: 'Capital that is not listed on a public exchange, composed of funds and investors that directly invest in private companies.', topic: 'Finance' },
{ word: 'Public Offering', definition: 'The sale of equity shares or other financial instruments to the public in order to raise capital.', topic: 'Finance' },
{ word: 'Equity Crowdfunding', definition: 'A method of raising capital used by startups where many investors can invest small amounts of money.', topic: 'Finance' },
{ word: 'Crowdsourcing', definition: 'The practice of obtaining information or input into a task by enlisting the services of a large number of people.', topic: 'Finance' },
{ word: 'Asset-Backed Security (ABS)', definition: 'A financial security backed by a loan, lease, or receivables against assets other than real estate and mortgage-backed securities.', topic: 'Finance' },
{ word: 'Collateralized Debt Obligation (CDO)', definition: 'A type of structured asset-backed security (ABS) with multiple "tranches" that are used to pay investors in a prescribed sequence, based on the cash flow generated by the underlying assets.', topic: 'Finance' },
{ word: 'Mortgage-Backed Security (MBS)', definition: 'A type of asset-backed security that is secured by a mortgage or collection of mortgages.', topic: 'Finance' },
{ word: 'Subprime Mortgage', definition: 'A type of mortgage that is normally issued by a lending institution to borrowers with low credit ratings.', topic: 'Finance' },
{ word: 'Balloon Payment', definition: 'A large payment due at the end of a balloon loan, such as a mortgage, commercial loan, or other amortized loan.', topic: 'Finance' },
{ word: 'Refinancing', definition: 'The process of replacing an existing loan with a new loan that usually has better terms.', topic: 'Finance' },
{ word: 'Home Equity Loan', definition: 'A type of loan in which the borrower uses the equity of their home as collateral.', topic: 'Finance' },
{ word: 'Reverse Mortgage', definition: 'A type of loan available to homeowners 62 years or older, allowing them to convert part of the equity in their homes into cash.', topic: 'Finance' },
{ word: 'FICO Score', definition: 'A type of credit score created by the Fair Isaac Corporation, widely used by lenders to determine credit risk.', topic: 'Finance' },
{ word: 'Credit Limit', definition: 'The maximum amount of credit that a financial institution extends to a client.', topic: 'Finance' },
{ word: 'Minimum Payment', definition: 'The smallest amount of a credit card bill that a consumer can pay to remain in good standing with the lender.', topic: 'Finance' },
{ word: 'Charge-Off', definition: 'A debt that a creditor has given up on collecting after the debtor has missed payments for several months.', topic: 'Finance' },
{ word: 'Collections', definition: 'The process of pursuing payments of debts owed by individuals or businesses.', topic: 'Finance' },
{ word: 'Repossession', definition: 'The act of taking back property by a lender or seller from the borrower or buyer, usually due to default.', topic: 'Finance' },
{ word: 'Garnishment', definition: 'A court order directing that money or property of a third party (usually wages paid by an employer) be seized to satisfy a debt owed by a debtor to a plaintiff creditor.', topic: 'Finance' },
{ word: 'Settlement', definition: 'An agreement between parties to resolve a dispute or debt, often involving payment by one party in exchange for a release from liability.', topic: 'Finance' },
{ word: 'Credit Counseling', definition: 'Professional advice services that help consumers to pay off their debts and improve their credit.', topic: 'Finance' },
{ word: 'Debt Consolidation', definition: 'The act of combining several loans or liabilities into one loan.', topic: 'Finance' },
{ word: 'Payday Loan', definition: 'A short-term, high-interest loan, typically for a small amount, that is intended to cover a borrower\'s expenses until their next payday.', topic: 'Finance' },
{ word: 'Pawnshop Loan', definition: 'A loan offered by pawnshops where personal property is used as collateral.', topic: 'Finance' },
{ word: 'Title Loan', definition: 'A short-term loan in which the borrower’s vehicle title is used as collateral.', topic: 'Finance' },
{ word: 'Predatory Lending', definition: 'Unfair, deceptive, or fraudulent practices of some lenders during the loan origination process.', topic: 'Finance' },
{ word: 'Usury', definition: 'The practice of making unethical or immoral monetary loans that unfairly enrich the lender.', topic: 'Finance' },
{ word: 'Revolving Credit', definition: 'A type of credit that does not have a fixed number of payments, in contrast to installment credit.', topic: 'Finance' },
{ word: 'Installment Credit', definition: 'A type of credit that has a fixed number of payments, in contrast to revolving credit.', topic: 'Finance' },
{ word: 'Charge Card', definition: 'A type of credit card for which the balance must be paid in full each month.', topic: 'Finance' },
{ word: 'Debit Card', definition: 'A payment card that deducts money directly from a consumer\'s checking account to pay for a purchase.', topic: 'Finance' },
{ word: 'Electronic Funds Transfer (EFT)', definition: 'The electronic transfer of money from one bank account to another, either within a single financial institution or across multiple institutions.', topic: 'Finance' },
{ word: 'Automated Clearing House (ACH)', definition: 'An electronic network for financial transactions in the United States.', topic: 'Finance' },
{ word: 'Wire Transfer', definition: 'A method of transferring money from one bank account to another electronically.', topic: 'Finance' },
{ word: 'Blockchain', definition: 'A decentralized digital ledger that records transactions across many computers so that the record cannot be altered retroactively without the alteration of all subsequent blocks.', topic: 'Finance' },
{ word: 'Cryptocurrency', definition: 'A digital or virtual currency that uses cryptography for security and operates independently of a central bank.', topic: 'Finance' },
{ word: 'Bitcoin', definition: 'A type of digital currency in which a record of transactions is maintained and new units of currency are generated by the computational solution of mathematical problems, and which operates independently of a central bank.', topic: 'Finance' },
{ word: 'Ethereum', definition: 'A decentralized software platform that enables SmartContracts and Distributed Applications (DApps) to be built and run without any downtime, fraud, control, or interference from a third party.', topic: 'Finance' },
{ word: 'Smart Contract', definition: 'A self-executing contract with the terms of the agreement directly written into lines of code.', topic: 'Finance' },
{ word: 'Initial Coin Offering (ICO)', definition: 'An unregulated means by which funds are raised for a new cryptocurrency venture.', topic: 'Finance' },
{ word: 'Token', definition: 'A digital representation of an asset or utility, often used in the context of cryptocurrencies.', topic: 'Finance' },
{ word: 'Stablecoin', definition: 'A type of cryptocurrency that is designed to have a stable value by being backed by a reserve asset.', topic: 'Finance' },
{ word: 'Decentralized Finance (DeFi)', definition: 'A movement that leverages decentralized networks to transform old financial products into trustless and transparent protocols that run without intermediaries.', topic: 'Finance' },
{ word: 'Non-Fungible Token (NFT)', definition: 'A type of digital asset that represents ownership or proof of authenticity of a unique item or piece of content, using blockchain technology.', topic: 'Finance' },
{ word: 'Mining', definition: 'The process of using computer hardware to perform mathematical calculations for the Bitcoin network to confirm transactions and increase security, resulting in new bitcoins being generated.', topic: 'Finance' },
{ word: 'Wallet', definition: 'A digital or physical device that stores the private and public keys necessary for conducting cryptocurrency transactions.', topic: 'Finance' },
{ word: 'Public Key', definition: 'A cryptographic key that can be shared openly to receive cryptocurrency.', topic: 'Finance' },
{ word: 'Private Key', definition: 'A secret cryptographic key that allows the owner to access and manage their cryptocurrency.', topic: 'Finance' },
{ word: 'Fiat Currency', definition: 'A currency that a government has declared to be legal tender, but it is not backed by a physical commodity.', topic: 'Finance' },
{ word: 'Peer-to-Peer (P2P)', definition: 'A decentralized network where two individuals interact directly with each other, without a third-party intermediary.', topic: 'Finance' },
{ word: 'Smart Contract Audit', definition: 'The process of reviewing and analyzing the code of a smart contract to ensure it is secure and behaves as intended.', topic: 'Finance' },
{ word: 'Gas Fee', definition: 'A fee required to conduct a transaction on the Ethereum blockchain, paid to miners who process and validate transactions.', topic: 'Finance' },
{ word: 'Cold Wallet', definition: 'A cryptocurrency wallet that is not connected to the internet, making it more secure against hacking.', topic: 'Finance' },
{ word: 'Hot Wallet', definition: 'A cryptocurrency wallet that is connected to the internet, offering convenience but at higher risk of hacking.', topic: 'Finance' },
{ word: 'Decentralized Exchange (DEX)', definition: 'A type of cryptocurrency exchange that operates without a central authority, allowing users to trade directly with one another.', topic: 'Finance' },
{ word: 'Centralized Exchange (CEX)', definition: 'A cryptocurrency exchange that is operated by a central authority or organization, such as Binance or Coinbase.', topic: 'Finance' },
{ word: 'Staking', definition: 'The process of holding funds in a cryptocurrency wallet to support the operations of a blockchain network, earning rewards in return.', topic: 'Finance' },
{ word: 'Liquidity Pool', definition: 'A collection of funds locked in a smart contract, providing liquidity for decentralized exchanges and other DeFi applications.', topic: 'Finance' },
{ word: 'Yield Farming', definition: 'The process of earning rewards by providing liquidity to decentralized finance (DeFi) platforms.', topic: 'Finance' },
{ word: 'Liquidity Mining', definition: 'A specific type of yield farming where participants earn cryptocurrency rewards for providing liquidity to a decentralized exchange.', topic: 'Finance' },
{ word: 'Governance Token', definition: 'A type of cryptocurrency that gives holders the right to vote on important decisions within a decentralized organization or protocol.', topic: 'Finance' },
{ word: 'Layer 2 Solution', definition: 'A secondary framework or protocol built on top of an existing blockchain to improve its scalability and efficiency.', topic: 'Finance' },
{ word: 'Cross-Chain Compatibility', definition: 'The ability of different blockchain networks to interact and share data with each other.', topic: 'Finance' },
{ word: 'Blockchain Interoperability', definition: 'The ability of blockchains to communicate and share information with each other.', topic: 'Finance' },
{ word: 'Flash Loan', definition: 'A type of uncollateralized loan used in decentralized finance (DeFi) that must be borrowed and repaid within the same transaction.', topic: 'Finance' },
{ word: 'Rug Pull', definition: 'A type of exit scam in the cryptocurrency world where developers abandon a project and run away with investors\' funds.', topic: 'Finance' },
{ word: 'Airdrop', definition: 'A distribution of a cryptocurrency token or coin, usually for free, to numerous wallet addresses.', topic: 'Finance' },
{ word: 'Halving', definition: 'An event in the Bitcoin network that occurs roughly every four years, reducing the reward for mining new blocks by half.', topic: 'Finance' },
{ word: 'Tokenomics', definition: 'The study of the economic aspects of a cryptocurrency, including supply, distribution, and incentives.', topic: 'Finance' },
{ word: 'Whitepaper', definition: 'A document that outlines the vision, technology, and purpose of a cryptocurrency or blockchain project.', topic: 'Finance' },
{ word: 'Proof of Work (PoW)', definition: 'A consensus mechanism used by cryptocurrencies like Bitcoin, where miners compete to solve complex mathematical puzzles to validate transactions.', topic: 'Finance' },
{ word: 'Proof of Stake (PoS)', definition: 'A consensus mechanism where validators are chosen to create new blocks and validate transactions based on the number of coins they hold and are willing to "stake" as collateral.', topic: 'Finance' },
{ word: 'Delegated Proof of Stake (DPoS)', definition: 'A consensus mechanism where stakeholders vote for delegates to validate transactions and create new blocks on their behalf.', topic: 'Finance' },
{ word: 'Double Spend', definition: 'A potential flaw in digital cash schemes where the same digital token can be spent more than once.', topic: 'Finance' },
{ word: 'Hard Fork', definition: 'A radical change to the protocol of a blockchain network that results in a permanent divergence from the previous version, often creating two separate chains.', topic: 'Finance' },
// { word: '51% Attack', definition: 'An attack on a blockchain network where a single entity or group gains control of more than 50% of the network\'s mining hash rate, allowing them to manipulate the blockchain.', topic: 'Finance' },

{ "word": "Capital Costs", "definition": "Expenses incurred for acquiring or upgrading physical assets that will be used for more than one year.", "topic": "Accounting/Finance" },
{ "word": "Capital Work in Progress", "definition": "Costs incurred for projects that are in progress but not yet completed, related to the acquisition or improvement of long-term assets.", "topic": "Accounting/Finance" },
{ "word": "Cash Flow", "definition": "The movement of cash into and out of a business over a specific period.", "topic": "Finance" },
{ "word": "Employee Payrolls", "definition": "Records of employee salaries, wages, bonuses, and deductions.", "topic": "Human Resources/Finance" },
{ "word": "Fixed Expenses", "definition": "Business expenses that remain relatively constant over a period, regardless of the level of output or sales.", "topic": "Accounting/Finance" },
{ "word": "Liabilities", "definition": "Obligations or debts owed by a company to others.", "topic": "Accounting/Finance" },
{ "word": "Revenue Forecasts", "definition": "Projections of future revenue based on historical data, market trends, and other factors.", "topic": "Finance" },
{ "word": "Starting Operations", "definition": "Costs associated with launching a new business or project.", "topic": "Finance" },
{ "word": "Startup Capital", "definition": "Funding required to start a new business or project.", "topic": "Finance" },
{ "word": "Startup Costs", "definition": "Expenses incurred during the initial stages of setting up a new business or project.", "topic": "Finance" },
{ "word": "Variable Costs", "definition": "Costs that fluctuate in proportion to the level of output or sales.", "topic": "Accounting/Finance" },
{ "word": "Break-Even Analysis", "definition": "A financial calculation that determines the point at which total revenue equals total costs (fixed and variable costs). It helps businesses understand how much they need to sell to cover their costs and start making a profit.", "topic": "Finance" },
{ "word": "Cost of Goods Sold (COGS)", "definition": "The direct costs attributable to the production of the goods sold by a company. This includes the cost of materials, labour directly used to create the good, and factory overhead. It excludes indirect expenses such as distribution costs and sales force costs.", "topic": "Accounting/Finance" },
{ "word": "Forecast Profit & Loss (P&L) ", "definition": "A financial statement that projects a company's expected revenues, expenses, and resulting profit or loss over a specific period. It helps businesses make informed decisions about pricing, budgeting, and resource allocation.", "topic": "Finance" },
{ "word": "Sales Forecast", "definition": "A projection of future sales revenue. It helps businesses estimate future performance, plan production and inventory, and manage resources effectively.", "topic": "Finance" }
], []);


  const topics = useMemo(() => [...new Set(glossaryTerms.map(term => term.topic))], [glossaryTerms]);

  const filterTerms = useCallback(() => {
    const filtered = glossaryTerms.filter(term => {
      const matchesSearch = term.word.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTopic = selectedTopic === '' || term.topic === selectedTopic;
      return matchesSearch && matchesTopic;
    });
    const sorted = filtered.sort((a, b) => a.word.localeCompare(b.word));
    setFilteredTerms(sorted);
  }, [searchTerm, selectedTopic, glossaryTerms]);

  useEffect(() => {
    filterTerms();
  }, [filterTerms]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };


  const handleTopicClick = (topic) => {
    setSelectedTopic(topic === selectedTopic ? '' : topic);
  };

  return (
    <div className="content" style={{paddingBottom:"50px"}}>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-9">
            <h5 className="mb-4">Glossary</h5>
            <div className="glossary-list">
              {filteredTerms.map((term, index) => (
                <div key={index} className="glossary-item mb-4">
                    
                    <h6 className="font-weight-bold" style={{borderLeft:"3px solid", paddingLeft:"10px", color:"#EF683A"}} >{term.word}</h6>
                    
                  <p>{term.definition}</p>
                </div>
              ))}
            </div>
          </div>

{/* filter side bar */}
          <div className="col-md-3">
          <div className="filter-sidebar" style={{ backgroundColor: "#FBF4ED", padding: "30px", borderRadius:"20px" }}>
  <h6 style={{ color: "#EF683A" }}>Filters</h6>
  <input
    type="text"
    className="form-control mb-3"
    placeholder="Search terms..."
    value={searchTerm}
    onChange={handleSearch}
  />
  <h6 style={{ color: "#EF683A" }}>Topics</h6>
  <div className="topic-filter" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
    {topics.map(topic => (
      <button
        key={topic}
        className={`btn btn-sm ${selectedTopic === topic ? 'active' : ''}`}
        onClick={() => handleTopicClick(topic)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 'fit-content',
          backgroundColor: '#fff',
          borderRadius: '20px',
        }}
      >
        {topic}
      </button>
    ))}
  </div>
</div>

          </div>


        </div>
      </div>
    </div>
  );
}

export default Glossarycomp;