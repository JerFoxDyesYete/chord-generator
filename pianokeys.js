let selectedKeys = [];

// Constants for piano layout
const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_NOTES = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];
const OCTAVES = 5;

// Mapping of all note names to their physical piano keys
const NOTE_TO_KEY = {
  // Natural notes
  'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'G', 'A': 'A', 'B': 'B',

  // Sharps
  'C#': 'C#', 'D#': 'D#', 'F#': 'F#', 'G#': 'G#', 'A#': 'A#',

  // Flats
  'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',

  // Special cases
  'B#': 'C', 'E#': 'F', 'Cb': 'B', 'Fb': 'E'
};

function addKeys() {
  selectedKeys = [];
  for (let i = 0; i <= 4; i++) {
    const selectElement = document.getElementById(`first${i}`);
    const val = selectElement.value;
    if (val) {
      // Determine octave (simplified - you might want to adjust this)
      const octave = Math.min(Math.floor(i / WHITE_NOTES.length) + 1, OCTAVES);
      const fullNote = val + octave;
      selectedKeys.push(fullNote);
    }
  }
  updatePreview();
  updateChordName();
}

function update() {
  addKeys();
}

function updateChordName() {
  const chordDiv = document.getElementById("chordName") || document.createElement("div");
  chordDiv.id = "chordName";
  chordDiv.style.margin = "10px 0";
  chordDiv.style.fontWeight = "bold";

  if (selectedKeys.length === 0) {
    chordDiv.textContent = "No keys selected";
  } else {
    const chordName = detectChord(selectedKeys);
    const displayNotes = selectedKeys.map(n => n.slice(0, -1)).join(", ");
    chordDiv.textContent = chordName || "Notes: " + displayNotes;
  }

  if (!document.getElementById("chordName")) {
    document.querySelector("form").appendChild(chordDiv);
  }
}

function detectChord(notes) {
  // Convert all notes to their physical keys first
  const physicalNotes = notes.map(note => {
    const noteName = note.slice(0, -1);
    const octave = note.slice(-1);
    const physicalKey = NOTE_TO_KEY[noteName] || noteName;
    return physicalKey + octave;
  });

  // Simple chord detection (can be expanded)
  if (physicalNotes.length === 3) {
    const rootNote = physicalNotes[0];
    const rootName = rootNote.slice(0, -1);
    const octave = rootNote.slice(-1);

    // Check for major triad (root, major third, perfect fifth)
    const majorThird = getNoteAtInterval(rootName, 4) + octave;
    const perfectFifth = getNoteAtInterval(rootName, 7) + octave;

    if (physicalNotes.includes(majorThird) && physicalNotes.includes(perfectFifth)) {
      return rootName + " Major";
    }

    // Check for minor triad (root, minor third, perfect fifth)
    const minorThird = getNoteAtInterval(rootName, 3) + octave;
    if (physicalNotes.includes(minorThird) && physicalNotes.includes(perfectFifth)) {
      return rootName + " Minor";
    }
  }

  return null;
}

function getNoteAtInterval(note, halfSteps) {
  const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const index = allNotes.indexOf(note);
  return allNotes[(index + halfSteps) % 12];
}

function updatePreview() {
  const form = document.forms["chord_generator"];
  const color = form.rgb.value || "#ff0000";
  const sizeValue = 2;

  const whiteKeyWidth = 20 * sizeValue;
  const whiteKeyHeight = 120 * sizeValue;
  const blackKeyWidth = whiteKeyWidth * 0.6;
  const blackKeyHeight = whiteKeyHeight * 0.6;

  const totalWhiteKeys = WHITE_NOTES.length * OCTAVES;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = whiteKeyWidth * totalWhiteKeys;
  canvas.height = whiteKeyHeight;
  canvas.id = "pianoCanvas";
  canvas.style.marginTop = "10px";
  canvas.style.border = "1px solid #ddd";

  // First convert all selected notes to their physical keys
  const physicalSelectedKeys = selectedKeys.map(note => {
    const noteName = note.slice(0, -1);
    const octave = note.slice(-1);
    const physicalKey = NOTE_TO_KEY[noteName] || noteName;
    return physicalKey + octave;
  });

  // Draw white keys
  for (let octave = 1; octave <= OCTAVES; octave++) {
    for (let i = 0; i < WHITE_NOTES.length; i++) {
      const x = ((octave - 1) * WHITE_NOTES.length + i) * whiteKeyWidth;
      const note = WHITE_NOTES[i] + octave;

      // Check if this physical key is selected (including enharmonic equivalents)
      const isSelected = physicalSelectedKeys.includes(note);
      ctx.fillStyle = isSelected ? color : "#fff";
      ctx.fillRect(x, 0, whiteKeyWidth, whiteKeyHeight);
      ctx.strokeStyle = "#000";
      ctx.strokeRect(x, 0, whiteKeyWidth, whiteKeyHeight);
    }
  }

  // Draw black keys
  for (let octave = 1; octave <= OCTAVES; octave++) {
    for (let i = 0; i < BLACK_NOTES.length; i++) {
      if (BLACK_NOTES[i]) {
        const x = ((octave - 1) * WHITE_NOTES.length + i) * whiteKeyWidth;
        const note = BLACK_NOTES[i] + octave;

        // Check if this physical black key is selected (including enharmonic equivalents)
        const isSelected = physicalSelectedKeys.includes(note);
        ctx.fillStyle = isSelected ? color : "#000";
        ctx.fillRect(x + whiteKeyWidth * 0.75, 0, blackKeyWidth, blackKeyHeight);
      }
    }
  }

  const previewDiv = document.getElementById("preview");
  previewDiv.innerHTML = "";
  previewDiv.appendChild(canvas);
}

function generateCode() {
  updatePreview();
  const codeDiv = document.getElementById("code");

  const chordName = document.getElementById("chordName").textContent;
  const color = document.forms["chord_generator"].rgb.value || "#ff0000";
  const size = document.querySelector('input[name="size"]:checked').value;

  codeDiv.innerHTML = `
    <div style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
      <h3>Generated Chord</h3>
      <p><strong>${chordName}</strong></p>
      <p>Selected Notes: ${selectedKeys.join(", ")}</p>
      <p>Color: <span style="color:${color}">${color}</span></p>
      <p>Size: ${getSizeName(size)}</p>
      <button onclick="downloadImage()" style="padding: 5px 10px; cursor:pointer; background: #4CAF50; color: white; border: none; border-radius: 4px;">
        Download Image
      </button>
    </div>
  `;
}

function getSizeName(sizeValue) {
  switch (sizeValue) {
    case "1": return "Small";
    case "2": return "Medium";
    case "3": return "Large";
    default: return "Medium";
  }
}

function downloadImage() {
  const canvas = document.getElementById("pianoCanvas");
  if (!canvas) {
    alert("No image to download. Please generate a chord first.");
    return;
  }

  const link = document.createElement('a');
  const chordName = document.getElementById("chordName").textContent.replace(/[^a-zA-Z0-9]/g, '_');
  link.download = `chord_${chordName || 'image'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function () {
  // Add chord name display if it doesn't exist
  if (!document.getElementById("chordName")) {
    const chordDiv = document.createElement("div");
    chordDiv.id = "chordName";
    chordDiv.style.margin = "10px 0";
    chordDiv.style.fontWeight = "bold";
    document.querySelector("form").appendChild(chordDiv);
  }

  // Set default color if empty
  if (!document.forms["chord_generator"].rgb.value) {
    document.forms["chord_generator"].rgb.value = "#ff0000";
  }
});