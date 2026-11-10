import html2pdf from 'html2pdf.js';

/**
 * Direct client-side PDF export for Bangladeshi CV
 * Downloads a crisp A4 vector-like PDF directly to user's phone or computer
 */
export const downloadCVAsPDF = async (elementId: string, candidateName: string): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    // Fallback to native print if element not found
    window.focus();
    window.print();
    return false;
  }

  const safeFileName = `${(candidateName || 'Bangladeshi_CV').trim().replace(/\s+/g, '_')}_CV.pdf`;

  const opt: any = {
    margin: 0,
    filename: safeFileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollY: 0,
      windowWidth: element.scrollWidth || 794,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break',
      avoid: ['.avoid-break', 'table', 'tr', 'thead', 'tbody'],
    },
  };

  try {
    await (html2pdf() as any).set(opt).from(element).save();
    return true;
  } catch (error) {
    console.warn('html2pdf generation error, falling back to window.print():', error);
    window.focus();
    window.print();
    return false;
  }
};

/**
 * Native Print / Save as PDF trigger
 */
export const triggerNativePrint = () => {
  window.focus();
  window.print();
};
