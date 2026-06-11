// ملف الإعدادات الرئيسي

module.exports = {
  // إعدادات البوت
  bot: {
    name: 'WhatsApp Auto-Reply Bot',
    version: '1.0.0',
    author: 'Hussam'
  },

  // إعدادات التسجيل
  logging: {
    enabled: true,
    logLevel: 'info', // info, warn, error, debug
    saveLogs: true,
    logsPath: './logs'
  },

  // إعدادات الرسائل
  messages: {
    defaultReply: 'شكراً لرسالتك! 👋\n\nاكتب "القائمة" لمشاهدة الأوامر المتاحة.',
    welcomeMessage: 'مرحباً بك! 👋 أنا بوت تلقائي هنا لمساعدتك.',
    errorMessage: 'حدث خطأ ما. يرجى المحاولة لاحقاً.',
    offlineMessage: 'أنا غير متاح الآن. سيتم الرد عليك قريباً.'
  },

  // إعدادات الأوقات
  schedule: {
    workingHours: {
      start: 9,    // الساعة 9 صباحاً
      end: 18,     // الساعة 6 مساءً
      days: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']
    }
  },

  // الميزات
  features: {
    autoReply: true,
    logging: true,
    userTracking: true,
    groupMessages: false, // هل نرد على رسائل المجموعات
    typingIndicator: true // إظهار "يكتب..."
  },

  // حدود الاستخدام
  limits: {
    maxMessagesPerMinute: 10,
    maxMessagesPerHour: 100
  }
};
