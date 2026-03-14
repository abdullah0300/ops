import React from 'react'

export const metadata = {
  title: 'Privacy and Security | Online Packaging Store',
  description: 'Our commitment to your privacy and the security of your data.',
}

export default function PrivacyPage() {
  const sections = [
    {
      id: 'commitment',
      title: 'Privacy Commitment',
      content: 'Online Packaging Store is faithful to maintaining the secrecy of our customers. We do not share, sell, or reveal information about our clients to any other party except as required to process and ship purchases. We know the importance of privacy of data of our beloved customers.'
    },
    {
      id: 'security',
      title: 'Information security',
      content: 'We the team of Online Packaging Store understands, believes and maintains a strict privacy of our website users and customers’ information. Any data regarding order processing or from any investigation is not distributed, or sold to other party except as required for customer service.'
    },
    {
      id: 'registration',
      title: 'Registration',
      content: 'Data which is required to register a member is our Responsibility. Online Packaging Store is not allow to share your personal information at any cost. It’s our foremost duty to keep your data safe and secure and we assure you that we will never disclose your precious data to anybody. A registration form is filled to get yourself registered.'
    },
    {
      id: 'order',
      title: 'Order',
      content: 'Online Packaging Store gives you an order form to place your order, information collect at the time of order placement is private and confidential. We use this data only for the preparation of the placed order. A user must provide contact information such as name, email, address and financial information such as credit card number, which is keep as crucial data of customer. Customer’s financial information will be shared with our service providers and third parties such as banking institutions, credit card and shipping companies only.'
    },
    {
      id: 'cookies',
      title: 'Cookies',
      content: 'A cookie is a piece of data stored on the user’s computer tied to information about the user. We use persistent cookies. A persistent cookie is a small text file stored on the user’s hard drive for an extended period of time. Persistent cookies can be removed by following Internet browser help file directions. Online Packaging Store save it to make the each customer identical.'
    },
    {
      id: 'transitions',
      title: 'Business Transitions',
      content: 'If Online Packaging Store goes through a business transition such as sold to, merged with another company, or declaration of bankruptcy, the transfer of assets will include some or all of the information collected from our website users and customers. It is a part of our legal policy.'
    },
    {
      id: 'notifications',
      title: 'Notification of Changes',
      content: 'If we decide to change our privacy policy, we will post those changes to this privacy statement, we will use information in harmony with the privacy policy under which the information was collected. If, we are going to use users’ personally identifiable information in a manner different from that stated at the time of collection Online Packaging Store will notify users via email.'
    },
    {
      id: 'disclaimer',
      title: 'Legal Disclaimer',
      content: 'Though we make every effort to preserve user privacy, we may need to disclose personal information when required by law wherein we have a good-faith belief that such action is necessary to comply with a current judicial proceeding, a court order or legal process served on Online Packaging Store Web site.'
    },
      {
        id: 'offers',
        title: 'Updates about special offers',
        content: 'This is the part of policy of Online Packaging Store only for Established members, they will occasionally receive information on products, services, special deals, and a newsletter. Out of respect for the privacy of our users, we present the option to not receive these types of communications. Moreover you can request manually to get such types of e-mails.'
      },
      {
        id: 'payment-terms',
        title: 'Payment Terms & Methods',
        content: 'We offer multiple secure payment options for our customers’ convenience. We currently accept payments via PayPal, MasterCard, Visa, American Express, Payoneer, and Cash App. Additionally, we facilitate direct Wire Transfers for bulk orders. All financial transactions are processed through secure, industry-standard gateways to ensure your data is protected at all times.'
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
          <h1 className="page-title">Privacy and Security</h1>
          <p className="page-intro">
            The Online Packaging Store is a well reputed and responsible growing company. 
            We earn a name in the field of packaging and we offer you secure business terms, 
            paying devoted attention towards business privacy for our respectable clients.
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
            We at Online Packaging Store may amend this Privacy Policy at any time with or without notice. 
            The change(s) will be posted on this page. We encourage you to read this page on regular basis.
          </div>
        </div>
      </div>
    </div>
  )
}
