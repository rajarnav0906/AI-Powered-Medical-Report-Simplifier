# 🧠 AI-Powered Medical Report Simplifier

This project is a **backend service** that transforms **complex medical reports** (typed or scanned) into **easy-to-understand summaries** for patients.  

It uses **OCR** to read reports, **fixes spelling errors**, organizes the data into **clean JSON**, and then explains results in **simple, friendly language** with the help of **Google Gemini**.

---

## 🎥 Demo

👉 Watch the demo here:  
[▶️ Demo Video](https://drive.google.com/file/d/1VSlLwNgglrq4UrH7IM5HgNNMNoh6ZdbG/view?usp=drive_link)

---

## ✨ Features
- 📄 Accepts both **text input** and **image uploads**.  
- 🔍 **OCR support** to read scanned or handwritten reports.  
- 📝 Auto-corrects spelling mistakes (e.g., `Hemglbin → Hemoglobin`).  
- 📊 Normalizes results into **structured JSON with standard ranges**.  
- 🛡️ Guardrails to reject hallucinated or invalid test names.  
- 💬 Generates **clear patient-friendly explanations**.  

---

## 🛠️ Tech Stack
- ⚡ **Node.js + Express** → backend framework  
- 👁️ **Tesseract.js + Sharp** → OCR & image preprocessing  
- 🤖 **Google Gemini 2.5 (Pro + Flash)** → AI-powered normalization & summaries  
- 🧾 **Nspell** → spell correction with medical word list  
- 🗂️ **Multer + Rate Limiting + CORS** → file uploads & security  

---

## 🏗️ How It Works (Architecture)

The system works in 4 simple stages:

### 🔹 Step 1 – Reading the Report (OCR / Extraction)
- Accepts either plain text or a scanned image of a medical report.  
- Uses OCR (Optical Character Recognition) to read the content.  
- Cleans up the extracted text to get **raw test lines** (like “Hemoglobin 10.2 g/dL”).  

---

### 🔹 Step 2 – Making Sense of the Data (Normalization)
- Matches tests to **standard names and units** (e.g., `Hemglbin → Hemoglobin`).  
- Assigns a status: **Low, Normal, High, or Borderline**.  
- Adds standard **reference ranges** for each test.  

---

### 🔹 Step 3 – Explaining in Simple Words (Summary)
- AI converts technical results into **easy-to-understand explanations**.  
- No medical diagnosis — only **clear, reassuring descriptions**.  
- Guardrails ensure that only tests actually present in the input are included (no hallucinations).  

---

### 🔹 Step 4 – Final JSON Output
- Combines everything into one structured JSON response.  
- Includes:
  - Raw extracted lines  
  - Normalized tests with ranges and status  
  - A **patient-friendly summary**  

✅ This way, both developers and patients get exactly what they need: structured data for machines and simple explanations for humans.


---

## 🚀 Getting Started

### 1️⃣ Clone the project
```bash
git clone https://github.com/rajarnav0906/AI-Powered-Medical-Report-Simplifier
cd ai-powered-medical-report-simplifier
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Add environment variables
Create a `.env` file in the root:
```
PORT=5000
GEMINI_API_KEY=your_api_key_here
```

### 4️⃣ Run the server
```bash
npm start
```

Server will run on 👉 [http://localhost:5000](http://localhost:5000)

---

## 📡 API Usage

### 🔹 **Text Input**
**Endpoint:**
```http
POST /api/v1/simplify-report
Content-Type: application/json
```

**Body:**
```json
{
  "text": "CBC Report: Hemglbin 10.5 g/dL (Low), WBC 12,300 /uL (High)"
}
```

**Response:**
```json
{
  "tests": [
    {
      "name": "Hemoglobin",
      "value": 10.5,
      "unit": "g/dL",
      "status": "Low",
      "ref_range": { "low": 13.5, "high": 17.5 }
    },
    {
      "name": "WBC",
      "value": 12300,
      "unit": "/uL",
      "status": "High",
      "ref_range": { "low": 4000, "high": 11000 }
    }
  ],
  "summary": "Your Hemoglobin is slightly low and your WBC count is high. Please discuss with your doctor.",
  "status": "ok"
}
```

---

### 🔹 **Image Input**
**Endpoint:**
```http
POST /api/v1/simplify-report
Content-Type: multipart/form-data
```

**Body:**
- Key: `file`  
- Value: upload `report.jpg` or `report.png`

**Response:**
```json
{
  "tests_raw": ["Hemoglobin 10.2 g/dL (Low)", "WBC 11,200 /uL (High)"],
  "tests": [...],
  "summary": "...",
  "status": "ok"
}
```

---

## 🔮 Future Enhancements
- 💾 Save reports in a database for **history tracking**.  
- 🌐 Build a **frontend UI** for easy uploads.  
- 📑 Support **batch uploads** (multiple reports at once).  
- 🔒 Add **user authentication** for security.  

---

## 👨‍💻 Author
Made with ❤️ by *Your Name*  
