# 🏆 Lottery Sambad - Live Results & Publishing Portal

A production-ready web application for publishing, managing, and viewing live **Lottery Sambad** results (Nagaland, Sikkim, and West Bengal State Lotteries). Fully equipped with **Domain Verification Backlink**, **Live Draw Countdown**, **Ticket Checker**, and **Lottery Sambad API integration**.

---

## ✨ Features

- 🎯 **Domain Verification Ready**: Includes the mandatory `<a href="https://lottery.sambad.com/">Lottery Sambad</a>` badge on the homepage to instantly verify your domain on the Lottery Sambad portal and obtain your Bearer API token.
- ⏰ **All 3 Daily Draws Supported**:
  - **1:00 PM** (Dear Morning / Meghna)
  - **6:00 PM** (Dear Day / Mountain)
  - **8:00 PM** (Dear Evening / Sandpiper)
- 📝 **3-Way Result Publishing**:
  1. **Smart Text / PDF Paste**: Paste raw text from gazettes, PDFs, or WhatsApp messages — the intelligent parser automatically extracts 1st, 2nd, 3rd, 4th, and 5th prize numbers.
  2. **Official Sambad API Sync**: Fetch live official results directly with your token.
  3. **Manual Entry Form**: Full control over draw names, states, prize structures, and ticket numbers.
- 🔍 **Instant Ticket Win Checker**: Users can enter their ticket numbers to instantly check if they won 1st, 2nd, 3rd, 4th, 5th, or Consolation prizes with celebratory animations.
- 📚 **Full Historical Result Archive (`/archive`)**:
  - Interactive Monthly Calendar & Year/Month Selector (2026, 2025, 2024, 2023).
  - Quick date shortcuts (Today, Yesterday, 7 Days Ago, 14 Days Ago, 30 Days Ago).
  - Dual viewing options: **Monthly Summary Table** & **Full Gazette Result Charts**.
  - **Export to CSV & JSON** for easy data backup and offline analysis.
- 📱 **WhatsApp Share & PDF Print**: 1-click sharing of formatted results to WhatsApp groups and print-friendly PDF layouts.
- ⚡ **Full Stack Next.js + Tailwind CSS**: Zero-configuration deployment on **Vercel** and **Render**.

---

## 🚀 1-Click Deployment

### Deploy to Vercel (Recommended)
1. Push this repository to your GitHub account.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import your repository and click **Deploy** (Framework preset: Next.js).
4. (Optional) Set environment variable:
   - `LOTTERY_SAMBAD_API_KEY`: Your Sambad Bearer Token.

### Deploy to Render
1. Push this repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New Web Service**.
3. Select your repository.
4. Settings:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free

---

## 🔑 How to Get Your Free Lottery Sambad API Token

1. **Deploy your website** to Vercel (e.g. `https://your-lottery-site.vercel.app`) or Render.
2. Go to [lottery.sambad.com](https://lottery.sambad.com/) and **Sign in with Google**.
3. The required verification link is already included on this website:
   ```html
   <a href="https://lottery.sambad.com/">Lottery Sambad</a>
   ```
4. Enter your deployed URL in Step 3 on the portal and click **"Check link & get token"**.
5. Copy your issued Bearer Token, open your site, and paste it into the **Set Token** input or the **Sambad API Sync** publisher tab!

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```
