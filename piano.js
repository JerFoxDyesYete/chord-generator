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
            let notesRaw = [];

            allSelects.forEach(select => {
                notesRaw.push(select.value ? select.value.replace("#", "s") : "");
            });

            // Remove multiple blanks in a row
            let notesFiltered = [];
            let lastWasBlank = false;

            for (let note of notesRaw) {
                if (note === "") {
                    if (!lastWasBlank) {
                        notesFiltered.push(""); // allow one blank
                        lastWasBlank = true;
                    }
                    // else skip this blank
                } else {
                    notesFiltered.push(note);
                    lastWasBlank = false;
                }
            }

            // Trim leading/trailing blanks (avoid leading/trailing ,,)
            while (notesFiltered[0] === "") notesFiltered.shift();
            while (notesFiltered[notesFiltered.length - 1] === "") notesFiltered.pop();

            const notesStr = notesFiltered.join(",");
            const colorHex = colorInput.value.replace("#", "").toUpperCase();
            const imageURL = `https://www.hearandplaymusic.com/dynamic_image/pianokeys.php?notes=${notesStr}&color=${colorHex}&size=5`;

            latestImgURL = imageURL;
            previewImg.src = latestImgURL;
            preview.style.display = "block";
        }



        addKeysBtn.addEventListener("click", () => {
            if (rowCount < maxRows) {
                const newRow = createKeysRow(rowCount);
                rowsContainer.appendChild(newRow);
                rowCount++;

                if (rowCount >= maxRows) {
                    addKeysBtn.disabled = true;
                }
            }
        });

        clearKeysBtn.addEventListener("click", () => {
            rowsContainer.innerHTML = "";
            rowCount = 0;
            preview.style.display = "none";
            previewImg.src = "";
            latestImgURL = "";

            // Always add 1 new key row after clearing
            const newRow = createKeysRow(rowCount);
            rowsContainer.appendChild(newRow);
            rowCount = 1;

            addKeysBtn.disabled = false;
        });

        colorInput.addEventListener("change", updatePreview);

        copyBtn.addEventListener("click", () => {
            const allSelects = document.querySelectorAll("select");
            const selectedNotesWithBlanks = [];

            allSelects.forEach(select => {
                if (select.value) {
                    selectedNotesWithBlanks.push(select.value.replace("#", "s"));
                } else {
                    selectedNotesWithBlanks.push("");
                }
            });

            const notesStr = selectedNotesWithBlanks.join(",");
            const colorHex = colorInput.value.replace("#", "").toUpperCase();
            const embedURL = `https://www.hearandplaymusic.com/dynamic_image/pianokeys.php?notes=${notesStr}&color=${colorHex}&size=5`;

            const embedCode = `<img src='${embedURL}' border=0 /><br /><a href="https://www.hearandplay.com/main">Powered by hearandplay.com</a>`;

            navigator.clipboard.writeText(embedCode).then(() => {
                copiedMsg.classList.add("show");
                setTimeout(() => copiedMsg.classList.remove("show"), 1200);
            });
        });



        downloadBtn.addEventListener("click", () => {
            const allSelects = document.querySelectorAll("select");
            let notesRaw = [];

            allSelects.forEach(select => {
                notesRaw.push(select.value ? select.value.replace("#", "s") : "");
            });

            // Remove multiple blanks in a row
            let notesFiltered = [];
            let lastWasBlank = false;

            for (let note of notesRaw) {
                if (note === "") {
                    if (!lastWasBlank) {
                        notesFiltered.push("");
                        lastWasBlank = true;
                    }
                } else {
                    notesFiltered.push(note);
                    lastWasBlank = false;
                }
            }

            while (notesFiltered[0] === "") notesFiltered.shift();
            while (notesFiltered[notesFiltered.length - 1] === "") notesFiltered.pop();

            const notesStr = notesFiltered.join(",");
            const colorHex = colorInput.value.replace("#", "").toUpperCase();
            const downloadURL = `https://www.hearandplaymusic.com/dynamic_image/pianokeys.php?notes=${notesStr}&color=${colorHex}&size=5`;

            const link = document.createElement("a");
            link.href = downloadURL;
            link.download = `chord-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });


        const firstRow = createKeysRow(0);
        rowsContainer.appendChild(firstRow);
        rowCount = 1;