"use client";
import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy – Schäfer Tutoring</h1>
          <p className="text-sm text-gray-600 mb-8">Effective Date: [Insert Date]</p>

          <p className="text-gray-700 mb-8">
            {`Schäfer Tutoring ("we," "us," or "our") values your trust and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform, mobile applications, or related services (together, the "Service").`}
          </p>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">We collect the following types of information to provide and improve our Services:</p>
            
            <div className="ml-4 space-y-3">
              <div>
                <p className="font-medium text-gray-800 mb-2">a. Automatically Collected Information</p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Name, email address, phone number, profile photo.</li>
                  <li>Payment and billing details (collected securely via third-party providers).</li>
                </ul>
              </div>

              <div>
                <p className="font-medium text-gray-800 mb-2">b. Information You Provide</p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Messages and communications on the platform.</li>
                </ul>
              </div>

              <div>
                <p className="font-medium text-gray-800 mb-2">c. Third-Party Information</p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Payment processors, ID verification providers, and analytics services may share limited information with us to ensure trust and security.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-3">We use your information to:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Create and manage your account.</li>
              <li>Facilitate communication between Task posters and Titans (task seekers).</li>
              <li>Process payments and maintain transaction records.</li>
              <li>Improve user experience, and secure our Services.</li>
              <li>Send notifications, updates, and promotional offers (you can opt out).</li>
              <li>Comply with legal requirements.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Sharing of Information</h2>
            <p className="text-gray-700 mb-3">We do not sell your personal data. We may share information only in these cases:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>With other users (e.g., Task posters see Titan profiles, Titans see Task posts).</li>
              <li>With service providers (payment processors, analytics tools).</li>
              <li>For legal reasons (to comply with law, enforce policies, or prevent fraud).</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>We use industry-standard security measures (encryption, access controls, secure servers) to protect your data. However, no system is 100% secure, and we cannot guarantee absolute security.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>We retain your data as long as your account is active or as required by law. You may request deletion of your account and personal data at any time by contacting us.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Access the personal data we hold about you.</li>
              <li>Request corrections or updates.</li>
              <li>Delete your account and data.</li>
              <li>Restrict or object to certain processing.</li>
              <li>Opt out of marketing communications.</li>
              <li>To exercise your rights, please contact us at [insert support email].</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>We use cookies and similar technologies to improve user experience, remember preferences, and analyze platform performance. You can disable cookies in your browser, but some features may not work properly.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children&apos;s Privacy</h2>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Task Titans is not intended for children under 18. We do not knowingly collect personal information from minors.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>{`We may update this Privacy Policy from time to time. Any changes will be posted with a revised "Effective Date."`}</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="text-gray-700 mb-3">If you have questions about this Privacy Policy or our data practices, please contact us:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Task Titans Support</li>
              <li>📧 Email: [Insert Support Email]</li>
              <li>🌐 Website: [Insert Website URL]</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;