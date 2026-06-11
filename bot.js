const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// إنشاء مجلد للسجلات إذا لم يكن موجوداً
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// إنشاء مجلد للملفات إذا لم يكن موجوداً
const filesDir = path.join(__dirname, 'files');
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

// قائمة الردود الذكية
const autoReplies = {
  'مرحبا': 'مرحباً بك! 👋 شكراً لتواصلك معنا. كيف يمكنني مساعدتك؟',
  'السلام': 'وعليكم السلام ورحمة الله وبركاته! 😊 كيف حالك؟',
  'شكرا': 'العفو! 🙏 يشرفنا خدمتك.',
  'السعر': 'للاستفسار عن الأسعار، يرجى التواصل مع فريق المبيعات.',
  'الدعم': 'فريق الدعم متاح لمساعدتك. يرجى صف المشكلة بالتفصيل.',
  'ساعات العمل': 'ساعات العمل: من السبت إلى الخميس من 9 صباحاً إلى 6 مساءً ⏰',
  'hello': 'Hello! 👋 Thank you for contacting us. How can I help you?',
  'thanks': 'You\'re welcome! 🙏 Happy to assist.',
  'help': 'I\'m here to help! Please describe your issue.',
  'price': 'Please contact our sales team for pricing information.',
  'working hours': 'We\'re available Saturday to Thursday, 9 AM to 6 PM ⏰'
};

// إنشاء العميل
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox']
  }
});

// عرض QR Code
client.on('qr', (qr) => {
  console.log('\n\n');
  console.log('═══════════════════════════════════════');
  console.log('  WhatsApp Auto-Reply Bot');
  console.log('═══════════════════════════════════════');
  console.log('\n📱 اسح رمز QR بـ WhatsApp:');
  console.log('\n');
  qrcode.generate(qr, { small: true });
  console.log('\n═══════════════════════════════════════\n');
});

// تسجيل الرسائل
function logMessage(sender, message, type = 'received') {
  const timestamp = new Date().toLocaleString('ar-SA');
  const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
  
  const logEntry = `\n[${timestamp}] [${type.toUpperCase()}] من: ${sender}\nالرسالة: ${message}\n${'='.repeat(50)}`;
  
  fs.appendFileSync(logFile, logEntry);
}

// تطابق الكلمات المفتاحية
function findAutoReply(message) {
  const lowerMessage = message.toLowerCase();
  
  for (const [keyword, reply] of Object.entries(autoReplies)) {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      return reply;
    }
  }
  
  // رد افتراضي
  return 'شكراً لرسالتك! ❤️ سنرد عليك قريباً.';
}

// جاهز
client.on('ready', () => {
  console.log('\n✅ البوت جاهز الآن!');
  console.log('🔔 جاري استقبال الرسائل...\n');
});

// استقبال الرسائل
client.on('message', async (msg) => {
  try {
    // تسجيل الرسالة الواردة
    logMessage(msg.from, msg.body, 'received');
    
    // تجاهل الرسائل من المجموعات إذا أردت (يمكنك تفعيله)
    // if (msg.isGroupMsg) return;
    
    console.log(`\n📨 رسالة جديدة من: ${msg.from}`);
    console.log(`📝 المحتوى: ${msg.body}`);
    
    // الحصول على الرد المناسب
    const autoReply = findAutoReply(msg.body);
    
    // إرسال الرد
    await msg.reply(autoReply);
    
    // تسجيل الرد المرسل
    logMessage(msg.from, autoReply, 'sent');
    
    console.log(`✉️ تم إرسال الرد: ${autoReply}\n`);
    
  } catch (error) {
    console.error('❌ خطأ:', error);
    logMessage('System', `Error: ${error.message}`, 'error');
  }
});

// الاتصال
client.initialize();

// معالجة الأخطاء
client.on('auth_failure', () => {
  console.log('❌ فشل المصادقة');
});

client.on('disconnected', (reason) => {
  console.log('❌ تم قطع الاتصال:', reason);
});

// معالجة إيقاف البرنامج
process.on('SIGINT', () => {
  console.log('\n\n👋 تم إيقاف البوت');
  client.destroy();
  process.exit(0);
});

console.log('🚀 جاري تشغيل البوت...');
