
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
      emptyOption.textContent = "-"; //blank
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

      // Convert sharps '#' to 's' as per URL format requirement
      const notesStr = selectedNotes.map(n => n.replace("#", "s")).join(",");

      // Remove '#' encoding for commas (do not encode commas)
      const colorHex = colorInput.value.replace("#", "").toUpperCase();

      latestImgURL = `https://www.hearandplaymusic.com/dynamic_image/pianokeys.php?notes=${notesStr}&color=${colorHex}&size=5`;

      previewImg.src = latestImgURL;
      preview.style.display = "block";
    }

    addKeysBtn.addEventListener("click", () => {
      if (rowCount < maxRows) {
        const newRow = createKeysRow(rowCount);
        rowsContainer.appendChild(newRow);
        rowCount++;
      }
    });

    clearKeysBtn.addEventListener("click", () => {
      rowsContainer.innerHTML = "";
      rowCount = 0;
      preview.style.display = "none";
      previewImg.src = "";
      latestImgURL = "";
    });

    colorInput.addEventListener("change", updatePreview);

    copyBtn.addEventListener("click", () => {
      if (!latestImgURL) return;

      const embedCode = `<img src='${latestImgURL}' border=0 /><br /><a href="https://www.hearandplay.com/main">Powered by hearandplay.com</a>`;
      navigator.clipboard.writeText(embedCode).then(() => {
        copiedMsg.classList.add("show");
        setTimeout(() => copiedMsg.classList.remove("show"), 1200);
      });
    });

    downloadBtn.addEventListener("click", () => {
      if (!latestImgURL) return;
      // Direct download by opening the URL in a new tab (image will load, user can right-click save)
      window.open(latestImgURL, "_blank");
    });

    // Initialize with one row of keys
    addKeysBtn.click();