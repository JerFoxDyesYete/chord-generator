const notes = [
  "Cb", "C", "C#", "Db", "D", "D#", "Eb", "E", "E#", "Fb",
  "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B", "B#"
];

const rowsContainer = document.getElementById("keys-rows-container");
const preview = document.getElementById("preview");
const previewImg = document.getElementById("previewImage");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const copiedMsg = document.getElementById("copiedMsg");
const colorInput = document.getElementById("color");
const clearKeysBtn = document.getElementById("clearKeysBtn");
const addKeysBtn = document.getElementById("addKeysBtn");

let latestImgURL = "";
let rowCount = 0;
const maxRows = 4;

function createSelect(id) {
  const select = document.createElement("select");
  select.id = id;
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "-";
  select.appendChild(emptyOption);
  notes.forEach(note => {
    const option = document.createElement("option");
    option.value = note;
    option.textContent = note;
    select.appendChild(option);
  });
  select.addEventListener("change", updatePreview);
  return select;
}

function createKeysRow(rowIndex) {
  const rowDiv = document.createElement("div");
  rowDiv.className = "keys-row";
  rowDiv.id = `row${rowIndex}`;
  for (let i = 0; i < 5; i++) {
    const select = createSelect(`key_${rowIndex}_${i}`);
    rowDiv.appendChild(select);
  }
  return rowDiv;
}

function updatePreview() {
  const allSelects = document.querySelectorAll("select");
  const selectedNotes = [];
  allSelects.forEach(select => {
    if (select.value) selectedNotes.push(select.value);
  });

  if (selectedNotes.length === 0) {
    preview.style.display = "none";
    previewImg.src = "";
    latestImgURL = "";
    return;
  }

  const colorHex = colorInput.value.replace("#", "");
  const notesStr = selectedNotes.join(",");
  latestImgURL = `https://www.hearandplaymusic.com/dynamic_image/pianokeys.php?notes=${encodeURIComponent(notesStr)}&color=${colorHex}&size=5`;

  previewImg.src = latestImgURL;
  preview.style.display = "block";
}

rowsContainer.appendChild(createKeysRow(rowCount));

function checkAddButton() {
  addKeysBtn.disabled = rowCount >= maxRows - 1;
}

addKeysBtn.addEventListener("click", () => {
  if (rowCount < maxRows - 1) {
    rowCount++;
    rowsContainer.appendChild(createKeysRow(rowCount));
    updatePreview();
    checkAddButton();
  }
});

clearKeysBtn.addEventListener("click", () => {
  document.querySelectorAll("select").forEach(select => select.value = "");
  latestImgURL = "";
  preview.style.display = "none";
  previewImg.src = "";
  colorInput.value = "#2087c9";
  rowCount = 0;
  while (rowsContainer.children.length > 1) {
    rowsContainer.removeChild(rowsContainer.lastChild);
  }
  checkAddButton();
});

document.getElementById("chordForm").addEventListener("submit", e => {
  e.preventDefault();
  updatePreview();
});

colorInput.addEventListener("input", updatePreview);

copyBtn.addEventListener("click", () => {
  if (!latestImgURL) return;
  const embedCode = `<img src='${latestImgURL}' border="0" />\n<a href="https://www.hearandplay.com/main">Powered by hearandplay.com</a>`;
  navigator.clipboard.writeText(embedCode).then(() => {
    copiedMsg.classList.add("show");
    setTimeout(() => copiedMsg.classList.remove("show"), 2000);
    copyBtn.focus();
  });
});

downloadBtn.addEventListener("click", () => {
  if (!latestImgURL) return;
  const a = document.createElement("a");
  a.href = latestImgURL;
  a.download = "chord.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

checkAddButton();
