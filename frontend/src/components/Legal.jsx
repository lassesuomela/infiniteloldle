import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Legal() {
  const [isCopied, setIsCopied] = useState(false);

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
          <a
            href="https://www.riotgames.com/en/legal"
            target="_blank"
            rel="noreferrer"
          >
            Legal Jibber Jabber
          </a>{" "}
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
            Country code (retrieved from user's IP address, [we don't store
            users IP addresses in database])
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
          authenticate you when you access our services.
        </p>
        <h5>2. Account Management</h5>
        <p>
          You have the option to delete your account at any time from settings
          and also you have the ability to change your nickname at any time.
        </p>
        <h5>3. Keeping track of statistics</h5>
        <p>
          Part of the token is used as unique value when keeping track of unique
          daily active users.
        </p>
        <h3>Cookies</h3>
        <p>
          We use cookies on our website. Cookies are small text files that are
          placed on a user's device when they visit a website, serving various
          purposes such as remembering user preferences, analyzing website
          usage, and personalizing the user experience.
        </p>
        <h5>Technical:</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>isTokenValid</td>
              <td>
                Used to instruct browser to not send requests to server trying
                to verify token that has been verified.
              </td>
            </tr>
            <tr>
              <td>cf_clearance</td>
              <td>
                Used to identify trusted web traffic and distinguish it from
                malicious traffic on websites protected by Cloudflare.
              </td>
            </tr>
          </tbody>
        </table>
        <h5>Advertisement or analytics:</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1P_JAR</td>
              <td>
                Used to gather website statistics and track conversion rates.
              </td>
            </tr>
            <tr>
              <td>AEC</td>
              <td>
                Used to store user preferences and display relevant
                advertisements on Google properties.
              </td>
            </tr>
            <tr>
              <td>APISID</td>
              <td>
                Used to store user preferences and information for personalized
                ads on Google properties.
              </td>
            </tr>
            <tr>
              <td>CONSENT</td>
              <td>
                Used to store the user's consent status for Google services.
              </td>
            </tr>
            <tr>
              <td>HSID</td>
              <td>
                Used to authenticate users, prevent fraudulent use of login
                credentials, and protect user data from unauthorized access.
              </td>
            </tr>
            <tr>
              <td>NID</td>
              <td>
                Used to store user preferences and enable personalized ads on
                Google properties.
              </td>
            </tr>
            <tr>
              <td>S</td>
              <td>
                Used to maintain user session information and enable essential
                website functions.
              </td>
            </tr>
            <tr>
              <td>SAPISID</td>
              <td>
                Used to store user preferences and information for personalized
                ads on Google properties.
              </td>
            </tr>
            <tr>
              <td>SEARCH_SAMESITE</td>
              <td>
                Used to prevent certain types of cross-site request forgery
                (CSRF) attacks.
              </td>
            </tr>
            <tr>
              <td>SID</td>
              <td>
                Used to authenticate users, prevent fraudulent use of login
                credentials, and protect user data from unauthorized access.
              </td>
            </tr>
            <tr>
              <td>SIDCC</td>
              <td>Used to protect user data from unauthorized access.</td>
            </tr>
            <tr>
              <td>SSID</td>
              <td>
                Used to store user preferences and enable personalized ads on
                Google properties.
              </td>
            </tr>
            <tr>
              <td>__Secure-1PAPISID</td>
              <td>
                Used to store user preferences and information for personalized
                ads on Google properties.
              </td>
            </tr>
            <tr>
              <td>__Secure-1PSID</td>
              <td>
                Used to authenticate users, prevent fraudulent use of login
                credentials, and protect user data from unauthorized access.
              </td>
            </tr>
            <tr>
              <td>__Secure-1PSIDCC</td>
              <td>Used to protect user data from unauthorized access.</td>
            </tr>
            <tr>
              <td>__Secure-1PSIDTS</td>
              <td>
                Used to measure ad performance and provide recommendations.
              </td>
            </tr>
            <tr>
              <td>__Secure-3PAPISID</td>
              <td>
                Used to store user preferences and information for personalized
                ads on Google properties.
              </td>
            </tr>
            <tr>
              <td>__Secure-3PSID</td>
              <td>
                Used to authenticate users, prevent fraudulent use of login
                credentials, and protect user data from unauthorized access.
              </td>
            </tr>
            <tr>
              <td>__Secure-3PSIDCC</td>
              <td>Used to protect user data from unauthorized access.</td>
            </tr>
            <tr>
              <td>__Secure-3PSIDTS</td>
              <td>
                Used to measure ad performance and provide recommendations.
              </td>
            </tr>
            <tr>
              <td>__gads</td>
              <td>
                Used to serve personalized ads to users on websites that are
                part of the Google Display Network.
              </td>
            </tr>
            <tr>
              <td>__gpi</td>
              <td>
                Used to store user preferences and enable personalized ads on
                Google properties.
              </td>
            </tr>
          </tbody>
        </table>
        <h3>Localstorage</h3>
        <p>
          Localstorage is a web browser feature that allows websites to store
          data locally on a user's device. Unlike cookies, which are typically
          limited in size and are sent to the server with each request,
          localstorage provides a larger storage capacity and allows for
          persistent data storage on the client-side. Here are how our site uses
          those:
        </p>
        <h5>Technical:</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>token</td>
              <td>
                Authenticating the user with the server. It is generated and
                saved upon user account creation, and it serves as a means of
                verifying the user's identity for subsequent interactions.
              </td>
            </tr>
            <tr>
              <td>createNewUser</td>
              <td>
                Used to instruct browser to send create new account request when
                account is deleted and user wants to create new account
              </td>
            </tr>
            <tr>
              <td>userDeleted</td>
              <td>
                Used to instruct browser to not send create new account request
                when account is deleted
              </td>
            </tr>
          </tbody>
        </table>
        <h5>Advertisement or analytics:</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>google_ama_config</td>
              <td>
                Configuration settings for Google Ad Manager Ads (AMA). It
                includes settings related to ad placement, targeting, and
                display preferences.
              </td>
            </tr>
            <tr>
              <td>google_auto_fc_cmp_setting</td>
              <td>
                User's preferences and settings for Google AdSense Consent Mode.
                It determines how consent is obtained and handled for
                personalized advertising.
              </td>
            </tr>
            <tr>
              <td>google_adsense_settings</td>
              <td>
                User's individual preferences and settings for Google AdSense,
                such as ad formats, display options, and ad customization
                settings.
              </td>
            </tr>
            <tr>
              <td>google_experiment_mod44</td>
              <td>
                A/B testing or experimentation conducted by Google. It may
                contain information about the user's participation and assigned
                experiment variations.
              </td>
            </tr>
          </tbody>
        </table>
        <h3>Data Storage and Security</h3>
        <h5>1. Data Retention</h5>
        <p>
          We will retain your personal information for as long as you have an
          account. Because you are not able to play games in this site without
          an account. You have an option to delete your account at any time.
        </p>
        <p>
          Tracking site statistic data is done using part of users token. Part
          of the token is stored in memory to differentiate unique users. At
          midnight this memory is wiped and count of unique users and count of
          requests is stored in database.
        </p>
        <h5>2. Data Security</h5>
        <p>
          We employ reasonable security measures to protect your personal
          information from unauthorized access, disclosure, alteration, or
          destruction. However, please note that no method of transmission or
          storage over the internet is entirely secure, and we cannot guarantee
          the absolute security of your data.
        </p>
        <h5>3. Location of datacenters</h5>
        <p>
          Datacenters which host our servers and the data in it for the site are
          currenlty located in EU. These locations are unlikely to change in the
          future.
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
        <p>List of third parties we are using:</p>
        <ul>
          <li>Google Analytics (site analytics)</li>
          <li>Google AdSense (ads)</li>
          <li>Cloudflare (security and image caching)</li>
        </ul>
        <p>
          Some of these services might be located outside of EU. Their privacy
          polices can be found from their sites.
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
          regarding your personal information. These rights include but not
          limited to: the right to access, rectify, or erase your personal data,
          as well as the right to restrict or object to certain processing
          activities. To exercise these rights, please contact us using the
          contact information provided below.
        </p>
        <h3>CCPA Compliance</h3>
        <p>
          The California Consumer Privacy Act (CCPA) provides California
          residents with certain rights regarding their personal information.
          Infiniteloldle.com respects and complies with the CCPA. Below is a
          summary of your CCPA rights:
        </p>
        <ol>
          <li>
            <strong>Right to Know: </strong>
            You have the right to request information about the categories and
            specific pieces of personal information we have collected about you,
            the categories of sources from which the information is collected,
            the business purposes for collecting or selling the information, and
            the categories of third parties with whom we share the information.
          </li>
          <li>
            <strong>Right to Delete: </strong>
            You have the right to request the deletion of your personal
            information that we have collected, subject to certain exceptions.
            You can delete the account at us at any time from the settings.
          </li>
          <li>
            <strong>Right to Opt-Out: </strong>
            You may opt out of selling your personal information.
          </li>
          <li>
            <strong>Non-Discrimination: </strong>
            We will not discriminate against you for exercising your CCPA
            rights. However, please note that certain services and features
            provided by Infiniteloldle.com may require the collection and use of
            your personal information.
          </li>
        </ol>

        <p>
          Exercising Your CCPA Rights: If you are a California resident and
          would like to exercise any of your CCPA rights described above, you
          can contact us at infiniteloldle@gmail.com. Please provide sufficient
          information to verify your identity and specify the CCPA right you
          wish to exercise. We may need to request additional information to
          verify your request.
        </p>

        <p>
          Please note that we may require certain information from you to
          confirm your identity and ensure the security of your personal
          information before processing your request. We will respond to your
          request within the timeframes required by law.
        </p>

        <p>
          Please review this CCPA Compliance section in conjunction with our
          Privacy Policy to fully understand your rights and our practices
          regarding your personal information.
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
          contact us at: <strong>infiniteloldle@gmail.com</strong>.{" "}
          <CopyToClipboard text="infiniteloldle@gmail.com">
            <button className="btn btn-dark" onClick={() => setIsCopied(true)}>
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </CopyToClipboard>
        </p>
        <p>
          Please review this Privacy Policy carefully. By using
          Infiniteloldle.com, you consent to the collection, use, and storage of
          your personal information as described in this Privacy Policy.
        </p>
        <p>Last edited: 14.6.2023</p>
      </div>
    </div>
  );
}
