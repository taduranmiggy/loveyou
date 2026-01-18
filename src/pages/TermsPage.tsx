import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, Users } from 'lucide-react';

const TermsPage = () => {
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
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600">
            Simple, fair terms for using LoveYou
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
              <FileText className="w-6 h-6 text-pink-500" />
              Using LoveYou
            </h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                By using LoveYou, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                <li>Use the service for personal wellness tracking only</li>
                <li>Provide accurate information for better AI recommendations</li>
                <li>Keep your account secure and not share credentials</li>
                <li>Respect other community members and our guidelines</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-pink-500" />
              Our Responsibilities
            </h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                We commit to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                <li>Maintaining service availability and security</li>
                <li>Protecting your privacy and data</li>
                <li>Providing AI-powered wellness insights</li>
                <li>Supporting you through our customer service</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Disclaimers</h2>
            <div className="prose prose-pink max-w-none">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-medium">
                  ⚠️ Medical Disclaimer: LoveYou is not a medical device or healthcare provider. 
                  Always consult with healthcare professionals for medical advice.
                </p>
              </div>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>AI recommendations are for informational purposes only</li>
                <li>We cannot guarantee specific health outcomes</li>
                <li>The service is provided "as is" without warranties</li>
                <li>You use the service at your own risk</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account & Billing</h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Account terms:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                <li>Free tier includes basic tracking features</li>
                <li>Premium features require a paid subscription</li>
                <li>Cancel anytime - no long-term commitments</li>
                <li>Refunds available within 30 days of purchase</li>
              </ul>
            </div>
          </section>

          <section className="bg-pink-50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Questions?</h2>
            <p className="text-gray-600">
              Need clarification on our terms? Contact us:
            </p>
            <div className="mt-4">
              <p className="text-pink-600 font-medium">legal@loveyou.app</p>
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

export default TermsPage;
