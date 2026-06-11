const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// إنشاء المجلدات
const logsDir = path.join(__dirname, 'logs');
const filesDir = path.join(__dirname, 'files');

[logsDir, filesDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// قاعدة بيانات محلية للمستخدمين
const usersDB = {};

// الردود المتقدمة
const advancedReplies = {
  'القائمة': 'القائمة المتاحة:\n1️⃣ "السعر" - للاستفسار عن الأسعار\n2️⃣ "ساعات العمل" - ساعات العمل\n3️⃣ "الدعم" - التحدث مع فريق الدعم\n4️⃣ "تقييم" - قيم خدمتنا',
  'الوقت': `الوقت الآن: ${new Date().toLocaleString('ar-SA')}`,
  'التاريخ': `التاريخ اليوم: ${new Date().toLocaleDateString('ar-SA')}`,
  'الطقس': 'للاستفسار عن حالة الطقس، يرجى تحديد المدينة.',
  'حالتي': (sender) => `معلومات حسابك:\nالرقم: ${sender}\nعدد الرسائل المرسلة: ${usersDB[sender]?.messageCount || 0}`,
  'حذف': 'لحذف حسابك، يرجى التواصل مع الدعم.',
  'عن': 'نحن فريق متخصص في تقديم خدمات العملاء الآلية والذكية. 🤖'
};

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox']
  }
});

// عرض QR Code
client.on('qr', (qr) => {
  console.clear();
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║  🤖 WhatsApp Auto-Reply Bot Advanced 🤖  ║');
  console.log('║     Developed by: Hussam              ║');
  console.log('╚═══════════════════════════════════════╝');
  console.log('\n📱 اسح رمز QR بـ WhatsApp:\n');
  qrcode.generate(qr, { small: true });
  console.log('\n⏳ جاري المصادقة...');
});

// تسجيل متقدم
function logAdvanced(sender, message, type, metadata = {}) {
  const timestamp = new Date().toLocaleString('ar-SA');
  const date = new Date().toISOString().split('T')[0];
  const logFile = path.join(logsDir, `${date}.log`);
  
  const logEntry = `\n[${timestamp}] [${type.toUpperCase()}]\nمن: ${sender}\nالرسالة: ${message}\nالبيانات الإضافية: ${JSON.stringify(metadata)}\n${'═'.repeat(60)}`;
  
  fs.appendFileSync(logFile, logEntry);
}

// تحديث معلومات المستخدم
function updateUserInfo(sender, message) {
  if (!usersDB[sender]) {
    usersDB[sender] = {
      firstMessage: new Date(),
      messageCount: 0,
      messages: []
    };
  }
  
  usersDB[sender].messageCount++;
  usersDB[sender].lastMessage = new Date();
  usersDB[sender].messages.push({
    text: message,
    time: new Date()
  });
}

// معالجة الأوامر الخاصة
async function handleSpecialCommand(msg, command) {
  if (typeof advancedReplies[command] === 'function') {
    return advancedReplies[command](msg.from);
  }
  return advancedReplies[command];
}

// البحث عن كلمات مفتاحية
function findSmartReply(message) {
  const lowerMessage = message.toLowerCase().trim();
  
  // البحث عن تطابق دقيق
  for (const keyword of Object.keys(advancedReplies)) {
    if (lowerMessage === keyword.toLowerCase()) {
      return keyword;
    }
  }
  
  // البحث عن تطابق جزئي
  for (const keyword of Object.keys(advancedReplies)) {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      return keyword;
    }
  }
  
  return null;
}

// جاهز
client.on('ready', () => {
  console.clear();
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║  ✅ البوت جاهز الآن                   ║');
  console.log('║  🔔 جاري استقبال الرسائل...         ║');
  console.log('╚═══════════════════════════════════════╝\n');
});

// استقبال الرسائل
client.on('message', async (msg) => {
  try {
    const sender = msg.from;
    const messageText = msg.body;
    
    // تحديث معلومات المستخدم
    updateUserInfo(sender, messageText);
    logAdvanced(sender, messageText, 'received');
    
    console.log(`\n📨 رسالة جديدة`);
    console.log(`👤 من: ${sender}`);
    console.log(`📝 المحتوى: ${messageText}`);
    
    // البحث عن أمر
    const command = findSmartReply(messageText);
    let reply;
    
    if (command) {
      reply = await handleSpecialCommand(msg, command);
    } else {
      // الرد الافتراضي
      reply = 'شكراً لرسالتك! 👋\n\nاكتب "القائمة" لمشاهدة الأوامر المتاحة.';
    }
    
    // إرسال الرد
    await msg.reply(reply);
    logAdvanced(sender, reply, 'sent', { type: command || 'default' });
    
    console.log(`✉️ تم الرد: ${reply}`);
    console.log(`${'─'.repeat(50)}`);
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    logAdvanced('System', `Error: ${error.message}`, 'error');
  }
});

// معالجة الأخطاء
client.on('auth_failure', () => console.log('❌ فشل المصادقة'));
client.on('disconnected', (reason) => console.log('❌ تم قطع الاتصال:', reason));

// إيقاف البرنامج
process.on('SIGINT', () => {
  console.log('\n\n👋 تم إيقاف البوت');
  fs.writeFileSync(
    path.join(__dirname, 'users-data.json'),
    JSON.stringify(usersDB, null, 2)
  );
  client.destroy();
  process.exit(0);
});

// تشغيل
client.initialize();
console.log('🚀 جاري تشغيل البوت...');
