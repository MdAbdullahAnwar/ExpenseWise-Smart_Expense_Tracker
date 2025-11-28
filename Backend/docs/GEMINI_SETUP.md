# 🚀 Gemini AI Integration - Quick Setup Guide

## ✅ What's Been Added

### 1. Receipt Scanner 📸
- **Location:** `/expenses` page
- **Feature:** Upload receipt image → Auto-fills expense form
- **Extracts:** Amount, Description, Category, Date

### 2. Monthly Email Reports 📧 (Premium Users)
- **Schedule:** 1st of every month at 9 AM
- **Includes:**
  - Monthly Income
  - Category-wise spending breakdown (₹ & %)
  - AI-generated financial insights

## 🔧 Setup Instructions

### Step 1: Get Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### Step 2: Update .env File
Open `Backend/.env` and replace:
```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```
with your actual key:
```
GEMINI_API_KEY=AIzaSyC...your_actual_key
```

### Step 3: Restart Server
```bash
cd Backend
npm run dev
```

## 🎯 How to Use

### Receipt Scanner
1. Go to: http://localhost:5173/expenses
2. Look for "Scan Receipt (Auto-fill)" section
3. Click "Upload Receipt Image"
4. Select a receipt photo
5. Wait for scanning (2-3 seconds)
6. Form auto-fills with extracted data
7. Adjust category if needed
8. Submit!

### Monthly Reports (Premium Users)
- **Automatic:** Runs on 1st of every month at 9 AM
- **Manual Test:**
  ```javascript
  // In Backend directory, run node console
  const emailReportService = require('./services/emailReportService');
  await emailReportService.sendMonthlyReport(YOUR_USER_ID);
  ```

## 📁 Files Added/Modified

### New Files:
- `Backend/services/geminiService.js` - AI logic
- `Backend/services/emailReportService.js` - Email reports
- `Backend/docs/GEMINI_INTEGRATION.md` - Full documentation

### Modified Files:
- `Backend/.env` - Added GEMINI_API_KEY
- `Backend/server.js` - Added cron job
- `Backend/controllers/expenseController.js` - Added scanReceipt
- `Backend/routes/expenseRoutes.js` - Added /scan-receipt route
- `Frontend/src/components/expense/ExpensePage.jsx` - Added scanner UI

## 🧪 Testing

### Test Receipt Scanner:
1. Use a clear receipt image (JPG/PNG)
2. Make sure text is readable
3. Upload and verify auto-fill

### Test Monthly Report:
1. Ensure you're a premium user (isPremium = true)
2. Have some transactions from last month
3. Wait for 1st of month OR trigger manually

## 💡 Tips

- **Best Receipt Images:** Clear, well-lit, text visible
- **Categories:** AI tries to match predefined categories
- **Date:** Uses receipt date or defaults to today
- **Premium Only:** Monthly reports only for isPremium users

## 🐛 Troubleshooting

**"Failed to scan receipt"**
- Check GEMINI_API_KEY is correct
- Ensure image is clear
- Try different image

**Monthly reports not received**
- Verify isPremium = true in database
- Check BREVO_API_KEY is valid
- Look at server logs for errors

**Cron job not running**
- Server must be running continuously
- Check timezone setting (Asia/Kolkata)

## 📊 API Limits

- **Free Tier:** 60 requests/minute
- **Receipt Scan:** 1 request per scan
- **Monthly Report:** 1 request per premium user

## 🎉 You're All Set!

Start scanning receipts and enjoy AI-powered expense tracking!
