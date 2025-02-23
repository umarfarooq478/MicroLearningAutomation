# **🚀 Micro-Learning Automation System**  

A fully automated **micro-learning system** that sends **AI-generated daily email lessons**, tracks progress in **Google Sheets**, and sets **Google Calendar reminders**—helping you **stay consistent** in learning any skill!  

## **🔹 Features**  
✅ **Daily AI-generated learning emails** (10-15 min read) 📩  
✅ **Structured lessons** with explanations, examples & practice tasks 📝  
✅ **Micro-learning approach**—small steps every day for long-term mastery  
✅ **Google Sheets integration** for progress tracking 📊  
✅ **Google Calendar reminders** so you never miss a session ⏰  
✅ **Weekend challenge** to deploy a small project and apply your learning 🚀  

## **🔗 How It Works**  
1️⃣ The system fetches **AI-generated** learning material for your scheduled topic.  
2️⃣ Sends **daily email lessons** straight to your inbox.  
3️⃣ Logs progress automatically in **Google Sheets**.  
4️⃣ Sets **calendar reminders** for your learning sessions.  
5️⃣ Assigns a **small project every weekend** to reinforce learning.  

👉 **Struggling with consistency?** Automate your learning & take small steps to **build big skills**!  

---

## **🛠️ Setup & Installation**  

### **1️⃣ Prerequisites**  
- A **Google account** (for Sheets & Calendar integration)  
- A **Google Cloud Project** with Gmail API enabled  
- A **ChatGPT/OpenAI API Key** for AI-generated lessons  

### **2️⃣ Setup Google Apps Script**  
1. Open [Google Apps Script](https://script.google.com/) and create a new project.  
2. Copy and paste the `Code.gs` file into the script editor.  
3. Replace **your OpenAI API Key** and **email settings** in the configuration section.  
4. Grant necessary permissions for Gmail, Sheets, and Calendar.  

### **3️⃣ Setup Google Sheets**  
1. Create a Google Sheet named **Micro-Learning Progress**.  
2. Add columns: `Date | Topic | Status | Time Spent | Penalty Time | Holiday`.  
3. Link the sheet in the script for tracking progress.  

### **4️⃣ Schedule the Script**  
1. Go to **Triggers** in Apps Script.  
2. Schedule:  
   - `sendDailyLearningEmail()` → **Every day at 10 AM**  
   - `addLearningCalendarEvent()` → **Every day at 9 AM**  
3. Done! The system will now send daily learning emails & reminders. 🎯  

---

## **📜 License**  

This project is licensed under the **GNU General Public License v3.0 (GPL v3)**.  
This means:  
✅ You **can use, modify, and distribute** this project freely.  
✅ If you **modify and distribute** this project, you **must share your changes as open-source**.  
✅ You **cannot make it proprietary**—all improvements remain free for the community.  

🔗 **Full License:** [GNU GPL v3 License](https://www.gnu.org/licenses/gpl-3.0.txt)  

---

## **📚 Contributing**  

Pull requests are welcome! Please read our **Code of Conduct** before contributing.  

🔹 **To Contribute:**  
1. **Fork the repository**  
2. **Create a new branch** (`feature-branch-name`)  
3. **Make your changes**  
4. **Submit a Pull Request (PR)** with a clear description  

Before submitting, ensure:  
✅ Your code follows best practices  
✅ Proper documentation is included  
✅ No sensitive data is exposed  

---
