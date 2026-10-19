# 🚀 دليل تشغيل أتمتة الواتساب ومجلدات درايف مع البورتال (n8n + WhatsApp Automation)

هذا الدليل يوضح كيفية تشغيل منظومة الأتمتة الكاملة بحيث عند إرسال أي معيد أو دكتور لمحاضرة، سكشن، أو شيت في جروبات الواتساب:
1. يتم التقاط الملف والكابشن تلقائياً عبر **Evolution API**.
2. يقوم نموذج **Google Gemini AI** بفهم المحتوى وتصنيف المادة واسم المعيد والسكشن.
3. يتم رفع الملف تلقائياً على **Google Drive** في مجلد المعيد المناسب وتوليد الروابط المباشرة.
4. يتم تحديث ملف `courses-data.js` في مستودع GitHub تلقائياً ونشره على **GitHub Pages** خلال ثوانٍ معدودة.

---

## 🛠️ مكونات المنظومة (Architecture)

```
[جروبات الواتساب] 
      │
      ▼ (رسالة / ملف)
[Evolution API (بوابة واتساب بـ QR)]
      │
      ▼ (Webhook)
[n8n Workflow Engine]
      ├─► 1. فلترة الرسائل والتأكد من وجود مرفق دراسي
      ├─► 2. تحليل وتصنيف المادة والمعيد بواسطة (Gemini AI)
      ├─► 3. رفع الملف لمجلد المعيد في Google Drive
      └─► 4. إطلاق GitHub Action لتحديث البورتال
            │
            ▼
[GitHub Pages] ──► (تحديث فوري للموقع للطلاب 🚀)
```

---

## 📋 المتطلبات الأساسية

1. **Docker Desktop** مثبت على جهازك أو سيرفر VPS.
2. مفتاح مجاني لـ **Google Gemini API** من [Google AI Studio](https://aistudio.google.com/).
3. حساب **Google Drive** (أو Service Account) لربطه مع n8n.
4. **GitHub Personal Access Token (PAT)** بصلاحيات `repo` أو `workflow`.

---

## ⚡ خطوات التشغيل في 4 دقائق

### 1. تشغيل الحاويات (n8n + Evolution API)
من داخل مجلد `automation`، شغّل الأمر التالي:
```bash
docker compose up -d
```
- لوحة تحكم **n8n**: `http://localhost:5678`
- لوحة تحكم **Evolution API**: `http://localhost:8080`

---

### 2. ربط رقم الواتساب بـ Evolution API
1. افتح المتصفح أو Postman وأنشئ جلسة واتساب (Instance):
   ```bash
   curl -X POST http://localhost:8080/instance/create \
     -H "apikey: portal_secret_key_2026" \
     -H "Content-Type: application/json" \
     -d '{
       "instanceName": "portal-bot",
       "token": "portal_secret_key_2026",
       "qrcode": true
     }'
   ```
2. اربط الجلسة برابط الـ Webhook الخاص بـ n8n:
   ```bash
   curl -X POST http://localhost:8080/webhook/set/portal-bot \
     -H "apikey: portal_secret_key_2026" \
     -H "Content-Type: application/json" \
     -d '{
       "enabled": true,
       "url": "http://portal-n8n:5678/webhook/whatsapp-materials",
       "webhook_by_events": true,
       "events": ["MESSAGES_UPSERT"]
     }'
   ```
3. افتح `http://localhost:8080/instance/connect/portal-bot` وامسح كود الـ QR من تطبيق الواتساب على هاتفك (الأجهزة المرتبطة - Linked Devices).

---

### 3. استيراد سير العمل إلى n8n
1. ادخل على `http://localhost:5678`.
2. اضغط على **Workflows** ثم **Import from file**.
3. اختر الملف: `automation/n8n/whatsapp_to_drive_and_portal.json`.
4. أضف المفاتيح والمتغيرات التالية في n8n:
   - `GEMINI_API_KEY`: مفتاح الجيميني الخاص بك.
   - `GITHUB_PAT`: توكن جيت هب الخاص بك.
   - ربط حساب **Google Drive** في عقدة (6. رفع الملف إلى Google Drive).
5. اضغط **Active** في أعلى اليمين لتفعيل الأتمتة!

---

## 🧪 اختبار الأتمتة يدوياً (Manual Test)

يمكنك تجربة حقن مادة تجريبية للتأكد من سلامة الكود المحلي عبر الأمر:
```bash
node tools/add_material_from_webhook.js '{"courseId":"computer-architecture","type":"section","ta":"م. أحمد حسام","number":3,"arabicTitle":"برمجة المعالج 8086 وتطبيقاتها","driveId":"1p1zE6XWM2uYRn7_MnnkN51IL_HWirf-m"}' --dry-run
```
المخرجات ستوضح لك كيف يولد السكريبت الكائن المتوافق 100% مع البورتال ويفحصه ضد محددات الجودة.
