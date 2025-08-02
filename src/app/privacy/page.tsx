import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] py-16 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-[#3A86FF]/10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-[#8338EC]/10 rounded-full border border-[#8338EC]/20 mb-6">
              <span className="text-sm font-medium text-[#8338EC]">Legal Information</span>
            </div>
            <h1 className="text-4xl font-bold text-[#1E293B] mb-4">Privacy Policy</h1>
            <p className="text-[#64748B]">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-[#1E293B] mt-8 mb-4">1. Introduction</h2>
            <p className="text-[#64748B] mb-6 leading-relaxed">
              Course Marketplace (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>

            <h2 className="text-2xl font-semibold text-[#1E293B] mt-8 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-[#1E293B] mt-6 mb-3">2.1 Personal Information</h3>
            <p className="text-[#64748B] mb-4 leading-relaxed">
              We may collect personally identifiable information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 mb-6 text-[#64748B] space-y-2">
              <li>Register for an account</li>
              <li>Purchase courses</li>
              <li>Contact us for support</li>
              <li>Subscribe to our newsletter</li>
              <li>Create instructor profiles</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#1E293B] mt-6 mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-[#64748B] mb-4 leading-relaxed">
              When you visit our website, we may automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc pl-6 mb-6 text-[#64748B] space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referring website</li>
              <li>Pages viewed and time spent</li>
              <li>Device identifiers</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#1E293B] mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-[#64748B] mb-4 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Provide and maintain our services</li>
              <li>Process transactions and send confirmations</li>
              <li>Communicate with you about your account</li>
              <li>Improve our website and services</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We may share your personal information in the following situations:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>With instructors:</strong> When you enroll in a course, instructors may see your profile information</li>
              <li><strong>With service providers:</strong> Third-party vendors who help us operate our platform</li>
              <li><strong>For legal reasons:</strong> When required by law or to protect our rights</li>
              <li><strong>Business transfers:</strong> In connection with mergers or acquisitions</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information. 
              However, no electronic transmission or storage is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your personal information</li>
              <li>Object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to enhance your experience and analyze website usage. 
              You can control cookie settings through your browser preferences.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Third-Party Links</h2>
            <p className="text-gray-700 mb-4">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices 
              of these external sites.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. International Transfers</h2>
            <p className="text-gray-700 mb-4">
              Your information may be transferred to and processed in countries other than your country of residence. 
              We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our services are not intended for children under 13. We do not knowingly collect personal information 
              from children under 13.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the 
              new Privacy Policy on this page and updating the &quot;last updated&quot; date.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> privacy@coursemarketplace.com
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Address:</strong> 123 Education Street, Learning City, LC 12345
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> (555) 123-4567
              </p>
            </div>

            <div className="border-t border-[#3A86FF]/20 pt-8 mt-8">
              <Link
                href="/"
                className="inline-flex items-center text-[#3A86FF] hover:text-[#3A86FF]/80 font-medium transition-colors"
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
