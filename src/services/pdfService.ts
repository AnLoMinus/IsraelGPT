import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export const generateChatPDF = async (sourceElement: HTMLElement, filename: string) => {
  try {
    // 1. Clone the element to avoid messing with the UI
    const clone = sourceElement.cloneNode(true) as HTMLElement;
    
    // 2. Style the clone to be full height and printer-friendly
    // We set a fixed width to ensure consistent scaling on A4
    clone.style.width = '794px'; // A4 width in pixels at 96 DPI (approx)
    clone.style.height = 'auto';
    clone.style.maxHeight = 'none';
    clone.style.overflow = 'visible';
    clone.style.position = 'absolute';
    clone.style.top = '-10000px';
    clone.style.left = '-10000px';
    clone.style.zIndex = '-1000';
    
    // Ensure background is set (in case it's transparent)
    // We check if the source has dark mode class to decide background
    const isDark = document.documentElement.classList.contains('dark');
    clone.style.backgroundColor = isDark ? '#0f172a' : '#ffffff';
    clone.style.color = isDark ? '#ffffff' : '#000000';
    
    document.body.appendChild(clone);

    // 3. Capture
    // We use a slight delay to ensure any layout shifts in the clone are settled
    await new Promise(resolve => setTimeout(resolve, 100));

    const dataUrl = await toPng(clone, {
      quality: 0.95,
      pixelRatio: 2, // High resolution for print
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
    });

    document.body.removeChild(clone);

    // 4. Generate PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgProps = pdf.getImageProperties(dataUrl);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Subsequent pages
    while (heightLeft > 0) {
      position -= pdfHeight; // Move the image up to show the next section
      pdf.addPage();
      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('PDF Generation failed:', error);
    throw error;
  }
};
