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
              By accessing and using Course Marketplace, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily download one copy of the materials on Course Marketplace for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
              You are responsible for safeguarding the password and for maintaining the confidentiality of your account.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Course Content and Instructors</h2>
            <p className="text-gray-700 mb-4">
              Course Marketplace serves as a platform for instructors to offer educational content. We do not guarantee the quality, 
              accuracy, or completeness of any course content. Instructors are solely responsible for their course materials.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Payments and Refunds</h2>
            <p className="text-gray-700 mb-4">
              All payments are processed securely through our payment processors. Refund policies are determined by individual 
              instructors and are clearly stated on each course page. Course Marketplace may charge platform fees as disclosed.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The service and its original content, features, and functionality are and will remain the exclusive property of 
              Course Marketplace and its licensors. The service is protected by copyright, trademark, and other laws.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Prohibited Uses</h2>
            <p className="text-gray-700 mb-4">
              You may not use our service:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Content Guidelines</h2>
            <p className="text-gray-700 mb-4">
              All course content must be educational in nature and comply with our community guidelines. We reserve the right 
              to remove any content that violates these terms or is deemed inappropriate.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, 
              under our sole discretion, for any reason whatsoever including breach of the Terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              The information on this website is provided on an &quot;as is&quot; basis. To the fullest extent permitted by law, 
              this Company excludes all representations, warranties, conditions and terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event shall Course Marketplace, nor its directors, employees, partners, agents, suppliers, or affiliates, 
              be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms shall be interpreted and governed by the laws of the jurisdiction in which Course Marketplace operates, 
              without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">14. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-gray-700">
                Email: legal@coursemarketplace.com<br />
                Address: 123 Education Street, Learning City, LC 12345<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
