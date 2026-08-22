document.addEventListener("DOMContentLoaded", () => {
  // --============== WELCOME OVERLAY LOGIC ================--
  const welcomeOverlay = document.getElementById("welcome-overlay");

  //--================= Keep it visible for 2 seconds, then fade out===============--
  if (welcomeOverlay) {
    setTimeout(() => {
      welcomeOverlay.classList.add("fade-out");
    }, 2000);
  }

  // ---============= EXISTING LOGIC ================ ---
  const mainValueInput = document.getElementById("main-value");
  const mainUnitSelect = document.getElementById("main-unit");
  const mainSlider = document.getElementById("main-slider");

  const resCelsius = document.getElementById("res-celsius");
  const resFahrenheit = document.getElementById("res-fahrenheit");
  const resKelvin = document.getElementById("res-kelvin");
  const resRankine = document.getElementById("res-rankine");
  const resRéaumur = document.getElementById("res-réaumur");
  const workingStepsText = document.getElementById("working-steps-text");

  const historyContentList = document.getElementById("history-content-list");
  const clearHistoryBtn = document.getElementById("clear-history-btn");

  const bookNavBtn = document.getElementById("book-nav-btn");
  const formulasModal = document.getElementById("formulas-modal");
  const historyNavBtn = document.getElementById("history-nav-btn");
  const historyModal = document.getElementById("history-modal");
  const modalHistoryList = document.getElementById("modal-history-list");
  const closeModalBtns = document.querySelectorAll(".close-modal-btn");

  const darkModeBtn = document.getElementById("dark-mode-btn");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");

  let historyData = [];
  let accentColors = ["#2ecc71", "#38bdf8", "#f59e0b", "#ec4899", "#8b5cf6"];
  let currentAccentIndex = 0;

  function convertAll(val, unit) {
    let celsius = val;
    if (unit === "fahrenheit") celsius = (val - 32) * (5 / 9);
    else if (unit === "kelvin") celsius = val - 273.15;

    //--============ Absolute Zero Edge-Case Validation (-273.15°C limit) ==============--
    if (celsius < -273.15) {
      alert(
        "⚠️ Absolute Zero Violation! Temperature cannot go below -273.15°C.",
      );

      //--============== Reset input back to absolute zero limit safely ==============--
      let correctedCelsius = -273.15;
      let correctedVal = correctedCelsius;
      if (unit === "fahrenheit") correctedVal = (correctedCelsius * 9) / 5 + 32;
      else if (unit === "kelvin") correctedVal = correctedCelsius + 273.15;

      mainValueInput.value = correctedVal;
      if (mainSlider)
        mainSlider.value = Math.max(-50, Math.min(150, correctedVal));

      celsius = correctedCelsius;
      val = correctedVal;
    }

    let fahrenheit = (celsius * 9) / 5 + 32;
    let kelvin = celsius + 273.15;
    let rankine = ((celsius + 273.15) * 9) / 5;
    let reaumur = (celsius * 4) / 5;

    resCelsius.textContent = `${celsius.toFixed(2)}°C`;
    resFahrenheit.textContent = `${fahrenheit.toFixed(2)}°F`;
    resKelvin.textContent = `${kelvin.toFixed(2)} K`;
    resRankine.textContent = `${rankine.toFixed(2)} °R`;
    resRéaumur.textContent = `${reaumur.toFixed(2)} °Ré`;

    workingStepsText.textContent = `°C → °F: ${celsius.toFixed(1)} × 9/5 + 32 = ${fahrenheit.toFixed(2)}°F\n°C → K: ${celsius.toFixed(1)} + 273.15 = ${kelvin.toFixed(2)} K`;

    if (val >= -50 && val <= 150) {
      mainSlider.value = val;
    }
  }

  function triggerCalculation() {
    const val = parseFloat(mainValueInput.value) || 0;
    const unit = mainUnitSelect.value;
    convertAll(val, unit);

    const entry = `${val} ${unit.toUpperCase()} converted successfully`;
    if (historyData.length === 0 || historyData[0] !== entry) {
      historyData.unshift(entry);
      if (historyData.length > 10) historyData.pop();
      renderHistory();
    }
  }

  //--================= Global helper function for onclick presets================--
  window.setPreset = function (val) {
    mainValueInput.value = val;
    mainUnitSelect.value = "celsius";
    if (mainSlider && val >= -50 && val <= 150) mainSlider.value = val;
    triggerCalculation();
  };

  mainValueInput.addEventListener("input", () => {
    if (
      mainSlider &&
      mainValueInput.value >= -50 &&
      mainValueInput.value <= 150
    ) {
      mainSlider.value = mainValueInput.value;
    }
    triggerCalculation();
  });

  mainSlider.addEventListener("input", () => {
    mainValueInput.value = mainSlider.value;
    triggerCalculation();
  });

  mainUnitSelect.addEventListener("change", triggerCalculation);

  document.querySelectorAll(".preset-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const val = chip.getAttribute("data-val");
      const unit = chip.getAttribute("data-unit");
      if (val !== null && unit !== null) {
        mainValueInput.value = val;
        mainUnitSelect.value = unit;
        if (mainSlider) mainSlider.value = val;
        triggerCalculation();
      }
    });
  });

  document.querySelectorAll(".toggle-dropdown-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("id-target");
      const targetEl = document.getElementById(targetId);
      if (targetEl.style.display === "none") {
        targetEl.style.display = targetEl.classList.contains("extra-grid")
          ? "grid"
          : "block";
        btn.querySelector("span").textContent = btn
          .querySelector("span")
          .textContent.replace("Show", "Hide");
      } else {
        targetEl.style.display = "none";
        btn.querySelector("span").textContent = btn
          .querySelector("span")
          .textContent.replace("Hide", "Show");
      }
    });
  });

  function renderHistory() {
    if (historyData.length === 0) {
      historyContentList.innerHTML = `<div class="no-history-text">Nothing converted yet.</div>`;
      modalHistoryList.innerHTML = `<p style="color: var(--text-sub);">No conversion logs recorded yet.</p>`;
      return;
    }
    historyContentList.innerHTML = "";
    let modalHtml = "<ul>";
    historyData.forEach((item, index) => {
      historyContentList.innerHTML += `<div class="history-item"><span>${item}</span><span style="color:var(--text-sub); font-size:10px;">#${historyData.length - index}</span></div>`;
      modalHtml += `<li>${item}</li>`;
    });
    modalHtml += "</ul>";
    modalHistoryList.innerHTML = modalHtml;
  }

  clearHistoryBtn.addEventListener("click", () => {
    historyData = [];
    renderHistory();
  });

  bookNavBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formulasModal.classList.remove("hidden");
  });

  historyNavBtn.addEventListener("click", (e) => {
    e.preventDefault();
    historyModal.classList.remove("hidden");
  });

  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      formulasModal.classList.add("hidden");
      historyModal.classList.add("hidden");
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target === formulasModal) formulasModal.classList.add("hidden");
    if (e.target === historyModal) historyModal.classList.add("hidden");
  });

  darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const icon = darkModeBtn.querySelector("i");
    if (document.body.classList.contains("light-mode")) {
      icon.className = "fa-solid fa-moon";
    } else {
      icon.className = "fa-solid fa-sun";
    }
  });

  themeToggleBtn.addEventListener("click", () => {
    currentAccentIndex = (currentAccentIndex + 1) % accentColors.length;
    const newColor = accentColors[currentAccentIndex];
    document.documentElement.style.setProperty("--accent-color", newColor);
  });

  triggerCalculation();
});

function copyText(text) {
  navigator.clipboard.writeText(text);
  alert(`Copied to clipboard: ${text}`);
}
