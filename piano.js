const notes = [
  "Cb", "C", "C#", "Db", "D", "D#", "Eb", "E", "E#", "Fb", "F",
  "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B", "B#"
];

const keysColorContainer = document.getElementById("keys-color-container");
const preview = document.getElementById("preview");
const previewImg = document.getElementById("previewImage");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const copiedMsg = document.getElementById("copiedMsg");
let latestImgURL = "";
const selects = [];

// Create select elements for notes
for (let i = 0; i < 5; i++) {
  const select = document.createElement("select");
  select.id = `key${i}`;
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "-";
  select.appendChild(emptyOption);
  notes.forEach((note) => {
    const option = document.createElement("option");
    option.value = note;
    option.textContent = note;
    select.appendChild(option);
  });
  selects.push(select);
  keysColorContainer.appendChild(select);
}

// Color picker
const colorInput = document.createElement("input");
colorInput.type = "color";
colorInput.id = "color";
colorInput.value = "#2087c9";
keysColorContainer.appendChild(colorInput);

function updatePreview() {
  const selectedNotes = selects.map((s) => s.value).filter(Boolean);
  if (selectedNotes.length === 0) {
    preview.style.display = "none";
    previewImg.src = "";
    return;
  }

  const colorHex = colorInput.value.replace("#", "");
  const notesStr = selectedNotes.join(",");
  latestImgURL = `https://www.hearandplaymusic.com/dynamic_image/pianokeys.php?notes=${encodeURIComponent(
    notesStr
  )}&color=${colorHex}&size=5`;

  previewImg.src = latestImgURL;
  preview.style.display = "block";
}

document.getElementById("chordForm").addEventListener("submit", (e) => {
  e.preventDefault();
  updatePreview();
});

copyBtn.addEventListener("click", () => {
  if (!latestImgURL) return;
  const embedCode = `<img src='${latestImgURL}' border="0" />\n<a href="https://www.hearandplay.com/main">Powered by hearandplay.com</a>`;
  navigator.clipboard.writeText(embedCode).then(() => {
    copiedMsg.classList.add("show");
    setTimeout(() => copiedMsg.classList.remove("show"), 2000);
    copyBtn.focus();
  });
});

// ✅ This is the only updated section
downloadBtn.addEventListener("click", async () => {
  if (!latestImgURL) return;

  try {
    const response = await fetch(latestImgURL, { mode: 'cors' });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "chord.png";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl); // clean up
  } catch (error) {
    alert("Download failed. Try again.");
    console.error("Download error:", error);
  }
});

selects.forEach((select) => {
  select.addEventListener("change", updatePreview);
});
colorInput.addEventListener("input", updatePreview);
