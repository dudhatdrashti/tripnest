import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  User,
  Send,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const contactInfo = [
  {
    icon: MapPin,
    title: 'ui.visitUs',
    details: '123 Travel Plaza, Suite 100, New York, NY 10001',
  },
  {
    icon: Phone,
    title: 'ui.callUs',
    details: '+1 (555) 123-4567',
  },
  {
    icon: Mail,
    title: 'ui.emailUs',
    details: 'support@tripnest.com',
  },
  {
    icon: Clock,
    title: 'ui.workingHours',
    details: 'Mon - Fri: 9:00 AM - 6:00 PM',
  },
];

export default function Contact() {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    toast.success(t('ui.messageSent'));
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {t('footer.contact')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg"
          >
            We're here to help make your travel experience perfect
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold gradient-text mb-8">{t('ui.getInTouch')}</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow"
                  >
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center shrink-0">
                      <info.icon className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t(info.title)}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{info.details}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow"
            >
              <h2 className="text-3xl font-bold gradient-text mb-8">{t('ui.sendMessage')}</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label={t('booking.fullName')}
                  icon={User}
                  placeholder={t('ui.enterName')}
                  error={errors.name?.message}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 3, message: 'Name must be at least 3 characters' },
                  })}
                />
                <Input
                  label={t('booking.email')}
                  icon={Mail}
                  type="email"
                  placeholder={t('ui.enterEmail')}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('ui.message')}
                  </label>
                  <textarea
                    rows={5}
                    placeholder={t('ui.howHelp')}
                    className="input-field"
                    {...register('message', {
                      required: 'Message is required',
                      minLength: { value: 10, message: 'Message must be at least 10 characters' },
                    })}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={Send}
                >
                  {t('ui.sendMessage')}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
