/* =========================================================
   top.js
   Top編集
========================================================= */

/* =========================================================
   01 Top描画
========================================================= */

function updateTopPreview() {
    UI.topFrame.style.height = `${STATE.top.height}px`;

    renderTopPieces();
}

/* =========================================================
   02 Topパーツ描画
========================================================= */

function renderTopPieces() {

    if (STATE.top.selected >= STATE.top.split) {
        STATE.top.selected = STATE.top.split - 1;
    }

    UI.topFrame.innerHTML = "";

    for (let index = 0; index < STATE.top.split; index += 1) {

        const piece = document.createElement("button");

        piece.type = "button";
        piece.className = "top-piece";
        piece.dataset.index = index;

        piece.setAttribute(
            "aria-label",
            `Topパーツ ${index + 1}`
        );

        piece.addEventListener("click", function () {
            selectTopPiece(index);
        });

        UI.topFrame.appendChild(piece);
    }

    updateTopSelection();
}

/* =========================================================
   03 Topパーツ選択
========================================================= */

function selectTopPiece(index) {
    STATE.top.selected = index;

    updateTopSelection();
}

/* =========================================================
   04 選択表示更新
========================================================= */

function updateTopSelection() {

    const pieces =
        UI.topFrame.querySelectorAll(".top-piece");

    pieces.forEach(function (piece, index) {

        const isSelected =
            index === STATE.top.selected;

        piece.classList.toggle(
            "selected",
            isSelected
        );

        piece.setAttribute(
            "aria-pressed",
            String(isSelected)
        );
    });

    const selectedValue =
        document.getElementById("topSelected");

    if (selectedValue) {
        selectedValue.textContent =
            `${STATE.top.selected + 1} / ${STATE.top.split}`;
    }
}

/* =========================================================
   05 Top編集画面
========================================================= */

function showTopEditor() {
    UI.editor.innerHTML = `
        <h3>Top編集</h3>

        <label for="topHeight">
            高さ
        </label>

        <input
            type="range"
            id="topHeight"
            min="${CONFIG.topMinHeight}"
            max="${CONFIG.topMaxHeight}"
            value="${STATE.top.height}"
        >

        <span id="topValue">
            ${STATE.top.height}px
        </span>

        <label for="topSplit">
            分割数
        </label>

        <select id="topSplit">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
        </select>

        <div class="top-selected-status">
            <span>選択中のパーツ</span>

            <strong id="topSelected">
                ${STATE.top.selected + 1} / ${STATE.top.split}
            </strong>
        </div>
    `;

    const topHeight =
        document.getElementById("topHeight");

    const topValue =
        document.getElementById("topValue");

    const topSplit =
        document.getElementById("topSplit");

    topSplit.value = STATE.top.split;

    /* =====================================================
       06 高さ変更
    ===================================================== */

    topHeight.addEventListener("input", function () {
        STATE.top.height = Number(this.value);

        topValue.textContent =
            `${STATE.top.height}px`;

        updateTopPreview();
    });

    /* iPhone Safari用の補助 */

    topHeight.addEventListener("change", function () {
        STATE.top.height = Number(this.value);

        topValue.textContent =
            `${STATE.top.height}px`;

        updateTopPreview();
    });

    /* =====================================================
       07 分割数変更
    ===================================================== */

    topSplit.addEventListener("change", function () {
        STATE.top.split = Number(this.value);

        if (STATE.top.selected >= STATE.top.split) {
            STATE.top.selected =
                STATE.top.split - 1;
        }

        updateTopPreview();
    });
}