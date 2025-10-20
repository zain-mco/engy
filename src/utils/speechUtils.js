export const speakWord = (text) => {
  if (!text) return;
  
  // Cancel any ongoing speech
  speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  
  // Wait for voices to load
  const setVoice = () => {
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => 
      v.lang === "en-US" && v.name.toLowerCase().includes("female")
    );
    
    // Fallback to any US English voice
    const usVoice = voices.find(v => v.lang === "en-US");
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    } else if (usVoice) {
      utterance.voice = usVoice;
    }
    
    speechSynthesis.speak(utterance);
  };
  
  // Check if voices are loaded
  if (speechSynthesis.getVoices().length > 0) {
    setVoice();
  } else {
    speechSynthesis.onvoiceschanged = setVoice;
  }
};
