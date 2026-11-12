import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, ArrowRight, Volume2, AlertCircle } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceSearchSubmit: (transcript: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onVoiceSearchSubmit,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setTranscript('');
      setErrorMsg(null);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
      setErrorMsg('Web Speech API is not natively supported in this browser. You can type or test a preset voice query below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-SG';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setErrorMsg(`Voice capture notice: ${event.error}. You can still use the prompt presets or keyboard.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not initialize microphone access.');
      setIsListening(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setErrorMsg(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleApply = (text: string) => {
    if (!text.trim()) return;
    onVoiceSearchSubmit(text.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">Voice Product Search</h3>
              <p className="text-xs text-stone-500">Speak any luxury item, brand, or model</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-6">
          {/* Animated Pulsing Mic Circle */}
          <div className="relative flex items-center justify-center my-4">
            {isListening && (
              <>
                <div className="absolute w-28 h-28 rounded-full bg-amber-400/20 animate-ping" />
                <div className="absolute w-20 h-20 rounded-full bg-amber-500/30 animate-pulse" />
              </>
            )}
            <button
              onClick={toggleListening}
              className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ${
                isListening
                  ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                  : 'bg-stone-950 text-white hover:bg-stone-800'
              }`}
            >
              {isListening ? <Mic className="w-7 h-7" /> : <MicOff className="w-7 h-7" />}
            </button>
          </div>

          <div>
            <div className="text-xs font-mono font-medium text-amber-700 uppercase tracking-wider">
              {isListening ? 'Listening in Singapore (en-SG)...' : 'Tap to speak'}
            </div>
            <p className="text-stone-500 text-xs mt-1">
              "Find me prices for Tissot PRX blue dial" or "Sony noise cancelling headphones"
            </p>
          </div>

          {/* Transcript Box */}
          <div className="min-h-16 p-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm font-medium flex items-center justify-center">
            {transcript ? (
              <span className="text-stone-950 font-semibold text-base">"{transcript}"</span>
            ) : (
              <span className="text-stone-400 italic text-xs">
                {isListening ? 'Speak now...' : 'Transcript will appear here'}
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-600 flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Simulated Voice Prompts */}
          <div className="text-left">
            <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Or Click A Voice Query Sample:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Sony WH-1000XM5 headphones',
                'Le Labo Santal 33 perfume',
                'Tissot PRX Powermatic',
                'Logitech MX Master 3S',
                'Comvita Manuka Honey',
              ].map(sample => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => {
                    setTranscript(sample);
                    handleApply(sample);
                  }}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-lg transition-colors cursor-pointer"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>

          {/* Action */}
          <button
            type="button"
            disabled={!transcript}
            onClick={() => handleApply(transcript)}
            className="w-full py-2.5 bg-stone-950 hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Search BASKT Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
