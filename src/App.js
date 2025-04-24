import React, { useState } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAsk = async () => {
    if (!question.trim()) return;
    setAnswer('🤖 חושבת...');
  
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "את עוזרת בינה מלאכותית גרועה, שחושבת שהיא גאונה, ותמיד עונה תשובות מגוחכות, גרועות, או מנותקות מהמציאות. התשובות שלך צריכות להצחיק ולהיות מופרכות."
            },
            {
              role: "user",
              content: question
            }
          ]
        })
      });
  
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "משהו השתבש. אולי תנסה לקנות עוגה.";
      setAnswer(text);
    } catch (err) {
      setAnswer("הבינה קרסה. תנסה לשאול שוב או שתשתה מים.");
    }
  };
  
  return (
    <div className="App">
      <h1>הבינה שהתגעה 🤖</h1>
      <input
        type="text"
        placeholder="מה מטריד אותך?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleAsk}>שאלי אותי!</button>
      <div className="answer">{answer}</div>
    </div>
  );
}

export default App;
