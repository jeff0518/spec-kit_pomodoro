// A simple audio utility to handle playback using the Web Audio API.

let audioContext: AudioContext | null = null;
const soundCache: { [key: string]: AudioBuffer } = {};

export const initAudio = () => {
  if (!audioContext && (window.AudioContext || (window as any).webkitAudioContext)) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

const loadSound = async (url: string): Promise<AudioBuffer | null> => {
  if (!audioContext) {
    console.warn('AudioContext not initialized. Call initAudio() on a user gesture.');
    return null;
  }
  if (soundCache[url]) {
    return soundCache[url];
  }
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    soundCache[url] = audioBuffer;
    return audioBuffer;
  } catch (error) {
    console.error(`Failed to load sound: ${url}`, error);
    return null;
  }
};

export const playSound = async (url: string) => {
  if (!audioContext) {
    initAudio();
  }
  
  const audioBuffer = await loadSound(url);
  if (audioBuffer && audioContext && audioContext.state === 'running') {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  } else {
    console.warn(`Could not play sound: ${url}. AudioContext is not running or buffer is missing.`);
  }
};

export const preloadSounds = (urls: string[]) => {
  if (!audioContext) return;
  urls.forEach(url => loadSound(url));
};
