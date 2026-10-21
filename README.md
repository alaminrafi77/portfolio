# MD AL AMIN RAFI - 1990s Web 1.0 Retro Portfolio & Interactive CV

An authentic 1990s Netscape Navigator & Windows 95 personal portfolio and curriculum vitae for **MD AL AMIN RAFI** (AI & Machine Learning Researcher, M.Sc. in Applied AI Candidate at UNITAR International University, Malaysia).

[![Deploy to GitHub Pages](https://github.com/alaminrafi77/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/alaminrafi77/portfolio/actions/workflows/deploy.yml)

## 🌟 Features

- **Authentic 1990s Web 1.0 Design**: Netscape 4.0 chrome, 3D beveled outset/inset borders, marquee news ticker, classic retro 88x31 badges, and Windows 95 taskbar with a functional Start menu.
- **Synthesized 90s Web Audio**: Built-in 8-bit chiptune background music player and 56k dial-up modem handshake sound generator (pure Web Audio API, zero external audio dependencies).
- **Interactive MS-DOS Shell**: Vintage command-line console (`ai`, `cv`, `skills`, `projects`, `edu`, `contact`, `theme`).
- **Interactive World Wide Web Guestbook**: Visitors can leave messages with vintage 90s icons, saved persistently in local storage.
- **Curriculum Vitae**:
  - **Master in Applied Artificial Intelligence** (UNITAR International University, Malaysia · Expected 2027)
  - **B.Sc. in Computer Science and Engineering** (City University · 2022 – 2025)
  - **5 Verified Projects**: AI Prescription Analysis (Tesseract OCR & spaCy NLP), Sentiment Analysis of Bangla/Banglish reviews, Movie RecSys, Arduino Weather IoT, Restaurant Billing System (x86 Assembly).
  - **2 Research Domains**: AI-Driven Cloud Security, NFC Vulnerability Assessment.
  - **Languages**: Native Bangla, Certified English (B2 Upper Intermediate / IELTS 5.5).
  - **Academic Reference**: Md. Showrov Hossen (Lecturer, Dept of CSE, City University).
  - **Downloadable Original PDF CV**: Direct link to `C.V_75e6b025.pdf`.

---

## 🚀 How to Host on GitHub Pages (Step-by-Step)

### Step 1: Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Set the repository name to `portfolio` (or `alaminrafi77.github.io`).
3. Choose **Public** and leave it empty (do NOT check "Initialize with README").
4. Click **Create repository**.

### Step 2: Push Your Code to GitHub
Run the following commands in your terminal:

```bash
# Initialize git and commit files
git init
git add .
git commit -m "Initial commit: 90s retro portfolio for Md Al Amin Rafi"

# Rename default branch to main
git branch -M main

# Connect to your GitHub repository
git remote add origin https://github.com/alaminrafi77/portfolio.git

# Push code to GitHub
git push -u origin main
```

*(Note: Replace `portfolio` with your repository name if different)*

### Step 3: Enable GitHub Pages
1. On GitHub, go to your repository **Settings** tab.
2. In the left sidebar, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment** > **Source**, select:
   👉 **GitHub Actions**
4. That's it! The included `.github/workflows/deploy.yml` workflow will automatically build and publish your website.
5. Your portfolio will be live at:
   🌐 `https://alaminrafi77.github.io/portfolio/` (or `https://alaminrafi77.github.io/` if using username repo).

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
