import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, Shield, AlertCircle } from 'lucide-react';

const sections = [
  {
    icon: FileText,
    title: '1. Acceptance of Terms',
    content: `By accessing or using TripNest, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We may update these terms from time to time, and your continued use of the platform constitutes acceptance of the updated terms.`,
  },
  {
    icon: Scale,
    title: '2. Booking Services',
    content: `TripNest provides an online platform that connects travelers with hotels and accommodation providers. We act as an intermediary and are not the provider of the accommodation itself. All bookings are subject to the individual hotel's terms and conditions.`,
  },
  {
    icon: Shield,
    title: '3. User Responsibilities',
    content: `You are responsible for providing accurate and complete information when making a booking. You must be at least 18 years old to use our platform. You agree not to misuse our services or attempt to gain unauthorized access to our systems.`,
  },
  {
    icon: AlertCircle,
    title: '4. Payments & Refunds',
    content: `All prices are displayed in your selected currency and include applicable taxes unless otherwise stated. Cancellation and refund policies vary by hotel and booking type. Please review the cancellation policy before confirming your booking.`,
  },
  {
    icon: Scale,
    title: '5. Intellectual Property',
    content: `All content on TripNest, including logos, text, graphics, and software, is protected by intellectual property laws and is the property of TripNest or its licensors. You may not reproduce or use this content without our prior written consent.`,
  },
  {
    icon: Shield,
    title: '6. Limitation of Liability',
    content: `To the maximum extent permitted by law, TripNest shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our platform or services.`,
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80"
          >
            Last updated: January 2024
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h2 className="text-xl font-bold">{section.title}</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-500 mt-8 text-sm">
            For questions about these terms, contact{' '}
            <a href="mailto:legal@tripnest.com" className="text-primary-500 hover:text-primary-600">
              legal@tripnest.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
