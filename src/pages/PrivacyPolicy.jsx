import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye } from 'lucide-react';

const sections = [
  {
    icon: Shield,
    title: 'Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, make a booking, or contact customer support. This includes your name, email address, phone number, and payment information. We also automatically collect certain information about your device and how you interact with our platform.`,
  },
  {
    icon: Lock,
    title: 'How We Use Your Information',
    content: `We use the information we collect to provide, maintain, and improve our services, process your bookings, personalize your experience, and communicate with you about your travels. We may also use your information to send you promotional offers and updates, subject to your preferences.`,
  },
  {
    icon: Eye,
    title: 'Information Sharing',
    content: `We do not sell your personal information. We share your information with hotel partners only as necessary to complete your booking and provide you with the services you request. We may also share information with trusted service providers who assist us in operating our platform.`,
  },
  {
    icon: Shield,
    title: 'Data Security',
    content: `We implement industry-standard security measures to protect your personal information, including 256-bit SSL encryption, secure data storage, and regular security audits. Your payment information is processed by PCI-DSS compliant payment providers.`,
  },
  {
    icon: Lock,
    title: 'Your Rights',
    content: `You have the right to access, update, or delete your personal information at any time. You may also opt out of marketing communications. To exercise these rights, please contact our privacy team at privacy@tripnest.com.`,
  },
  {
    icon: Eye,
    title: 'Cookies & Tracking',
    content: `We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand how our services are used. You can control cookies through your browser settings.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Privacy Policy
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
            If you have any questions about this privacy policy, please contact us at{' '}
            <a href="mailto:privacy@tripnest.com" className="text-primary-500 hover:text-primary-600">
              privacy@tripnest.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
