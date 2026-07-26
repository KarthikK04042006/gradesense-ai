import { useState, useEffect, useRef } from 'react';

export interface VoiceCommandHandlers {
  onQuery?: (query: string) => void;
  onStartGradeChange?: () => void;
  onApplyAiOptimization?: () => void;
  onShowHistoricalCases?: () => void;
}

export const useVoiceAI = (handlers?: VoiceCommandHandlers) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        // Check for final result
        if (event.results[0].isFinal) {
          handleVoiceCommand(currentTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }
  }, []);

  const handleVoiceCommand = (text: string) => {
    const lower = text.toLowerCase();

    if (lower.includes('apply ai') || lower.includes('apply recommendation') || lower.includes('apply optimization')) {
      handlers?.onApplyAiOptimization?.();
      speak('Applying AI optimization setpoints to Honeywell Experion actuators.');
      return;
    }

    if (lower.includes('start grade change') || lower.includes('start simulation') || lower.includes('begin grade change')) {
      handlers?.onStartGradeChange?.();
      speak('Initiating 25-second grade change simulation.');
      return;
    }

    if (lower.includes('show historical') || lower.includes('similar cases') || lower.includes('similar transitions')) {
      handlers?.onShowHistoricalCases?.();
      speak('Displaying similar historical grade transition benchmark runs.');
      return;
    }

    // Default: pass query to Copilot chat
    if (handlers?.onQuery && text) {
      handlers.onQuery(text);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Recognition stop error:', err);
      }
    }
  };

  const speak = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any active speech
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return {
    isListening,
    transcript,
    isSupported,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  };
};
