# Excel Import Guide

## Overview
You can now import multiple subscriptions at once using an Excel file (.xlsx or .xls).

## Excel File Format

Your Excel file should have the following columns:

### Required Columns
- **Tool Name**: The name of the tool/subscription (e.g., "ChatGPT", "GitHub Copilot")
- **Subscription Expiry Date**: The expiry/renewal date in format YYYY-MM-DD (e.g., "2025-12-31") or Excel date

### Optional Columns
- **Subscription Cost**: The cost of the subscription (default: 0)
- **Type**: Category/type of the tool (e.g., "AI Tools", "Development", "Design")
- **Notes**: General notes about the subscription
- **Pro's**: Advantages of this tool
- **Con's**: Disadvantages or limitations
- **Status**: Current status (imported as part of notes)
- **How I'm Using It**: Description of your use case
- **Related Projects**: Projects where you use this tool
- **Official Website**: The tool's website (imported as part of notes)
- **Recommendation Score**: Your rating (imported as part of notes)
- **username**: Login username (if applicable)
- **password**: Login password (if applicable)
- **paymentMethod**: Payment method used (e.g., "Credit Card", "PayPal")
- **billingPeriod**: Either "monthly" or "yearly" (default: "monthly")
- **reminderDays**: Days before renewal to send reminder (default: 30)

## Sample Excel Template

| Tool Name | Subscription Cost | Subscription Expiry Date | Type | Notes | Pro's | Con's | Status | How I'm Using It | Related Projects | Official Website | Recommendation Score |
|-----------|-------------------|-------------------------|------|-------|-------|-------|--------|------------------|------------------|-----------------|---------------------|
| ChatGPT Plus | 20 | 2025-02-01 | AI Tools | Best AI assistant | Great responses, multimodal | Can be slow at times | Active | Daily coding and writing | Personal Blog, Work Projects | https://openai.com | 9 |
| GitHub Copilot | 10 | 2025-03-15 | Development | AI code completion | Fast, accurate suggestions | Sometimes off context | Active | All coding projects | All repos | https://github.com/features/copilot | 8 |
| Midjourney | 30 | 2025-01-20 | AI Tools | AI image generation | Amazing quality | Can be expensive | Active | Design mockups | UI/UX Projects | https://midjourney.com | 9 |

## How to Use

1. **Prepare Your Excel File**
   - Create an Excel file with the columns listed above
   - Fill in your subscription data
   - Make sure at least `Tool Name` and `Subscription Expiry Date` columns are filled

2. **Import via Dashboard**
   - Open your subscription manager dashboard
   - Click the "Import from Excel" button (next to "Add Subscription")
   - Select your Excel file
   - Click "Import"

3. **Review Results**
   - The import dialog will show you how many subscriptions were successfully imported
   - Any errors will be displayed with the row number and reason for failure
   - Successfully imported subscriptions will appear in your dashboard immediately

## Tips

- **Missing Data is OK**: Only Tool Name and Subscription Expiry Date are required - all other fields are optional
- **Empty Rows**: Completely empty rows are automatically skipped
- **Date Format**: Use YYYY-MM-DD format (e.g., "2025-12-31") or Excel's date format
- **Column Names**: Use exact column names as shown above for best results
- **Notes Consolidation**: Pro's, Con's, Status, How I'm Using It, Related Projects, Official Website, and Recommendation Score are automatically combined into the notes field
- **Default Values**: Missing cost defaults to 0, billing period to monthly, reminder days to 30
- **Validation**: Each row is validated before import - invalid rows will be skipped with an error message
- **Passwords**: If you include username/password columns, passwords are automatically encrypted
- **Partial Imports**: If some rows fail validation, the valid rows will still be imported

## Troubleshooting

### Common Errors

1. **"Missing required field 'name'"**
   - Make sure every row has a value in the "Tool Name" column

2. **"Missing required field 'renewalDate'"**
   - Ensure every row has a valid date in the "Subscription Expiry Date" column

3. **"Invalid date format"**
   - Use YYYY-MM-DD format or Excel's date format
   - Make sure the date is a valid calendar date

4. **"Invalid billing period"**
   - Use only "monthly" or "yearly"
   - Check for typos or extra spaces

## Example Import

Here's a simple example you can copy into Excel:

```
Tool Name,Subscription Cost,Subscription Expiry Date,Type,Notes,Pro's,Con's,How I'm Using It
ChatGPT Plus,20,2025-02-01,AI Tools,Best AI assistant,Great responses,Can be slow,Daily coding and writing
GitHub Copilot,10,2025-03-15,Development,AI code completion,Fast suggestions,Sometimes off context,All coding projects
Midjourney,30,2025-01-20,AI Tools,AI image generation,Amazing quality,Can be expensive,Design mockups
```

Save this as a .xlsx or .xls file and import it!
