import { useState } from "react";
import { SlArrowDown } from "react-icons/sl";

const LanguageSelect = () => {
  const [selectedLang, setSelectedLang] = useState("en");

  const showGoogleTranslateElement = (show) => {
    const element = document.getElementById("google_translate_element");
    if (element) {
      element.style.display = show ? "none" : "none";
    }
  };

  const handleChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);

    // Toggle visibility of Google Translate element
    showGoogleTranslateElement(true);

    // Hide it again after 2 seconds
    setTimeout(() => showGoogleTranslateElement(false), 2000);
  };

  return (
    <div style={{ }}>
      <label className="block text-sm font-medium text-darkGray mb-1">
        Language
      </label>
 <div className="relative w-full">
      <select
        value={selectedLang}
        onChange={handleChange}
        className="w-full appearance-none px-6 py-2 border text-brandGray rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBB040] pr-10"
      >
        <option value="en">English (Default)</option>
        <option value="es">Español</option>
        <option value="ar">العربية</option>
        <option value="pt">Português</option>
        <option value="pr">French</option>
      </select>

      {/* Down arrow icon */}
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-brandGray">
        <SlArrowDown className="text-sm" />
      </div>
    </div>
    </div>
  );
};

export default LanguageSelect;
