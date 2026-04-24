import { Link } from 'react-router-dom';
import logo from '../../assets/familybook.png';

export default function TermsConditions() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <div className="prose prose-blue max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using FamilyBook, you accept and agree to be bound by the terms and provision 
                of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Use License</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Permission is granted to temporarily access FamilyBook for personal, non-commercial use only. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the materials to another person</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed">
                When you create an account with us, you must provide accurate, complete, and current information. 
                Failure to do so constitutes a breach of the Terms. You are responsible for safeguarding your 
                password and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. User Content</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You retain all rights to the content you submit, post or display on FamilyBook. By submitting 
                content, you grant us a license to use, modify, and display that content. You agree not to post content that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Is illegal, harmful, or offensive</li>
                <li>Violates any intellectual property rights</li>
                <li>Contains viruses or malicious code</li>
                <li>Impersonates any person or entity</li>
                <li>Violates the privacy of others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Acceptable Use</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You agree to use FamilyBook only for lawful purposes. You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any harmful or malicious code</li>
                <li>Interfere with or disrupt the service</li>
                <li>Attempt unauthorized access to our systems</li>
                <li>Use automated systems to access the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                The service and its original content, features, and functionality are owned by FamilyBook and 
                are protected by international copyright, trademark, patent, trade secret, and other intellectual 
                property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, for any 
                reason, including if you breach the Terms. Upon termination, your right to use the service will 
                immediately cease. You may also delete your account at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                In no event shall FamilyBook, nor its directors, employees, partners, agents, suppliers, or 
                affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, 
                including loss of profits, data, use, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Disclaimer</h2>
              <p className="text-gray-700 leading-relaxed">
                Your use of the service is at your sole risk. The service is provided on an "AS IS" and 
                "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the service's 
                reliability, accuracy, or availability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                in which FamilyBook operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                we will provide at least 30 days' notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms, please contact us:
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
