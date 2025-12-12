import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateAssignment } from '../services/geminiService';
import { AcademicFormat, AssignmentData } from '../types';
import { Loader2, Save, FileText, FileDown, AlertCircle } from 'lucide-react';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { exportToPDF, exportToWord } from '../utils/exportUtils';
import { useNavigate } from 'react-router-dom';

const Generator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState<AcademicFormat>(AcademicFormat.Normal);
  const [length, setLength] = useState('Short (1-2 pages)');
  const [details, setDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AssignmentData['sections'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const generatedData = await generateAssignment(topic, format, details, length);
      setResult(generatedData);
    } catch (err) {
      setError("Failed to generate assignment. Please try again later or check your API configuration.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!result) return;

    setIsSaving(true);
    try {
      if (db) {
        await addDoc(collection(db, 'assignments'), {
          userId: user.uid,
          topic,
          format,
          length,
          sections: result,
          createdAt: serverTimestamp()
        });
        alert('Assignment saved to Dashboard!');
      } else {
        alert('Database not configured. Cannot save.');
      }
    } catch (err) {
      console.error('Error saving:', err);
      alert('Failed to save assignment.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Academic Assignment Generator</h1>
        <p className="text-gray-400 mt-2">Fill in the details below to generate your paper</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 sticky top-24">
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Topic</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. The Impact of AI on Education"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Format Style</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as AcademicFormat)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  {Object.values(AcademicFormat).map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Length</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="Short (1-2 pages)">Short (1-2 pages)</option>
                  <option value="Medium (3-5 pages)">Medium (3-5 pages)</option>
                  <option value="Long (6-10 pages)">Long (6-10 pages)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Specific Points (Optional)</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Include specific theories, authors, or focus areas..."
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || !topic}
                className="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 flex justify-center items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" /> Generating...
                  </>
                ) : (
                  'Generate Assignment'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Output Area */}
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg flex items-center gap-3 text-red-200 mb-6">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {result ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-wrap gap-3 mb-6 bg-gray-900 p-4 rounded-xl border border-gray-800">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                  Save to Dashboard
                </button>
                <div className="h-8 w-[1px] bg-gray-700 mx-2 hidden sm:block"></div>
                <button 
                  onClick={() => result && exportToPDF({ userId: 'temp', topic, format, sections: result, createdAt: null })}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                >
                  <FileText className="h-4 w-4" /> PDF
                </button>
                <button 
                  onClick={() => result && exportToWord({ userId: 'temp', topic, format, sections: result, createdAt: null })}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
                >
                  <FileDown className="h-4 w-4" /> Word
                </button>
              </div>

              <div className="bg-white text-gray-900 p-8 rounded-lg shadow-xl min-h-[600px] leading-relaxed">
                <h2 className="text-3xl font-bold text-center mb-8 font-serif">{topic}</h2>
                
                <div className="space-y-8">
                  <section>
                    <h3 className="text-xl font-bold mb-3 border-b-2 border-gray-200 pb-1">1. Introduction</h3>
                    <p className="whitespace-pre-line text-justify text-gray-800">{result.introduction}</p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold mb-3 border-b-2 border-gray-200 pb-1">2. Development</h3>
                    <p className="whitespace-pre-line text-justify text-gray-800">{result.development}</p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold mb-3 border-b-2 border-gray-200 pb-1">3. Conclusion</h3>
                    <p className="whitespace-pre-line text-justify text-gray-800">{result.conclusion}</p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold mb-3 border-b-2 border-gray-200 pb-1">Bibliography</h3>
                    <div className="bg-gray-50 p-6 rounded border border-gray-200">
                       <p className="whitespace-pre-line italic text-gray-700">{result.bibliography}</p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          ) : (
            !isGenerating && (
              <div className="flex flex-col items-center justify-center h-[500px] bg-gray-900 rounded-xl border border-gray-800 text-gray-500">
                <FileText className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">Ready to generate</p>
                <p className="text-sm">Your structured assignment will appear here.</p>
              </div>
            )
          )}
          
          {isGenerating && (
             <div className="flex flex-col items-center justify-center h-[500px] bg-gray-900 rounded-xl border border-gray-800">
                <div className="relative">
                  <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white ml-0.5 mb-4">AI</span>
                  </div>
                </div>
                <p className="text-gray-300 animate-pulse text-lg font-medium">Drafting your academic paper...</p>
                <p className="text-sm text-gray-500 mt-2 max-w-xs text-center">Creating structured introduction, development, and conclusion.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;