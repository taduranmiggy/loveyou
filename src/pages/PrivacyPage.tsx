import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            Your privacy matters to us. Here's how we protect it.
          </p>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-8"
        >
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-pink-500" />
              Data Collection & Use
            </h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                LoveYou collects only the information necessary to provide you with personalized wellness guidance:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                <li>Account information (email, name, preferences)</li>
                <li>Health data you choose to track (pills, cycles, symptoms)</li>
                <li>Usage patterns to improve our AI recommendations</li>
                <li>Technical data for app functionality and security</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-pink-500" />
              Data Sharing & Protection
            </h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                We never sell your personal data. Your health information is:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                <li>Encrypted both in transit and at rest</li>
                <li>Stored securely on HIPAA-compliant servers</li>
                <li>Accessible only to you and our AI systems</li>
                <li>Never shared with third parties without explicit consent</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                You have complete control over your data:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                <li>Export your data at any time</li>
                <li>Delete your account and all associated data</li>
                <li>Opt out of data processing for AI improvements</li>
                <li>Request clarification about any data we collect</li>
              </ul>
            </div>
          </section>

          <section className="bg-pink-50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-600">
              Questions about privacy? We're here to help:
            </p>
            <div className="mt-4">
              <p className="text-pink-600 font-medium">privacy@loveyou.app</p>
              <p className="text-gray-600 text-sm mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;
