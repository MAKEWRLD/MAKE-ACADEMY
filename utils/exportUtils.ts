import { jsPDF } from 'jspdf';
import saveAs from 'file-saver';
import { AssignmentData } from '../types';

export const exportToPDF = (data: AssignmentData) => {
  const doc = new jsPDF();
  let cursorY = 20;

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(data.topic.toUpperCase(), 170);
  doc.text(titleLines, 105, cursorY, { align: 'center' });
  cursorY += (titleLines.length * 10) + 10;

  doc.setFontSize(12);
  
  const addSection = (title: string, content: string) => {
    // Check space for title
    if (cursorY > 260) {
      doc.addPage();
      cursorY = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), 20, cursorY);
    cursorY += 8;
    
    doc.setFont('helvetica', 'normal');
    // Split text to fit width
    const lines = doc.splitTextToSize(content, 170);
    
    lines.forEach((line: string) => {
      if (cursorY > 280) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(line, 20, cursorY);
      cursorY += 6; // Line spacing
    });
    cursorY += 10; // Section spacing
  };

  addSection("1. Introduction", data.sections.introduction);
  addSection("2. Development", data.sections.development);
  addSection("3. Conclusion", data.sections.conclusion);
  addSection("Bibliography", data.sections.bibliography);

  doc.save(`${data.topic.replace(/\s+/g, '_').substring(0, 30)}_assignment.pdf`);
};

export const exportToWord = (data: AssignmentData) => {
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${data.topic}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; color: #000000; }
        h1 { font-size: 16pt; text-align: center; font-weight: bold; margin-bottom: 24px; }
        h2 { font-size: 14pt; margin-top: 24px; margin-bottom: 12px; font-weight: bold; }
        p { text-align: justify; line-height: 1.5; margin-bottom: 12px; }
        .bibliography { margin-top: 36px; border-top: 1px solid #ccc; pt-4; }
      </style>
    </head>
    <body>
      <h1>${data.topic}</h1>
      
      <h2>1. Introduction</h2>
      <p>${data.sections.introduction.replace(/\n/g, '<br/>')}</p>
      
      <h2>2. Development</h2>
      <p>${data.sections.development.replace(/\n/g, '<br/>')}</p>
      
      <h2>3. Conclusion</h2>
      <p>${data.sections.conclusion.replace(/\n/g, '<br/>')}</p>
      
      <h2>Bibliography</h2>
      <div class="bibliography">
        <p>${data.sections.bibliography.replace(/\n/g, '<br/>')}</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });
  
  saveAs(blob, `${data.topic.replace(/\s+/g, '_').substring(0, 30)}_assignment.doc`);
};