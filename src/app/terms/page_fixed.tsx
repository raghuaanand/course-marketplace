import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using Course Marketplace, you accept and agree to be bound by the terms and provision 
              of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              Course Marketplace is an online platform that connects instructors and students. We provide a 
              marketplace where instructors can create and sell courses, and students can purchase and access 
              educational content.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              To access certain features of our service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Update your information as necessary</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Course Content and Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              Instructors retain ownership of their course content. By uploading content, instructors grant us 
              a license to host, display, and distribute the content through our platform.
            </p>
            <p className="text-gray-700 mb-4">
              Students receive a limited, non-exclusive license to access purchased course content for personal, 
              non-commercial use only.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Payments and Refunds</h2>
            <p className="text-gray-700 mb-4">
              All payments are processed securely through our payment providers. Course prices are set by 
              instructors, and we collect our service fee from each transaction.
            </p>
            <p className="text-gray-700 mb-4">
              Refunds are available within 30 days of purchase, subject to our refund policy terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Prohibited Uses</h2>
            <p className="text-gray-700 mb-4">
              You may not use our service:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>For any unlawful purpose</li>
              <li>To harass, abuse, or harm others</li>
              <li>To upload malicious content</li>
              <li>To violate intellectual property rights</li>
              <li>To share account credentials</li>
              <li>To download or redistribute course content</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Content Moderation</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to review, modify, or remove any content that violates these terms or 
              our community guidelines. We may suspend or terminate accounts for policy violations.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which governs how we 
              collect, use, and protect your information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Disclaimers</h2>
            <p className="text-gray-700 mb-4">
              The information on this website is provided on an &quot;as is&quot; basis. To the fullest extent permitted by law, 
              we exclude all representations, warranties, and conditions relating to our website and the use of this website.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              We shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
              resulting from your use of our service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Indemnification</h2>
            <p className="text-gray-700 mb-4">
              You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from 
              your use of our service or violation of these terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account at any time for violations of these terms. Upon 
              termination, your right to use our service will cease immediately.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction 
              in which our company is incorporated.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">14. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. We will notify users of significant 
              changes via email or platform notifications.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> legal@coursemarketplace.com
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Address:</strong> 123 Education Street, Learning City, LC 12345
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> (555) 123-4567
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <Link
                href="/"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
