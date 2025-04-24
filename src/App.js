import React, { useState } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [style, setStyle] = useState('random');
  const [rating, setRating] = useState(0);


  const humorStyles = {
    stupid: "ענה תשובה מטופשת להחריד, בלי קשר לשאלה. משהו שכל אדם שפוי לא היה מציע.",
    arrogant: "ענה תשובה מתנשאת, כאילו אתה הכי חכם בעולם וכל השאר פשוט אידיוטים.",
    mystic: "ענה תשובה מיסטית, כמו גורו מסתורי ששתה תה עם חזיזים.",
    evil: "ענה תשובה רעה, צינית, אכזרית, אבל עם חיוך.",
    random: "בחר בעצמך איזה סוג תשובה הזויה בא לך. הפתע אותי."
  };

  const prompt = humorStyles[style] || humorStyles["random"];

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
              content: prompt
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
      <img src="/logo.svg" alt="לוגו הבינה" style={{ width: '80px', marginBottom: '10px' }} />
      <h1>הבינה שהתגעה 🤖</h1><div>
        <label>בחר סגנון:</label>
        <select onChange={(e) => setStyle(e.target.value)} value={style}>
          <option value="random">🎲 רנדומלי</option>
          <option value="stupid">🧠 טיפשי</option>
          <option value="arrogant">🎩 מתנשא</option>
          <option value="mystic">🔮 מיסטי</option>
          <option value="evil">😈 מרושע</option>
        </select>
      </div>


      <input
        type="text"
        placeholder="מה מטריד אותך?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleAsk}>שאלי אותי!</button>
      <div className="answer">{answer}</div>
      {answer && (
        <div className="rating">
          <p>כמה גרועה הייתה התשובה?</p>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                fontSize: "2rem",
                cursor: "pointer",
                color: star <= rating ? "gold" : "gray"
              }}
            >
              ★
            </span>
          ))}
          {rating > 0 && <p>🤖 תודה על הביקורת הקטלנית שלך!</p>}
        </div>
      )}
{answer && (
  <button
    onClick={() => {
      const text = `שאלה: "${question}"\nתשובת הבינה: "${answer}"\n\nניסיתי את "הבינה שהתגעה" 😂 נסו גם אתם: https://binat-gaava.netlify.app`;
      if (navigator.share) {
        navigator.share({
          title: 'הבינה שהתגעה 🤖',
          text,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(text);
        alert("הטקסט הועתק! תוכל להדביק אותו איפה שתרצה 😎");
      }
    }}
  >
    📲 שתף את התשובה הזו
  </button>
)}

    </div>
  );
}

export default App;
