import React from 'react'

export const metadata = {
  title: 'Terms & Conditions | Online Packaging Store',
  description: 'Terms and conditions for using our website and services.',
}

export default function TermsPage() {
  const sections = [
    {
      id: 'terms',
      title: 'Terms & Conditions',
      content: 'Your use of our website constitutes an agreement to the following terms and conditions. PACKAGLY reserves the right to alter these terms and conditions any time with or without preceding notice. We highly recommend you to read this page regularly. We are owners of the materials that are utilized for the production of our products and to keep our product unique and identical, our material is not shared and sold to other parties.'
    },
    {
      id: 'copyright',
      title: 'Copyright',
      content: 'Copyright (c) Packagly.Com ™. All rights are reserved. It is banned to copy or republish any of the materials and software contained on the www.Packagly.Com website. Legal and strict action will be taken against the person who commits this illegal action.'
    },
    {
      id: 'customer-content',
      title: 'Customer Content',
      content: 'A customer who is a registered member is responsible for the privacy of the content of the website and his password as well. He or she is not allowed to share his data with any third party at any cost. It will be considered illegal and unethical to share any type of personal information regarding the website or regarding member registration. Only registered member is allowed to access specific data of web section, which is confidential.'
    },
    {
      id: 'refund',
      title: 'Return and Refund Policy',
      content: 'If some errors are committed in the lot due to the company fault then all payments will be refunded after surety of the consignment checking. The difference in color shade or pixels issues is no claim as fault, misprinting, or custom design issue handling will not be considered as an error in our policy.\n\nMake sure refunding or return policy is only applicable when the company is at fault. The company is not responsible for the difference in color shades and color scheme due to format RBG to CMYK format conversion. Moreover, we are not responsible for distorted or messy designs provided by customers.\n\nFor the order\'s of Mylar bags there is always a flexibility of 0.25inches to 0.50 inches in the bag size depending upon Stock availability.'
    },
    {
      id: 'design-files',
      title: 'Design Files',
      content: 'Packagly.Com ™ will only provide design files at 72 DPI (low resolution). You can get these design files by contacting us on Packagly.Com for a quote.'
    },
    {
      id: 'sales-tax',
      title: 'Sales Tax Policy',
      content: 'A customer who orders from anywhere in the world has to pay sales tax too. The company needs to see your tax exemption certificate at the time of placing your order in case you are tax-exempt.\n\nThe sale tax amount is clearly and separately mentioned in the invoice generated after the order placement.'
    },
    {
      id: 'custom-designs',
      title: 'Customer Specified Designs',
      content: 'Customers can provide us their own designs, as we provide the facility to design their product according to their demanded style but the design should be in a high resolution like a minimum 300 DPI resolution. The provided design should be in CMYK color format otherwise we are not responsible for any kind of difference in the hard copy sample.'
    },
    {
      id: 'overrun',
      title: 'Overrun & Under Run',
      content: 'We are bound to deliver the faithful amount of products ordered along with an extra amount. This extra amount of the product is completely free of cost. In case of fewer products delivered or under-run, the company will just deduct the amount of the delivered products. The company walks behind the general rule of delivering 5% extra or less quantity.'
    },
    {
      id: 'cancellation',
      title: 'Order Cancellation',
      content: 'You can cancel your order, and the order cancellation limit is beyond 24-hours. Such cancellation will carry a charge of 50% of the total order amount to cover work is done in our pre-press department and financial costs associated with cancellation. Packagly.Com doesn\'t guarantee that your order will be canceled beyond the 24-hour’ time limit as initial steps performed within 24-hour of order placement.'
    },
    {
      id: 'change-control',
      title: 'Change Control Strategy',
      content: 'Packagly has the authority to change any section of our website or Terms and Conditions any time with or without notice to the customers of Packagly. The new changes will be in effect as they become the part of terms and conditions of our website. If you keep using the website after new changes to the terms, it will be considered as your agreement to the new changes.'
    }
  ]

  return (
    <div className="privacy-page">
      <style>{`
        .privacy-page {
          background-color: #F3F3F3;
          min-height: 100vh;
          font-family: 'Afacad', sans-serif;
          color: #1c1c1c;
          padding-bottom: 100px;
        }

        .header-bg {
          background-color: #1c1c1c;
          padding: 80px 0;
          color: #fff;
          margin-bottom: 60px;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .page-title {
          font-family: 'Amaranth', sans-serif;
          font-size: 40px;
          margin-bottom: 16px;
        }

        .page-intro {
          font-size: 18px;
          color: #ccc;
          line-height: 1.6;
        }

        .privacy-content {
          background: #fff;
          padding: 60px;
          border-radius: 32px;
          border: 1px solid #e8e4d8;
          box-shadow: 0 10px 40px rgba(0,0,0,0.02);
        }

        .doc-section {
          margin-bottom: 60px;
        }

        .doc-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-family: 'Amaranth', sans-serif;
          font-size: 24px;
          color: #111;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-title::before {
          content: "";
          width: 8px;
          height: 8px;
          background: #f0bc2e;
          border-radius: 50%;
        }

        .section-content {
          font-size: 17px;
          line-height: 1.8;
          color: #555;
          white-space: pre-line;
        }

        .last-update {
          margin-top: 40px;
          padding-top: 40px;
          border-top: 1px solid #f0ede4;
          font-size: 14px;
          color: #999;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .privacy-content { padding: 30px; }
          .page-title { font-size: 32px; }
        }
      `}</style>

      <div className="header-bg">
        <div className="container">
          <h1 className="page-title">Terms & Conditions</h1>
          <p className="page-intro">
            Return and Refund Policy, Copyright, and User Agreements.
            We offer devoted attention towards business transparency for our respectable clients.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="privacy-content">
          {sections.map((section) => (
            <div key={section.id} className="doc-section">
              <h2 className="section-title">{section.title}</h2>
              <div className="section-content">
                {section.content}
              </div>
            </div>
          ))}

          <div className="last-update">
            We at Online Packaging Store may amend these Terms & Conditions at any time with or without notice. 
            The change(s) will be posted on this page. We encourage you to read this page on regular basis.
          </div>
        </div>
      </div>
    </div>
  )
}
