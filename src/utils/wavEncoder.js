/**
 * Encode des échantillons PCM Float32 (mono) en fichier WAV.
 * @param {Float32Array} samples - Données PCM, -1 à 1
 * @param {number} sampleRate - Ex: 44100
 * @returns {Blob} Blob audio/wav
 */
function encodeWav(samples, sampleRate = 44100) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  let offset = 0;

  function writeStr(str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset++, str.charCodeAt(i));
    }
  }

  writeStr('RIFF');
  view.setUint32(offset, 36 + dataSize, true);
  offset += 4;
  writeStr('WAVE');
  writeStr('fmt ');
  view.setUint32(offset, 16, true);
  offset += 4; // chunk size PCM
  view.setUint16(offset, 1, true);
  offset += 2; // audio format 1 = PCM
  view.setUint16(offset, numChannels, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, sampleRate * blockAlign, true);
  offset += 4; // byte rate
  view.setUint16(offset, blockAlign, true);
  offset += 2;
  view.setUint16(offset, bitsPerSample, true);
  offset += 2;
  writeStr('data');
  view.setUint32(offset, dataSize, true);
  offset += 4;

  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Enregistre le micro en WAV via AudioContext.
 * @param {Object} opts
 * @param {number} [opts.sampleRate] - 44100 par défaut
 * @param {function(): void} [opts.onTick] - Appelé chaque seconde avec (secondes écoulées)
 * @returns {Promise<{ stop: () => Promise<File> }>} - stop() arrête et retourne le File WAV
 */
export function recordMicrophoneWav(opts = {}) {
  const sampleRate = opts.sampleRate || 44100;
  const onTick = opts.onTick || (() => {});

  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audioContext = new AudioContext({ sampleRate });
        const source = audioContext.createMediaStreamSource(stream);
        const bufferSize = 4096;
        const processor = audioContext.createScriptProcessor(bufferSize, 1, 1);
        const chunks = [];

        processor.onaudioprocess = (e) => {
          const input = e.inputBuffer.getChannelData(0);
          chunks.push(new Float32Array(input));
        };

        source.connect(processor);
        processor.connect(audioContext.destination);

        let tickInterval = null;
        let seconds = 0;
        tickInterval = setInterval(() => {
          seconds += 1;
          onTick(seconds);
        }, 1000);

        const stop = () => {
          return new Promise((res) => {
            clearInterval(tickInterval);
            processor.disconnect();
            source.disconnect();
            stream.getTracks().forEach((t) => t.stop());

            const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
            const merged = new Float32Array(totalLength);
            let pos = 0;
            chunks.forEach((c) => {
              merged.set(c, pos);
              pos += c.length;
            });

            const blob = encodeWav(merged, audioContext.sampleRate);
            const file = new File([blob], 'audio.wav', { type: 'audio/wav' });
            res(file);
          });
        };

        resolve({ stop });
      })
      .catch(reject);
  });
}
