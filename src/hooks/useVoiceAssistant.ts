import { useState, useEffect, useRef, useCallback } from 'react';

export interface ChatTurn {
  id: string;
  sender: 'user' | 'guide';
  text: string;
  timestamp: number;
}

interface WalkStateContext {
  isWalking: boolean;
  durationMinutes: number;
  missionTitle: string;
}

export function useVoiceAssistant(walkContext?: WalkStateContext) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isHandsFree, setIsHandsFree] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [history, setHistory] = useState<ChatTurn[]>([
    {
      id: 'welcome',
      sender: 'guide',
      text: "Hello. I'm NatureHeal. When you're ready, let's step away from your screens and into the fresh air.",
      timestamp: Date.now(),
    },
  ]);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [micError, setMicError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isHandsFreeRef = useRef(isHandsFree);
  const isSpeakingRef = useRef(isSpeaking);
  const historyRef = useRef(history);
  const walkContextRef = useRef(walkContext);

  useEffect(() => {
    isHandsFreeRef.current = isHandsFree;
  }, [isHandsFree]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    walkContextRef.current = walkContext;
  }, [walkContext]);

  // Voice playback with SpeechSynthesis
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.93; // Unhurried, grounded cadence
      utterance.pitch = 0.95; // Calm, warm pitch

      const voices = window.speechSynthesis.getVoices();
      // Look for a calm, natural English voice
      const preferredVoice = voices.find(
        (v) =>
          (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Serena') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Ava') || v.name.includes('Daniel')))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        // Pause listening while speaking to prevent self-echo
        if (recognitionRef.current && isListening) {
          try {
            recognitionRef.current.stop();
          } catch {}
        }
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
        // If in hands-free mode, restart speech recognition automatically
        if (isHandsFreeRef.current) {
          setTimeout(() => {
            startListeningInternal();
          }, 350);
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
        if (isHandsFreeRef.current) {
          setTimeout(() => {
            startListeningInternal();
          }, 350);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
      if (onEnd) onEnd();
    }
  }, [isListening]);

  // Send message to Gemini server API
  const sendUserMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim()) return;

      const userTurn: ChatTurn = {
        id: `u-${Date.now()}`,
        sender: 'user',
        text: messageText.trim(),
        timestamp: Date.now(),
      };

      setHistory((prev) => [...prev, userTurn]);
      setTranscript('');
      setInterimTranscript('');

      try {
        const res = await fetch('/api/guide/converse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userMessage: messageText,
            walkState: walkContextRef.current,
            history: historyRef.current,
          }),
        });

        if (!res.ok) {
          throw new Error('Server response failed');
        }

        const data = await res.json();
        const replyText = data.reply || "Take a gentle breath and feel the earth beneath your steps.";

        const guideTurn: ChatTurn = {
          id: `g-${Date.now()}`,
          sender: 'guide',
          text: replyText,
          timestamp: Date.now(),
        };

        setHistory((prev) => [...prev, guideTurn]);
        speak(replyText);
      } catch (err) {
        console.error('Error contacting nature guide:', err);
        const fallbackText = "Step outside for just five minutes. Look up at the open sky and feel the breeze.";
        const guideTurn: ChatTurn = {
          id: `g-${Date.now()}`,
          sender: 'guide',
          text: fallbackText,
          timestamp: Date.now(),
        };
        setHistory((prev) => [...prev, guideTurn]);
        speak(fallbackText);
      }
    },
    [speak]
  );

  // Setup Web Speech Recognition
  const startListeningInternal = useCallback(() => {
    if (isSpeakingRef.current) return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSpeechSupported(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setMicError(null);
      };

      rec.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          setTranscript(final);
          setInterimTranscript('');
          sendUserMessage(final);
        }
      };

      rec.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setMicError('Microphone permission needed for hands-free voice.');
          setIsListening(false);
          setIsHandsFree(false);
        } else if (event.error === 'no-speech') {
          // If no speech detected in hands-free mode, restart gently
          if (isHandsFreeRef.current && !isSpeakingRef.current) {
            setTimeout(() => {
              if (isHandsFreeRef.current) startListeningInternal();
            }, 600);
          } else {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      rec.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        // If hands-free and not speaking, restart listening
        if (isHandsFreeRef.current && !isSpeakingRef.current) {
          setTimeout(() => {
            if (isHandsFreeRef.current) startListeningInternal();
          }, 400);
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.warn('Error starting speech recognition:', e);
      setIsListening(false);
    }
  }, [sendUserMessage]);

  const startListening = useCallback(() => {
    startListeningInternal();
  }, [startListeningInternal]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  }, []);

  const toggleHandsFree = useCallback(() => {
    setIsHandsFree((prev) => {
      const next = !prev;
      if (next) {
        startListeningInternal();
      } else {
        stopListening();
      }
      return next;
    });
  }, [startListeningInternal, stopListening]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isListening,
    isSpeaking,
    isHandsFree,
    transcript,
    interimTranscript,
    history,
    speechSupported,
    micError,
    startListening,
    stopListening,
    toggleHandsFree,
    speak,
    stopSpeaking,
    sendUserMessage,
  };
}
