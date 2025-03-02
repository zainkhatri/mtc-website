// IslamicQA.js
import React, { useState, useCallback } from 'react';
import { AlertCircle, Send, Clock, BookOpen } from 'lucide-react';
import { getIslamicAnswer } from './api';

const IslamicQA = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentQuestions, setRecentQuestions] = useState([]);

  const extractSources = useCallback((text) => {
    const sources = [];
    
    // Look for Quran references (e.g., "Quran 2:186")
    const quranRegex = /Quran\s+(\d+:\d+)/g;
    let match;
    while ((match = quranRegex.exec(text)) !== null) {
      sources.push({ type: 'Quran', reference: match[1] });
    }
    
    // Look for Hadith references with improved pattern matching
    const hadithRegex = /(Sahih (?:Bukhari|Muslim)|Sunan (?:Abu Dawud|at-Tirmidhi|Ibn Majah)|Muwatta Malik)(?:\s+(?:Book\s+)?(\d+)(?:,\s+)?(?:Hadith\s+)?(\d+))?/g;
    while ((match = hadithRegex.exec(text)) !== null) {
      sources.push({ 
        type: 'Hadith', 
        book: match[1],
        reference: match[2] && match[3] ? `${match[2]}:${match[3]}` : ''
      });
    }
    
    return sources;
  }, []);

  const handleQuestionSubmit = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const answerText = await getIslamicAnswer(question);
      const sources = extractSources(answerText);
      
      setAnswer({
        text: answerText,
        sources,
        timestamp: new Date().toLocaleTimeString()
      });

      setRecentQuestions(prev => [
        { question, answer: answerText, timestamp: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4)
      ]);

    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleQuestionSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 flex flex-col items-center gap-8">
      <div className="w-full max-w-3xl bg-slate-800/50 backdrop-blur rounded-2xl p-6 md:p-8 shadow-xl border border-white/10">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-yellow-400 mb-8">
          Ask an Islamic Question
        </h1>
        
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your question about Islam..."
              rows="4"
              disabled={loading}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all resize-y min-h-[120px]"
            />
            <div className="absolute right-3 bottom-3 text-sm text-slate-400">
              Press Ctrl + Enter to submit
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button 
            onClick={handleQuestionSubmit}
            disabled={loading || !question.trim()}
            className="w-full bg-yellow-400 text-slate-900 py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Clock className="animate-spin" />
                Getting Answer...
              </>
            ) : (
              <>
                <Send />
                Ask Question
              </>
            )}
          </button>
        </div>

        {answer && (
          <div className="mt-8 bg-slate-700/30 rounded-xl p-6">
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{answer.text}</p>
              
              {answer.sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-600">
                  <h3 className="text-yellow-400 flex items-center gap-2 mb-3">
                    <BookOpen className="h-5 w-5" />
                    Sources
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {answer.sources.map((source, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-400/10 text-yellow-400"
                      >
                        {source.type === 'Quran' ? (
                          `Quran ${source.reference}`
                        ) : (
                          `${source.book} ${source.reference}`
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-right text-sm text-slate-400 mt-4">
                {answer.timestamp}
              </div>
            </div>
          </div>
        )}
      </div>

      {recentQuestions.length > 0 && (
        <div className="w-full max-w-3xl">
          <h2 className="text-xl text-yellow-400 font-semibold mb-4">Recent Questions</h2>
          <div className="space-y-3">
            {recentQuestions.map((item, index) => (
              <div
                key={index}
                className="bg-slate-800/50 rounded-xl p-4 hover:translate-x-1 transition-transform"
              >
                <p className="font-medium">{item.question}</p>
                <div className="text-sm text-slate-400 mt-2">{item.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="max-w-2xl text-center text-sm text-slate-400 bg-slate-800/50 rounded-xl p-4">
        Note: Answers are generated using AI and should not be taken as formal Islamic rulings (fatwa). 
        For important matters, please consult with a qualified Islamic scholar.
      </div>
    </div>
  );
};

export default IslamicQA;