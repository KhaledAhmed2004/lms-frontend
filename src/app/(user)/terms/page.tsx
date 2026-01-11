"use client";
import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions – Schäfer Tutoring</h1>
          <p className="text-sm text-gray-600 mb-8">Effective Date: [Insert Date]</p>

          <p className="text-gray-700 mb-8">
            {`Welcome to Schäfer Tutoring! These Terms and Conditions ("Terms") govern your use of our platform, mobile applications, and related services (collectively, the "Service"). By accessing or using Schäfer Tutoring, you agree to be bound by these Terms. If you do not agree, please do not use our Service.`}
          </p>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-3">By creating an account or using Task Titans, you acknowledge that you have read, understood, and agree to these Terms, as well as our Privacy Policy.</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>You must be at least 18 years old to use our Service.</li>
              <li>If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-700 mb-3">Task Titans is a platform that connects:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li><strong>Task Posters:</strong> Individuals or businesses who need assistance with tasks.</li>
              <li><strong>Titans (Task Seekers):</strong> Individuals who offer their services to complete tasks.</li>
            </ul>
            <p className="text-gray-700 mt-3">Task Titans acts as an intermediary and does not employ Titans or directly perform tasks. We are not responsible for the quality, legality, or safety of tasks posted or completed.</p>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>

            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-800 mb-2">a. Account Registration</p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>You must provide accurate and complete information when creating an account.</li>
                  <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                  <li>You agree to notify us immediately of any unauthorized use of your account.</li>
                </ul>
              </div>

              <div>
                <p className="font-medium text-gray-800 mb-2">b. Account Suspension or Termination</p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, abusive, or illegal activity.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>

            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-800 mb-2">a. Task Posters</p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Provide clear, accurate, and lawful task descriptions.</li>
                  <li>Pay Titans fairly and on time for completed tasks.</li>
                  <li>Comply with all applicable laws and regulations.</li>
                </ul>
              </div>

              <div>
                <p className="font-medium text-gray-800 mb-2">b. Titans (Task Seekers)</p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Complete tasks as described and agreed upon.</li>
                  <li>Communicate professionally and respond promptly.</li>
                  <li>Only accept tasks you are qualified to perform.</li>
                </ul>
              </div>

              <div>
                <p className="font-medium text-gray-800 mb-2">c. All Users</p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Do not post or engage in illegal, harmful, or offensive content.</li>
                  <li>Do not impersonate others or misrepresent your identity.</li>
                  <li>Do not attempt to circumvent platform fees or engage in off-platform transactions to avoid fees.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payments and Fees</h2>

            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-800 mb-2">a. Service Fees</p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Task Titans charges a service fee on each transaction. The fee structure will be clearly displayed before confirming a task.</li>
                </ul>
              </div>

              <div>
                <p className="font-medium text-gray-800 mb-2">b. Payment Processing</p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Payments are processed securely through third-party payment providers.</li>
                  <li>Task Posters agree to pay the agreed-upon amount upon task completion.</li>
                  <li>Titans will receive payment after task completion and verification, minus applicable fees.</li>
                </ul>
              </div>

              <div>
                <p className="font-medium text-gray-800 mb-2">c. Refunds and Disputes</p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Refunds are handled on a case-by-case basis. Users must report disputes within 48 hours of task completion.</li>
                  <li>Task Titans may mediate disputes but is not obligated to resolve them.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Prohibited Activities</h2>
            <p className="text-gray-700 mb-3">You agree not to:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Use the Service for any illegal or unauthorized purpose.</li>
              <li>Post tasks that involve illegal activities, harassment, or harm to others.</li>
              <li>Scrape, copy, or misuse platform data.</li>
              <li>{`Interfere with or disrupt the Service's functionality.`}</li>
              <li>Create multiple accounts to manipulate reviews or ratings.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>All content on Task Titans, including logos, text, graphics, and software, is owned by Task Titans or its licensors and protected by intellectual property laws.</li>
              <li>You may not reproduce, distribute, or create derivative works without our written permission.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Task Titans is not responsible for the actions, quality, safety, or legality of tasks posted or completed by users.</li>
              <li>We do not guarantee that the Service will be uninterrupted, secure, or error-free.</li>
              <li>To the fullest extent permitted by law, Task Titans is not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify and hold harmless Task Titans, its affiliates, and employees from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Dispute Resolution</h2>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Any disputes arising from these Terms or your use of the Service will be resolved through binding arbitration in accordance with [Insert Jurisdiction/Arbitration Rules].</li>
              <li>You waive your right to participate in class-action lawsuits or class-wide arbitration.</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>{`We may update these Terms from time to time. Changes will be posted with a revised "Effective Date."`}</li>
              <li>Continued use of the Service after changes constitutes acceptance of the updated Terms.</li>
            </ul>
          </section>

          {/* Section 12 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-700">
              These Terms are governed by the laws of [Insert Jurisdiction], without regard to its conflict of law principles.
            </p>
          </section>

          {/* Section 13 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 mb-3">If you have questions about these Terms, please contact us:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Task Titans Support</li>
              <li>📧 Email: [Insert Support Email]</li>
              <li>🌐 Website: [Insert Website URL]</li>
            </ul>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 italic">
              By using Task Titans, you acknowledge that you have read and agree to these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;