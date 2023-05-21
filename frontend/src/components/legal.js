import React from "react";

export default function Legal() {
  return (
    <div id="legal">
      <div id="disclaimer">
        <h2>Disclaimer</h2>
        <p>
          Infiniteloldle.com isn't endorsed by Riot Games and doesn't reflect
          the views or opinions of Riot Games or anyone officially involved in
          producing or managing Riot Games properties. Riot Games, and all
          associated properties are trademarks or registered trademarks of Riot
          Games, Inc.
        </p>
        <p>
          Infiniteloldle.com was created under Riot Games'{" "}
          <a href="https://www.riotgames.com/en/legal">"Legal Jibber Jabber"</a>{" "}
          policy using assets owned by Riot Games. Riot Games does not endorse
          or sponsor this project.
        </p>
      </div>

      <div id="privacy">
        <h2>Privacy Policy</h2>
        <p>Effective Date: 21.05.2023</p>
        <p>
          This Privacy Policy describes how Infiniteloldle.com ("we," "us," or
          "our") collects, uses, stores, and protects the personal information
          of users ("you", "user" or "users") who interact with our website and
          services. By accessing or using Infiniteloldle.com, you acknowledge
          and agree to the practices described in this Privacy Policy.
        </p>
        <h3>Information We Collect</h3>
        <h5>1. Account Registration Information</h5>
        <p>
          When you register an account on Infiniteloldle.com, we collect the
          following information:
        </p>
        <ul>
          <li>Nickname (optional)</li>
          <li>
            Country code (retrieved from user's IP address using{" "}
            <a href="https://www.npmjs.com/package/geoip-lite">geoip-lite</a>{" "}
            which uses <a href="https://www.maxmind.com">MaxMind</a> for GeoIP
            data, [we don't store users IP addresses])
          </li>
        </ul>
        <h5>2. Automatically Collected Information</h5>
        <p>
          We may automatically collect certain information about your use of
          Infiniteloldle.com, including:
        </p>
        <ul>
          <li>Timestamp (of the account creation date)</li>
          <li>Token (that is used for authenticating the user)</li>
        </ul>
        <h3>Use of Collected Information</h3>
        <h5>1. Account Creation and Authentication</h5>
        <p>
          The information collected during account registration, including the
          nickname and country code, is used to create your account and
          authenticate you when you access our services. You have the ability to
          change your nickname at any time.
        </p>
        <h5>2. Communication and Account Management</h5>
        <p>
          We may use your contact information to communicate with you regarding
          your account, services, updates, and other relevant information. You
          have the option to delete your account at any time.
        </p>
        <h3>Data Storage and Security</h3>
        <h5>1. Data Retention</h5>
        <p>
          We will retain your personal information only for as long as necessary
          to fulfill the purposes outlined in this Privacy Policy, unless a
          longer retention period is required or permitted by law.
        </p>
        <h5>2. Data Security</h5>
        <p>
          We employ reasonable security measures to protect your personal
          information from unauthorized access, disclosure, alteration, or
          destruction. However, please note that no method of transmission or
          storage over the internet is entirely secure, and we cannot guarantee
          the absolute security of your data.
        </p>
        <h3>Third-Party Services</h3>
        <h5>1. Third-Party Analytics</h5>
        <p>
          We may use third-party analytics tools and services to help us
          understand how users interact with Infiniteloldle.com. These tools may
          collect and analyze information about your use of the website,
          including cookies and usage data, to provide insights and improve our
          services.
        </p>
        <h5>2. Third-Party Links</h5>
        <p>
          Infiniteloldle.com may contain links to third-party websites or
          services. We are not responsible for the privacy practices or content
          of those third-party websites. We encourage you to review the privacy
          policies of any third-party sites you visit.
        </p>
        <h3>Children's Privacy</h3>
        <p>
          Infiniteloldle.com is not intended for children under the age of 16.
          We do not knowingly collect personal information from children. If you
          believe we have inadvertently collected personal information from a
          child, please contact us immediately, and we will take steps to delete
          the information promptly.
        </p>
        <h3>GDPR Compliance</h3>
        <p>
          If you are located in the European Economic Area (EEA), you have
          certain rights under the General Data Protection Regulation (GDPR)
          regarding your personal information. These rights include the right to
          access, rectify, or erase your personal data, as well as the right to
          restrict or object to certain processing activities. To exercise these
          rights, please contact us using the contact information provided
          below.
        </p>
        <h3>Changes to this Privacy Policy</h3>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or legal requirements. We will notify you of any
          material changes by posting the updated Privacy Policy on
          Infiniteloldle.com. Your continued use of the website after such
          changes constitutes your acceptance of the revised Privacy Policy.
        </p>
        <h3>Contact Us</h3>
        <p>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or the privacy practices of Infiniteloldle.com, please
          contact us at{" "}
          <a href="mailto:infiniteloldle@gmail.com">infiniteloldle@gmail.com</a>
          .
        </p>
        <p>
          Please review this Privacy Policy carefully. By using
          Infiniteloldle.com, you consent to the collection, use, and storage of
          your personal information as described in this Privacy Policy.
        </p>
      </div>
    </div>
  );
}
