# 🚀 دليل التثبيت والإعداد

## المرحلة الأولى: التثبيت

### 1. تثبيت Node.js

- اذهب إلى https://nodejs.org/
- حمل الإصدار LTS (الموصى به)
- ثبته واتبع التعليمات

### 2. استنسخ المستودع

```bash
git clone https://github.com/911houssem/Best.git
cd Best
```

### 3. ثبت الحزم

```bash
npm install
```

## المرحلة الثانية: التشغيل

### تشغيل البوت الأساسي

```bash
node bot.js
```

أو

```bash
npm start
```

### تشغيل البوت المتقدم

```bash
node advanced-bot.js
```

## المرحلة الثالثة: ربط WhatsApp

1. **افتح WhatsApp على هاتفك**
   - قم بتشغيل التطبيق

2. **اذهب إلى الإعدادات**
   - iPhone: إعدادات > الأجهزة المرتبطة
   - Android: إعدادات (⋮) > الأجهزة المرتبطة

3. **اضغط "ربط جهاز"**
   - ستظهر كاميرا QR

4. **اسح رمز QR**
   - الذي يظهر في نافذة الطرفية

5. **انتظر جاري المصادقة**
   - قد يستغرق 30 ثانية

6. **البوت جاهز! 🎉**

## استكشاف الأخطاء

### المشكلة: لا يظهر QR Code
**الحل:**
```bash
rm -rf .wwebjs_auth
node bot.js
```

### المشكلة: "Session Expired"
**الحل:**
```bash
rm -rf .wwebjs_cache
node bot.js
```

### المشكلة: "Chromium not found"
**الحل:**
```bash
npm install puppeteer --save
```

## أوامر مفيدة

```bash
# تنظيف الذاكرة المؤقتة
rm -rf .wwebjs_*

# إعادة تثبيت الحزم
rm -rf node_modules
npm install

# تشغيل بوضع التطوير
npm run dev

# عرض السجلات
cat logs/*.log
```

## إعدادات متقدمة

### تغيير الردود

عدّل ملف `bot.js` وابحث عن `autoReplies`:

```javascript
const autoReplies = {
  'كلمتك': 'ردك'
};
```

### تفعيل رد��د المجموعات

في `bot.js`:

```javascript
// غيّر هذا السطر:
if (msg.isGroupMsg) return;

// إلى:
// if (msg.isGroupMsg) return; // معطل
```

### إضافة ملفات

```javascript
const media = MessageMedia.fromFilePath('./files/image.jpg');
await msg.reply(media);
```

## النشر على السحابة (اختياري)

### Heroku

1. أنشئ حساب على https://heroku.com
2. أنشئ Procfile
3. Deploy عبر Git

### Railway

1. أنشئ حساب على https://railway.app
2. ربط المستودع
3. Deploy تلقائي

## الدعم

إذا واجهت مشاكل:

1. تحقق من السجلات في `logs/`
2. اقرأ الأخطاء بعناية
3. ابحث في Issues على GitHub
4. فتح Issue جديد

---

**تم بنجاح! 🎉**
