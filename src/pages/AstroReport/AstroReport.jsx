import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CustomHeader from '../../components/common/CustomHeader';
import CustomLabel from '../../components/common/CustomLabel';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';

// SVGs styled with plain hex colors to prevent oklch parsing errors
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 14.5H3.5C2.39543 14.5 1.5 13.6046 1.5 12.5V4.5C1.5 3.39543 2.39543 2.5 3.5 2.5H12.5C13.6046 2.5 14.5 3.39543 14.5 4.5V12.5C14.5 13.6046 13.6046 14.5 12.5 14.5Z" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 1.5V3.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 1.5V3.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.5 5.5H14.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M7.06667 6.33533L9.66067 8.92933L9.09533 9.49533L6.26667 6.66667V2.66667H7.06667V6.33533ZM6.66667 13.3333C2.98467 13.3333 0 10.3487 0 6.66667C0 2.98467 2.98467 0 6.66667 0C10.3487 0 13.3333 2.98467 13.3333 6.66667C13.3333 10.3487 10.3487 13.3333 6.66667 13.3333ZM6.66667 12.5333C8.2226 12.5333 9.71481 11.9152 10.815 10.815C11.9152 9.71481 12.5333 8.2226 12.5333 6.66667C12.5333 5.11073 11.9152 3.61852 10.815 2.51831C9.71481 1.41809 8.2226 0.8 6.66667 0.8C5.11073 0.8 3.61852 1.41809 2.51831 2.51831C1.41809 3.61852 0.8 5.11073 0.8 6.66667C0.8 8.2226 1.41809 9.71481 2.51831 10.815C3.61852 11.9152 5.11073 12.5333 6.66667 12.5333Z" fill="#2A0B07" />
  </svg>
);

const PrintIcon = () => (
  <svg style={{ width: '20px', height: '20px', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

const ShareIcon = () => (
  <svg style={{ width: '20px', height: '20px', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 10.748a3.001 3.001 0 100 2.504m0-2.504a3 3 0 110-2.504m0 2.504l6.732-3.366m-6.732 3.366l6.732 3.366m-6.732-3.366a3 3 0 110 2.504" />
  </svg>
);

const DocumentIcon = () => (
  <svg style={{ width: '16px', height: '16px', marginRight: '8px', flexShrink: 0 }} fill="none" stroke="#8B6E4E" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const StarIcon = () => (
  <svg style={{ width: '20px', height: '20px', flexShrink: 0 }} fill="#FFC227" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function AstroReport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.auth?.user);
  const astrologerName = user?.name || 'Acharya Pandit JI';

  // Read query params for potential prefill
  const clientParam = searchParams.get('client') || '';
  const typeParam = searchParams.get('type') || '';
  const dobParam = searchParams.get('dob') || '';
  const tobParam = searchParams.get('tob') || '';
  const pobParam = searchParams.get('pob') || '';

  // Form states
  const [clientName, setClientName] = useState(clientParam);
  const [dob, setDob] = useState(dobParam);
  const [tob, setTob] = useState(tobParam);
  const [pob, setPob] = useState(pobParam);
  const [consultationType, setConsultationType] = useState(typeParam || 'General Consultation');
  
  const [observations, setObservations] = useState('');
  const [predictions, setPredictions] = useState('');
  const [remedies, setRemedies] = useState('');
  const [notes, setNotes] = useState('');

  // Location suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  // Active view for mobile (Form vs Preview)
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`);
      const results = await res.json();
      setSuggestions(results);
    } catch (e) {
      console.error('Failed to fetch location suggestions', e);
    }
  };

  const handlePobChange = (val) => {
    setPob(val);
    setShowSuggestions(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 500);
  };

  // Formats date to user-friendly form
  const formatDateFriendly = (d) => {
    if (!d) return '';
    try {
      const date = new Date(d);
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (_) {
      return d;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getPatchedCanvas = async (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) throw new Error(`Element #${elementId} not found`);

    return await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FAF6F0',
      logging: false,
      onclone: (clonedDoc) => {
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach(el => {
          try {
            const computed = window.getComputedStyle(el);
            const colorProps = [
              'color', 'backgroundColor', 'borderColor', 
              'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
              'boxShadow', 'textShadow', 'outlineColor'
            ];

            colorProps.forEach(prop => {
              const val = computed[prop];
              if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab'))) {
                let fallback = 'rgb(42, 11, 7)';
                if (prop.toLowerCase().includes('background')) {
                  fallback = 'rgb(250, 246, 240)';
                } else if (prop.toLowerCase().includes('shadow')) {
                  fallback = 'rgba(0, 0, 0, 0.05)';
                }
                el.style[prop] = fallback;
              }
            });
          } catch (e) {
            console.error('Error patching style for element', el, e);
          }
        });
      }
    });
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      // Target the offscreen element which is ALWAYS laid out correctly and has width of 800px
      const canvas = await getPatchedCanvas('offscreen-report-content');

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`${(clientName || 'Astro').replace(/\s+/g, '_')}_Report.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again or use the print option.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    let pdfInstance = null;
    let fallbackFileName = '';
    try {
      setIsSharing(true);
      // Target the offscreen element which is ALWAYS laid out correctly and has width of 800px
      const canvas = await getPatchedCanvas('offscreen-report-content');

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2);
      
      const pdfBlob = pdf.output('blob');
      const fileName = `${(clientName || 'Astro').replace(/\s+/g, '_')}_Report.pdf`;
      
      // Store references in outer scope in case navigator.share fails and we need to fall back
      pdfInstance = pdf;
      fallbackFileName = fileName;

      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Astrological Consultation Report',
            text: `Astro Report for ${clientName || 'Client'}`,
          });
        } catch (shareError) {
          // If the user cancelled/aborted, do not alert or show an error
          if (shareError.name === 'AbortError') {
            console.log('User cancelled the share dialog.');
            return;
          }
          // For security/gesture errors (like NotAllowedError) or other sharing failures, download as fallback
          console.error('navigator.share failed:', shareError);
          pdf.save(fileName);
          alert('Web sharing failed or is not supported in this browser. The PDF has been downloaded instead.');
        }
      } else {
        // Fallback to direct download
        pdf.save(fileName);
        alert('Web sharing is not supported in this browser. The PDF has been downloaded instead.');
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      // If we already generated the PDF, try to save it as fallback
      if (pdfInstance && fallbackFileName) {
        try {
          pdfInstance.save(fallbackFileName);
          alert('Failed to share PDF. The PDF has been downloaded instead.');
        } catch (downloadError) {
          console.error('Fallback download failed:', downloadError);
          alert('Failed to share or download PDF. Please try again.');
        }
      } else {
        alert('Failed to generate PDF. Please try downloading it instead.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6 font-['Poppins']">
      
      {/* Stylesheet specifically to handle print formatting & clean standard CSS class styles to bypass oklch */}
      <style>{`
        /* Standard Preview styles written in vanilla CSS to completely avoid oklab/oklch functions from Tailwind v4 */
        .report-preview-box {
          background-color: #FAF6F0 !important;
          border: 2px solid #EADFCB !important;
          border-radius: 16px !important;
          padding: 32px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 24px !important;
          color: #2A0B07 !important;
          position: relative !important;
          overflow: hidden !important;
          font-family: 'Inter', sans-serif !important;
          box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.04) !important;
          box-sizing: border-box !important;
        }
        .report-preview-header {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          border-bottom: 1px solid #EADFCB !important;
          padding-bottom: 24px !important;
          gap: 8px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        .report-preview-title {
          font-family: 'Sofia Sans', sans-serif !important;
          font-weight: 700 !important;
          font-size: 28px !important;
          letter-spacing: 0.05em !important;
          color: #2A0B07 !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        .report-preview-subtitle {
          font-size: 12px !important;
          text-transform: uppercase !important;
          font-weight: 600 !important;
          color: #8B6E4E !important;
          letter-spacing: 0.2em !important;
        }
        .report-preview-meta-box {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 12px 24px !important;
          background-color: #F3EBE0 !important;
          padding: 16px !important;
          border-radius: 12px !important;
          border: 1px solid #E4D5BE !important;
          font-size: 13px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        .report-preview-meta-item-label {
          font-weight: 600 !important;
          color: #8B6E4E !important;
        }
        .report-preview-meta-item-value {
          font-weight: 500 !important;
          color: #2A0B07 !important;
          margin-top: 2px !important;
          margin-bottom: 0 !important;
        }
        .report-preview-section {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        .report-preview-section-header {
          display: flex !important;
          align-items: center !important;
          border-bottom: 1px solid rgba(234, 223, 203, 0.6) !important;
          padding-bottom: 6px !important;
        }
        .report-preview-section-title {
          font-family: 'Sofia Sans', sans-serif !important;
          font-weight: 700 !important;
          font-size: 16px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: #8B6E4E !important;
        }
        .report-preview-section-body {
          font-size: 14px !important;
          line-height: 1.6 !important;
          color: #4A3B32 !important;
          white-space: pre-wrap !important;
          min-height: 40px !important;
          margin-top: 4px !important;
          margin-bottom: 0 !important;
        }
        .report-preview-footer {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-end !important;
          border-top: 1px solid #EADFCB !important;
          padding-top: 24px !important;
          margin-top: 24px !important;
          font-size: 12px !important;
          color: #8B6E4E !important;
          font-weight: 500 !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        .report-preview-footer-bold {
          font-weight: 700 !important;
          color: #2A0B07 !important;
          font-size: 13px !important;
          margin-top: 2px !important;
          margin-bottom: 0 !important;
        }

        @media print {
          /* Hide main app containers and buttons */
          body, html {
            background: #FFFFFF !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #root, header, footer, nav, .no-print, button, .no-print-wrapper {
            display: none !important;
          }
          
          /* Show and format the print container */
          #print-report-container {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 20mm !important;
            box-shadow: none !important;
            border: none !important;
            background: #FFFFFF !important;
            color: #000000 !important;
          }

          /* Force backgrounds in printing */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Page break styling */
          .page-break {
            page-break-before: always;
          }
        }
      `}</style>

      <div className="no-print-wrapper w-full max-w-[1200px] min-h-screen md:min-h-0 bg-[#FDFBF7] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative box-border overflow-y-auto pb-10">
        
        {/* Page Header */}
        <CustomHeader
          title="Astro Report Generator"
          subtitle="Generate, download, and share detailed PDFs"
          onBack={() => navigate('/tools')}
        />

        {/* Mobile View Switcher Tabs */}
        <div className="md:hidden flex border-b border-[#EFE5D5] w-full bg-[#FCFAF5]">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-3.5 text-center text-[14px] font-bold transition-all ${
              activeTab === 'edit'
                ? 'text-[#2A0B07] border-b-2 border-[#2A0B07] bg-[#FAF5EC]'
                : 'text-[#8A8A8A]'
            }`}
          >
            Edit Report
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-3.5 text-center text-[14px] font-bold transition-all ${
              activeTab === 'preview'
                ? 'text-[#2A0B07] border-b-2 border-[#2A0B07] bg-[#FAF5EC]'
                : 'text-[#8A8A8A]'
            }`}
          >
            Live Preview
          </button>
        </div>

        {/* Main Workspace Layout */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-8 px-5 md:px-8 mt-6 w-full box-border">
          
          {/* LEFT COLUMN: EDITOR FORM */}
          <div className={`md:col-span-5 flex flex-col gap-5 ${activeTab === 'edit' ? 'block' : 'hidden md:block'}`}>
            <h3 className="font-['Sofia_Sans'] font-bold text-[20px] text-[#2A0B07] border-b border-[#EFE5D5] pb-2">
              Report Details
            </h3>

            <div className="flex flex-col gap-4 w-full">
              {/* Client Info */}
              <div className="flex flex-col items-start gap-2.5 w-full">
                <CustomLabel title="Client Name" />
                <CustomInput
                  type="text"
                  name="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Sunita Kapoor"
                />
              </div>

              {/* DOB & TOB */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col items-start gap-2.5 w-full">
                  <CustomLabel title="Date Of Birth" />
                  <CustomInput
                    type="date"
                    name="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    icon={<CalendarIcon />}
                  />
                </div>

                <div className="flex flex-col items-start gap-2.5 w-full">
                  <CustomLabel title="Time Of Birth" />
                  <CustomInput
                    type="time"
                    name="tob"
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    icon={<ClockIcon />}
                  />
                </div>
              </div>

              {/* Place Of Birth */}
              <div className="flex flex-col items-start gap-2.5 w-full relative" ref={dropdownRef}>
                <CustomLabel title="Place Of Birth" />
                <div className="relative w-full">
                  <CustomInput
                    type="text"
                    name="pob"
                    value={pob}
                    onChange={(e) => handlePobChange(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="New Delhi, India"
                    autoComplete="off"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-[56px] left-0 w-full bg-white border border-[#EFE5D5] rounded-xl shadow-lg z-50 overflow-hidden max-h-[180px] overflow-y-auto">
                      {suggestions.map((s, i) => (
                        <div
                          key={i}
                          className="px-4 py-3 hover:bg-[#FDFBF7] cursor-pointer text-[14px] text-[#2A0B07] border-b border-[#EFE5D5] last:border-0"
                          onClick={() => {
                            setPob(s.display_name);
                            setShowSuggestions(false);
                          }}
                        >
                          {s.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col items-start gap-2.5 w-full">
                <CustomLabel title="Consultation Category" />
                <select
                  value={consultationType}
                  onChange={(e) => setConsultationType(e.target.value)}
                  className="w-full h-[52px] bg-[#F5ECE3] rounded-[15px] outline-none text-[#2A0B07] text-[14px] border-none px-4 font-['Poppins'] appearance-none cursor-pointer"
                >
                  <option value="General Consultation">General Consultation</option>
                  <option value="Kundli Analysis">Kundli Analysis</option>
                  <option value="Muhurtha & Timing">Muhurtha & Timing</option>
                  <option value="Gemstone Advice">Gemstone Advice</option>
                  <option value="Vastu Advisory">Vastu Advisory</option>
                  <option value="Remedies & Pujas">Remedies & Pujas</option>
                  <option value="Career & Wealth">Career & Wealth</option>
                  <option value="Relationship & Marriage">Relationship & Marriage</option>
                </select>
              </div>

              {/* Observations */}
              <div className="flex flex-col items-start gap-2.5 w-full font-['Poppins']">
                <CustomLabel title="Observations" />
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Enter your observations (e.g., planetary positions, Ascendant details, Dasha trends...)"
                  className="w-full min-h-[100px] p-4 bg-[#F5ECE3] rounded-[15px] outline-none text-[#2A0B07] text-[14px] border-none placeholder:text-[#2A0B07]/50 resize-y"
                />
              </div>

              {/* Predictions */}
              <div className="flex flex-col items-start gap-2.5 w-full font-['Poppins']">
                <CustomLabel title="Predictions & Guidance" />
                <textarea
                  value={predictions}
                  onChange={(e) => setPredictions(e.target.value)}
                  placeholder="Draft predictions for career, relationships, or health..."
                  className="w-full min-h-[100px] p-4 bg-[#F5ECE3] rounded-[15px] outline-none text-[#2A0B07] text-[14px] border-none placeholder:text-[#2A0B07]/50 resize-y"
                />
              </div>

              {/* Remedies */}
              <div className="flex flex-col items-start gap-2.5 w-full font-['Poppins']">
                <CustomLabel title="Recommended Remedies" />
                <textarea
                  value={remedies}
                  onChange={(e) => setRemedies(e.target.value)}
                  placeholder="Suggest mantras, gemstone suggestions, fasting advice, or donations..."
                  className="w-full min-h-[100px] p-4 bg-[#F5ECE3] rounded-[15px] outline-none text-[#2A0B07] text-[14px] border-none placeholder:text-[#2A0B07]/50 resize-y"
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col items-start gap-2.5 w-full font-['Poppins']">
                <CustomLabel title="Consultation Notes & Feedback" />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any final notes or follow-up timelines..."
                  className="w-full min-h-[100px] p-4 bg-[#F5ECE3] rounded-[15px] outline-none text-[#2A0B07] text-[14px] border-none placeholder:text-[#2A0B07]/50 resize-y"
                />
              </div>

              {/* Action Buttons for mobile */}
              <div className="md:hidden mt-4 flex flex-col gap-3">
                <CustomButton 
                  onClick={handleDownload} 
                  variant="primary" 
                  loading={isDownloading} 
                  icon={<PrintIcon />}
                >
                  Download Report PDF
                </CustomButton>

                <CustomButton 
                  onClick={handleShare} 
                  variant="secondary" 
                  loading={isSharing} 
                  icon={<ShareIcon />}
                >
                  Share Report
                </CustomButton>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: REPORT PREVIEW PANEL */}
          <div className={`md:col-span-7 flex flex-col gap-5 ${activeTab === 'preview' ? 'block' : 'hidden md:block'}`}>
            <div className="flex justify-between items-center border-b border-[#EFE5D5] pb-2">
              <h3 className="font-['Sofia_Sans'] font-bold text-[20px] text-[#2A0B07]">
                Live Report Preview
              </h3>
              
              <div className="hidden md:flex gap-2">
                <button
                  onClick={handleShare}
                  disabled={isSharing || isDownloading}
                  className="flex flex-row items-center justify-center px-4 py-2 bg-[#FF7B6B] hover:bg-[#E05E4E] text-[#ECECEC] text-[13px] font-bold rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSharing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sharing...
                    </>
                  ) : (
                    <>
                      <ShareIcon /> Share
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading || isSharing}
                  className="flex flex-row items-center justify-center px-4 py-2 bg-[#2A0B07] hover:bg-[#431610] text-[#ECECEC] text-[13px] font-bold rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <PrintIcon /> Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Parchment Styled Report Container - Using custom CSS classes to bypass Tailwind v4 oklch */}
            <div id="preview-report-content" className="report-preview-box">
              
              {/* Gold Filigree Ornament Header */}
              <div className="report-preview-header">
                <div className="report-preview-title">
                  <StarIcon />
                  <span>ZODIMITHRA</span>
                  <StarIcon />
                </div>
                <div className="report-preview-subtitle">
                  Astrological Consultation Report
                </div>
              </div>

              {/* Document Info Metadata Box */}
              <div className="report-preview-meta-box">
                <div>
                  <span className="report-preview-meta-item-label">Client Name:</span>
                  <p className="report-preview-meta-item-value">{clientName || '—'}</p>
                </div>
                <div>
                  <span className="report-preview-meta-item-label">Consultation:</span>
                  <p className="report-preview-meta-item-value">{consultationType}</p>
                </div>
                <div>
                  <span className="report-preview-meta-item-label">Date of Birth:</span>
                  <p className="report-preview-meta-item-value">
                    {formatDateFriendly(dob)} {tob ? `at ${tob}` : ''}
                  </p>
                </div>
                <div>
                  <span className="report-preview-meta-item-label">Place of Birth:</span>
                  <p className="report-preview-meta-item-value" title={pob} style={{ wordBreak: 'break-word' }}>
                    {pob || '—'}
                  </p>
                </div>
              </div>

              {/* Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
                
                {/* Observations */}
                <div className="report-preview-section">
                  <div className="report-preview-section-header">
                    <DocumentIcon />
                    <span className="report-preview-section-title">
                      Planetary Observations
                    </span>
                  </div>
                  <p className="report-preview-section-body">
                    {observations || 'Add observations in the editor...'}
                  </p>
                </div>

                {/* Predictions */}
                <div className="report-preview-section">
                  <div className="report-preview-section-header">
                    <DocumentIcon />
                    <span className="report-preview-section-title">
                      Predictions & Forecasts
                    </span>
                  </div>
                  <p className="report-preview-section-body">
                    {predictions || 'Add predictions in the editor...'}
                  </p>
                </div>

                {/* Remedies */}
                <div className="report-preview-section">
                  <div className="report-preview-section-header">
                    <DocumentIcon />
                    <span className="report-preview-section-title">
                      Prescribed Remedies
                    </span>
                  </div>
                  <p className="report-preview-section-body">
                    {remedies || 'Add remedies in the editor...'}
                  </p>
                </div>

                {/* Notes */}
                <div className="report-preview-section">
                  <div className="report-preview-section-header">
                    <DocumentIcon />
                    <span className="report-preview-section-title">
                      Consultation Notes
                    </span>
                  </div>
                  <p className="report-preview-section-body">
                    {notes || 'Add final notes in the editor...'}
                  </p>
                </div>

              </div>

              {/* Signature Footer */}
              <div className="report-preview-footer">
                <div>
                  <span>Issued By:</span>
                  <p className="report-preview-footer-bold">{astrologerName}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span>Report Date:</span>
                  <p className="report-preview-footer-bold">
                    {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* HIDDEN IN WEB VIEW - ACCESSIBLE ONLY BY WINDOW.PRINT() */}
      <div id="print-report-container" className="hidden">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#000000', fontFamily: 'serif' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '2px solid #000000', paddingBottom: '15px', gap: '5px' }}>
            <h1 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold', letterSpacing: '2px' }}>ZODIMITHRA</h1>
            <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 'bold' }}>
              Astrological Consultation Report
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', border: '1px solid #000000', padding: '15px', borderRadius: '4px', fontSize: '14px' }}>
            <div><strong>Client Name:</strong> {clientName || '—'}</div>
            <div><strong>Consultation Category:</strong> {consultationType}</div>
            <div><strong>Date of Birth:</strong> {formatDateFriendly(dob)} {tob ? `at ${tob}` : ''}</div>
            <div><strong>Place of Birth:</strong> {pob || '—'}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
            {observations && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <h3 style={{ fontSize: '18px', borderBottom: '1px solid #000000', margin: 0, paddingBottom: '3px', textTransform: 'uppercase' }}>Planetary Observations</h3>
                <p style={{ fontSize: '14px', margin: '5px 0 0 0', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{observations}</p>
              </div>
            )}

            {predictions && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <h3 style={{ fontSize: '18px', borderBottom: '1px solid #000000', margin: 0, paddingBottom: '3px', textTransform: 'uppercase' }}>Predictions & Forecasts</h3>
                <p style={{ fontSize: '14px', margin: '5px 0 0 0', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{predictions}</p>
              </div>
            )}

            {remedies && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <h3 style={{ fontSize: '18px', borderBottom: '1px solid #000000', margin: 0, paddingBottom: '3px', textTransform: 'uppercase' }}>Prescribed Remedies</h3>
                <p style={{ fontSize: '14px', margin: '5px 0 0 0', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{remedies}</p>
              </div>
            )}

            {notes && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <h3 style={{ fontSize: '18px', borderBottom: '1px solid #000000', margin: 0, paddingBottom: '3px', textTransform: 'uppercase' }}>Consultation Notes</h3>
                <p style={{ fontSize: '14px', margin: '5px 0 0 0', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{notes}</p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #000000', paddingTop: '20px', marginTop: '40px', fontSize: '13px' }}>
            <div style={{ flex: 1 }}>
              <span>Issued By:</span>
              <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '14px' }}>{astrologerName}</p>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <span>Report Date:</span>
              <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '14px' }}>
                {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* OFF-SCREEN HIGH-FIDELITY TEMPLATE CONTAINER (ALWAYS LAID OUT & NEVER HIDDEN WITH DISPLAY: NONE) */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0', width: '800px', zIndex: -100, pointerEvents: 'none' }}>
        <div id="offscreen-report-content" className="report-preview-box" style={{ width: '800px' }}>
          
          {/* Gold Filigree Ornament Header */}
          <div className="report-preview-header">
            <div className="report-preview-title">
              <StarIcon />
              <span>ZODIMITHRA</span>
              <StarIcon />
            </div>
            <div className="report-preview-subtitle">
              Astrological Consultation Report
            </div>
          </div>

          {/* Document Info Metadata Box */}
          <div className="report-preview-meta-box">
            <div>
              <span className="report-preview-meta-item-label">Client Name:</span>
              <p className="report-preview-meta-item-value">{clientName || '—'}</p>
            </div>
            <div>
              <span className="report-preview-meta-item-label">Consultation:</span>
              <p className="report-preview-meta-item-value">{consultationType}</p>
            </div>
            <div>
              <span className="report-preview-meta-item-label">Date of Birth:</span>
              <p className="report-preview-meta-item-value">
                {formatDateFriendly(dob)} {tob ? `at ${tob}` : ''}
              </p>
            </div>
            <div>
              <span className="report-preview-meta-item-label">Place of Birth:</span>
              <p className="report-preview-meta-item-value" title={pob} style={{ wordBreak: 'break-word' }}>
                {pob || '—'}
              </p>
            </div>
          </div>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
            
            {/* Observations */}
            <div className="report-preview-section">
              <div className="report-preview-section-header">
                <DocumentIcon />
                <span className="report-preview-section-title">
                  Planetary Observations
                </span>
              </div>
              <p className="report-preview-section-body">
                {observations || 'Add observations in the editor...'}
              </p>
            </div>

            {/* Predictions */}
            <div className="report-preview-section">
              <div className="report-preview-section-header">
                <DocumentIcon />
                <span className="report-preview-section-title">
                  Predictions & Forecasts
                </span>
              </div>
              <p className="report-preview-section-body">
                {predictions || 'Add predictions in the editor...'}
              </p>
            </div>

            {/* Remedies */}
            <div className="report-preview-section">
              <div className="report-preview-section-header">
                <DocumentIcon />
                <span className="report-preview-section-title">
                  Prescribed Remedies
                </span>
              </div>
              <p className="report-preview-section-body">
                {remedies || 'Add remedies in the editor...'}
              </p>
            </div>

            {/* Notes */}
            <div className="report-preview-section">
              <div className="report-preview-section-header">
                <DocumentIcon />
                <span className="report-preview-section-title">
                  Consultation Notes
                </span>
              </div>
              <p className="report-preview-section-body">
                {notes || 'Add final notes in the editor...'}
              </p>
            </div>

          </div>

          {/* Signature Footer */}
          <div className="report-preview-footer">
            <div>
              <span>Issued By:</span>
              <p className="report-preview-footer-bold">{astrologerName}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span>Report Date:</span>
              <p className="report-preview-footer-bold">
                {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
