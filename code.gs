
const EMAIL = "your.email@gmail.com";
const SHEET_NAME = "Backend Mastery Progress";
const CALENDAR_NAME = "Backend Learning Schedule";
const OPENAI_API_KEY = "sk-None-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Replace with your OpenAI API Key


// Function to call OpenAI API
function fetchOpenAIContent(topic) {
  let prompt = `
  You are a backend development mentor. Provide **highly detailed and structured** learning material for the topic: "${topic}" in **fully formatted HTML**.

  **🚨 STRICT INSTRUCTIONS:**
  - 🚫 **DO NOT** use Markdown.
  - 🚫 **DO NOT** wrap the response in \`\`\`html ... \`\`\`.
  - ✅ **RETURN PURE HTML** with proper formatting.
  - ✅ Ensure **Detailed Learning** is **1000-1500 words long** (10-15 min read).
  - ✅ Use **real-world examples, best practices, performance considerations, pros & cons**.
  - ✅ Provide **step-by-step implementation details** with code examples.
  - ✅ Use **<pre><code> blocks** for code.
  - ✅ Include **at least 3 high-quality external resources** with links and explanations.

  **Example Response Format:**
  <h2>📚 Overview</h2>
  <p>[Brief introduction explaining the topic]</p>

  <h2>📖 Detailed Learning</h2>
  <p>[Detailed explanation of concepts, why it's important]</p>
  
  <h3>🚀 How it Works</h3>
  <p>[Explain the fundamental working principle in-depth]</p>

  <h3>🛠 Implementing ${topic} in a Real Application</h3>
  <p>[Step-by-step guide on how to implement the topic]</p>

  <pre><code>[Multiple code snippets with explanations]</code></pre>

  <h3>✅ Best Practices</h3>
  <ul>
    <li>[Best practice 1]</li>
    <li>[Best practice 2]</li>
    <li>[Best practice 3]</li>
  </ul>

  <h3>⚠️ Common Mistakes & How to Avoid Them</h3>
  <ul>
    <li>[Mistake 1 and how to fix it]</li>
    <li>[Mistake 2 and best alternative]</li>
  </ul>

  <h3>📊 Performance Optimizations</h3>
  <p>[Discuss memory management, indexing, caching strategies, load balancing, etc.]</p>

  <h3>🔐 Security Considerations</h3>
  <p>[Explain security risks and how to mitigate them]</p>

  <h3>🔄 Alternative Approaches</h3>
  <p>[Describe different ways to achieve the same result and their trade-offs]</p>

  <h3>🎯 Practice Task</h3>
  <p>[A hands-on project or coding challenge]</p>

  <h2>📚 Additional Resources</h2>
  <ul>
    <li><a href="[Resource 1 URL]">[Resource 1 Title]</a> - [Why this is useful]</li>
    <li><a href="[Resource 2 URL]">[Resource 2 Title]</a> - [How this helps]</li>
    <li><a href="[Resource 3 URL]">[Resource 3 Title]</a> - [Insights from this resource]</li>
  </ul>

  🚨 **REMEMBER:**  
  - **DO NOT** include extra text or explanations outside the HTML.  
  - **DO NOT** use Markdown.  
  - **DO NOT** wrap the response in code blocks (\`\`\`).  
  - **USE ONLY HTML STRUCTURE AS INSTRUCTED.**
  `;

  let url = "https://api.openai.com/v1/chat/completions";
  let payload = {
    model: "gpt-4",
    messages: [{ role: "system", content: prompt }],
    max_tokens: 3000 // Increased to allow longer responses
  };

  let options = {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    payload: JSON.stringify(payload)
  };

  let response = UrlFetchApp.fetch(url, options);
  let json = JSON.parse(response.getContentText());

  return json.choices[0].message.content;  // Now it will return pure HTML
}



// Function to send daily learning email
function sendDailyLearningEmail() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  let data = sheet.getDataRange().getValues();

  let today = new Date();

  let todayStr = Utilities.formatDate(today, Session.getScriptTimeZone(), "E dd MMM, yyyy");

  let rowIndex = data.findIndex(row => {
    let sheetDateFormatted = Utilities.formatDate(new Date(row[0]), Session.getScriptTimeZone(), "E dd MMM, yyyy");
    return sheetDateFormatted === todayStr;
  });

  console.log({ todayStr, rowIndex });


  if (rowIndex === -1) return;


  let [date, topic, status, timeSpent, penaltyTime, holiday] = data[rowIndex];

  if (holiday === "Yes") return; // Skip if it's a holiday

  let learningTime = 45;
  let previousStatus = ''
  let practiceTime = 30;
  if (rowIndex > 2) {

    let { status: previousStatus2 } = data[rowIndex - 1]
    previousStatus = previousStatus2;

    if (previousStatus === "Pending") {
      // Apply penalty for missed day
      learningTime += 15;
      sheet.getRange(rowIndex, 5).setValue(learningTime - 45); // Update penalty time
    }
  }



  
   let aiGeneratedHtml = fetchOpenAIContent(topic);

  let emailSubject = `Today's Backend Learning Goal: ${topic}`;
  let emailBody = `
    <h2>📚 Today's Goal: ${topic}</h2>
    <p><strong>Learning Time:</strong> ${learningTime} mins</p>
    <p><strong>Practice Time:</strong> ${practiceTime} mins</p>
    ${aiGeneratedHtml}
    <h2>📢 Reminder</h2>
    <p>${status === "Pending" ? "❌ You missed yesterday! Extra 15 min added today!" : "✅ Stay consistent!"}</p>
    <p><em>Update your progress in the Google Sheet.</em></p>
  `;

  MailApp.sendEmail({
    to: EMAIL,
    subject: emailSubject,
    htmlBody: emailBody
  });

  // Update status in Google Sheets
  sheet.getRange(rowIndex + 1, 3).setValue("Pending"); // Mark today's task as pending
}

// Function to add Google Calendar reminders
function addLearningCalendarEvent() {
  let calendar = CalendarApp.getCalendarsByName(CALENDAR_NAME)[0];
  if (!calendar) {
    calendar = CalendarApp.createCalendar(CALENDAR_NAME);
  }

  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  let data = sheet.getDataRange().getValues();

  let today = new Date();
  let todayStr = Utilities.formatDate(today, Session.getScriptTimeZone(), "yyyy-MM-dd");

  let rowIndex = data.findIndex(row => row[0] === todayStr);
  if (rowIndex === -1) return;

  let [, topic, , , , holiday] = data[rowIndex];
  if (holiday === "Yes") return; // Skip if it's a holiday

  let eventTime = (isRamadan() ? 11 : 8) + ":00"; // Adjust for Ramadan
  let event = calendar.createEvent(
    `📚 Backend Learning: ${topic}`,
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), eventTime, 0),
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), eventTime, 30)
  );

  event.setDescription(`Today's topic: ${topic}`);
}

// Function to check if it's Ramadan (Adjust manually)
function isRamadan() {
  let today = new Date();
  let ramadanStart = new Date(today.getFullYear(), 2, 11); // March 11, 2024 (Example)
  let ramadanEnd = new Date(today.getFullYear(), 3, 10); // April 10, 2024 (Example)

  return today >= ramadanStart && today <= ramadanEnd;
}

// Schedule the functions
function scheduleTasks() {
  ScriptApp.newTrigger("sendDailyLearningEmail").timeBased().everyDays(1).atHour(10).create();
  ScriptApp.newTrigger("sendDailyLearningEmail").timeBased().everyDays(1).atHour(20).create();
  ScriptApp.newTrigger("addLearningCalendarEvent").timeBased().everyDays(1).atHour(9).create();
}
