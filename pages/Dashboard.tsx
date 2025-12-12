import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase-config';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { AssignmentData } from '../types';
import { Trash2, FileText, Download, Clock, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exportToPDF, exportToWord } from '../utils/exportUtils';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentData | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchAssignments = async () => {
      if (!db) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'assignments'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const fetched: AssignmentData[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as AssignmentData);
        });
        setAssignments(fetched);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user, navigate]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this assignment?') && db) {
      try {
        await deleteDoc(doc(db, 'assignments', id));
        setAssignments(prev => prev.filter(a => a.id !== id));
        if (selectedAssignment?.id === id) setSelectedAssignment(null);
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleExportPDF = (e: React.MouseEvent, assignment: AssignmentData) => {
    e.stopPropagation();
    exportToPDF(assignment);
  };
  
  const handleExportWord = (e: React.MouseEvent, assignment: AssignmentData) => {
    e.stopPropagation();
    exportToWord(assignment);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.displayName || user?.email}</p>
        </div>
        <button 
          onClick={() => navigate('/generator')}
          className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
        >
          + New Assignment
        </button>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white">No assignments yet</h3>
          <p className="text-gray-400 mt-2 mb-6">Create your first intelligent academic work today.</p>
          <button 
            onClick={() => navigate('/generator')}
            className="text-primary hover:underline"
          >
            Go to Generator
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <div 
              key={assignment.id} 
              onClick={() => setSelectedAssignment(assignment)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer group hover:transform hover:-translate-y-1 shadow-lg hover:shadow-primary/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex space-x-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={(e) => handleDelete(e, assignment.id!)} 
                    className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{assignment.topic}</h3>
              <div className="flex flex-wrap items-center text-sm text-gray-400 mb-4 gap-2">
                <span className="bg-gray-800 px-2 py-0.5 rounded text-xs border border-gray-700">{assignment.format}</span>
                 {assignment.length && <span className="bg-gray-800 px-2 py-0.5 rounded text-xs border border-gray-700">{assignment.length}</span>}
                <span className="flex items-center gap-1 ml-auto">
                  <Clock className="h-3 w-3" />
                  {assignment.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-800 flex gap-2">
                <button 
                   onClick={(e) => handleExportPDF(e, assignment)}
                   className="flex-1 flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm transition-colors"
                >
                  <Download className="h-3 w-3" /> PDF
                </button>
                <button 
                   onClick={(e) => handleExportWord(e, assignment)}
                   className="flex-1 flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm transition-colors"
                >
                  <Download className="h-3 w-3" /> Word
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedAssignment(null)}>
          <div className="bg-white text-gray-900 w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
               <div>
                  <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{selectedAssignment.topic}</h2>
                  <p className="text-sm text-gray-500">{selectedAssignment.format} • {selectedAssignment.length}</p>
               </div>
               <button onClick={() => setSelectedAssignment(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="h-6 w-6 text-gray-500" />
               </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-white font-serif">
               <div className="max-w-3xl mx-auto space-y-8">
                  <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">{selectedAssignment.topic}</h1>
                  </div>

                  <section>
                    <h3 className="text-xl font-sans font-bold mb-3 text-gray-900 border-b pb-1">Introduction</h3>
                    <p className="whitespace-pre-line text-justify leading-relaxed text-gray-800">{selectedAssignment.sections.introduction}</p>
                  </section>

                  <section>
                    <h3 className="text-xl font-sans font-bold mb-3 text-gray-900 border-b pb-1">Development</h3>
                    <p className="whitespace-pre-line text-justify leading-relaxed text-gray-800">{selectedAssignment.sections.development}</p>
                  </section>

                  <section>
                    <h3 className="text-xl font-sans font-bold mb-3 text-gray-900 border-b pb-1">Conclusion</h3>
                    <p className="whitespace-pre-line text-justify leading-relaxed text-gray-800">{selectedAssignment.sections.conclusion}</p>
                  </section>

                  <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h3 className="text-xl font-sans font-bold mb-3 text-gray-900">Bibliography</h3>
                    <p className="whitespace-pre-line italic text-gray-700">{selectedAssignment.sections.bibliography}</p>
                  </section>
               </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end flex-shrink-0">
                <button 
                  onClick={() => exportToPDF(selectedAssignment)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-900 font-medium transition-colors"
                >
                  <Download className="h-4 w-4" /> PDF
                </button>
                <button 
                  onClick={() => exportToWord(selectedAssignment)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                >
                  <Download className="h-4 w-4" /> Word
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;