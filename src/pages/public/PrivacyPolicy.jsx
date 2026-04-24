import { Link } from 'react-router-dom';
import logo from '../../assets/familybook.png';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src={logo} alt="FamilyBook" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FamilyBook
              </span>
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <div className="prose prose-blue max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to FamilyBook. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our 
                platform and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We may collect, use, store and transfer different kinds of personal data about you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Identity Data: name, username, date of birth</li>
                <li>Contact Data: email address, phone number</li>
                <li>Technical Data: IP address, browser type, device information</li>
                <li>Usage Data: information about how you use our platform</li>
                <li>Family Data: information you choose to share about your family members</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We have implemented appropriate security measures to prevent your personal data from being 
                accidentally lost, used or accessed in an unauthorized way. We use encryption, secure servers, 
                and regular security audits to protect your information. However, no method of transmission 
                over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Data Sharing</h2>
              <p className="text-gray-700 leading-relaxed">
                We do not sell your personal data. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>With family members you explicitly grant access to</li>
                <li>With service providers who assist us in operating our platform</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Under data protection laws, you have rights including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Right to access your personal data</li>
                <li>Right to correct inaccurate data</li>
                <li>Right to delete your data</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our service and hold 
                certain information. You can instruct your browser to refuse all cookies or to indicate when 
                a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our service is intended for users who are 18 years or older. We do not knowingly collect 
                personal information from children under 18. If you are a parent or guardian and believe 
                your child has provided us with personal data, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none space-y-2 text-gray-700 mt-3">
                <li>Email: info@itfuturz.com</li>
                <li>Phone: +91 99790 66311</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
