# Gemini AI Integration

## Overview
This expense tracker integrates Google's Gemini AI for two powerful features:
1. **Receipt Scanner** - Auto-fill expense forms by scanning receipt images
2. **Monthly Financial Reports** - AI-generated insights for premium users

## Setup

### 1. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `.env` file:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Install Dependencies
```bash
npm install @google/generative-ai
```

## Features

### Feature 1: Receipt Scanner

**Endpoint:** `POST /expense/scan-receipt`

**How it works:**
1. User uploads receipt image from expense form
2. Gemini AI analyzes the image
3. Extracts: amount, description, category, date
4. Auto-fills the expense form

**Frontend Usage:**
- Click "Upload Receipt Image" button on expense page
- Select receipt photo
- Form fields auto-populate

**Categories Detected:**
- Food, Transport, Shopping, Rent, Bills
- Entertainment, Health, Education, Other

### Feature 2: Monthly Email Reports (Premium Users Only)

**Schedule:** 1st of every month at 9 AM IST

**Report Includes:**
1. **Monthly Income** - Total income for the month
2. **Category-wise Spending** - Amount and percentage breakdown
3. **AI-Generated Insights** - Personalized financial advice

**How it works:**
1. Cron job runs monthly
2. Fetches all premium users
3. Analyzes last month's transactions
4. Generates AI insights using Gemini
5. Sends email via Brevo

**Manual Trigger (for testing):**
```javascript
const emailReportService = require('./services/emailReportService');
await emailReportService.sendMonthlyReport(userId);
```

## API Endpoints

### Scan Receipt
```
POST /expense/scan-receipt
Authorization: Bearer <token>

Body:
{
  "image": "data:image/jpeg;base64,..."
}

Response:
{
  "amount": 250.50,
  "description": "Grocery shopping",
  "category": "Food",
  "date": "2024-01-15"
}
```

## Services

### geminiService.js
- `scanReceipt(imageBase64)` - Extracts data from receipt
- `generateFinancialInsights(monthlyData)` - Creates personalized advice

### emailReportService.js
- `sendMonthlyReport(userId)` - Sends report to one user
- `sendAllMonthlyReports()` - Sends to all premium users

## Cron Job Configuration

```javascript
// Runs at 9 AM on 1st of every month
cron.schedule('0 9 1 * *', async () => {
  await emailReportService.sendAllMonthlyReports();
}, {
  timezone: "Asia/Kolkata"
});
```

## Error Handling

- Invalid image format → Returns error message
- API quota exceeded → Logs error, continues for other users
- No transactions → Skips report generation

## Cost Considerations

- Gemini API has free tier: 60 requests/minute
- Receipt scanning: ~1 request per scan
- Monthly reports: 1 request per premium user

## Testing

### Test Receipt Scanner:
1. Go to `/expenses`
2. Click "Upload Receipt Image"
3. Upload a receipt photo
4. Verify form auto-fills

### Test Monthly Report:
```javascript
// In Node.js console
const emailReportService = require('./services/emailReportService');
await emailReportService.sendMonthlyReport(YOUR_USER_ID);
```

## Troubleshooting

**Receipt not scanning:**
- Check GEMINI_API_KEY is set
- Ensure image is clear and readable
- Try different image formats (JPG, PNG)

**Monthly reports not sending:**
- Verify cron job is running
- Check BREVO_API_KEY is valid
- Ensure users have isPremium = true
- Check server logs for errors
