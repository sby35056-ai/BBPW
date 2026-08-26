const firstInput = document.getElementById("first");
const lastInput = document.getElementById("last");
const pattern = document.getElementById("pattern");
const results = document.getElementById("results");
const analyzeBtn = document.getElementById("analyzeBtn");

const mobileFamilies = [
  {
    prefix: "08",
    label: "08 Mobile Family"
  },
  {
    prefix: "09",
    label: "09 Mobile Family"
  },
  {
    prefix: "06",
    label: "06 Mobile Family"
  }
];

function cleanNumericInput(input) {
  input.value = input.value.replace(/\D/g, "");
}

function updatePattern() {
  const first = firstInput.value || "_";

  const last = lastInput.value
    .padEnd(4, "_")
    .split("");

  pattern.textContent = [
    first,
    "_",
    "_",
    "_",
    "_",
    "_",
    ...last
  ].join(" ");
}

firstInput.addEventListener("input", () => {
  cleanNumericInput(firstInput);
  updatePattern();
});

lastInput.addEventListener("input", () => {
  cleanNumericInput(lastInput);
  updatePattern();
});

analyzeBtn.addEventListener("click", analyze);

function analyze() {
  const first = firstInput.value;
  const last = lastInput.value;

  if (first.length !== 1 || last.length !== 4) {
    alert("กรุณากรอกเลขหลักแรกและเลขท้าย 4 หลักให้ครบ");
    return;
  }

  if (first !== "0") {
    alert("หมายเลขโทรศัพท์แบบ National Format ของไทยต้องขึ้นต้นด้วย 0");
    return;
  }

  renderResults(last);
}

function renderResults(last) {

  const rawCandidateCount = 100000;
  const candidatesPerFamily = 10000;

  const filteredCandidateCount =
    candidatesPerFamily * mobileFamilies.length;

  const probabilityPerCandidate =
    1 / filteredCandidateCount;

  let html = `
    <h2>🔎 Mobile Number Structure</h2>

    <p style="color:#666;line-height:1.6">
      จาก ${rawCandidateCount.toLocaleString()} รูปแบบเริ่มต้น
      เมื่อกรองตาม mobile numbering family ที่ระบบรองรับ
      จะเหลือ ${filteredCandidateCount.toLocaleString()} รูปแบบ
    </p>

    <div class="stats">

      <div class="stat">
        ก่อนกรอง
        <strong>${rawCandidateCount.toLocaleString()}</strong>
      </div>

      <div class="stat">
        หลังกรอง
        <strong>${filteredCandidateCount.toLocaleString()}</strong>
      </div>

      <div class="stat">
        Number Families
        <strong>${mobileFamilies.length}</strong>
      </div>

    </div>
  `;

  mobileFamilies.forEach((family) => {

    const familyShare =
      candidatesPerFamily /
      filteredCandidateCount *
      100;

    const firstCandidate =
      `${family.prefix}0000${last}`;

    const lastCandidate =
      `${family.prefix}9999${last}`;

    html += `
      <div class="family">

        <div class="family-head">

          <div class="number">
            ${family.prefix} + 0000–9999 + ${last}
          </div>

          <div class="badge">
            ${candidatesPerFamily.toLocaleString()} candidates
          </div>

        </div>

        <div class="details">

          ${family.label}

          <br><br>

          ช่วงหมายเลขที่เข้าเงื่อนไข:

          <br>

          <strong>
            ${firstCandidate} – ${lastCandidate}
          </strong>

          <br><br>

          Candidate share:
          <strong>
            ${familyShare.toFixed(2)}%
          </strong>

        </div>

        <div class="bar-bg">

          <div
            class="bar"
            style="width:${familyShare}%"
          ></div>

        </div>

      </div>
    `;
  });

  html += `
    <div class="box">

      <strong>📐 Conditional probability</strong>

      <br><br>

      หลังกรองแล้วมี candidate ทั้งหมด
      <strong>${filteredCandidateCount.toLocaleString()}</strong>
      รูปแบบ

      <br><br>

      หากไม่มีข้อมูลอื่นที่ทำให้รูปแบบหนึ่งมีน้ำหนัก
      มากกว่าอีกแบบหนึ่ง:

      <br><br>

      <strong>
        P(candidate)
        =
        1 / ${filteredCandidateCount.toLocaleString()}
        =
        ${(probabilityPerCandidate * 100).toFixed(6)}%
      </strong>

    </div>
  `;

  results.innerHTML = html;
  results.classList.remove("hidden");
}

updatePattern();
