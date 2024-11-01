var colors = [
  [194, 187, 255],  // C2BBFF
  [193, 196, 255],  // C1C4FF
  [192, 206, 255],  // C0CEFF
  [188, 236, 255],  // BCECFF
  [189, 225, 255],  // BDE1FF
  [188, 236, 255]   // BCECFF (duplicated to match the gradient pattern)
];

var step = 0;
var colorIndices = [0, 1, 2, 3];
var gradientSpeed = 0.010;

function updateGradient() {
  var c0_0 = colors[colorIndices[0]];
  var c0_1 = colors[colorIndices[1]];
  var c1_0 = colors[colorIndices[2]];
  var c1_1 = colors[colorIndices[3]];

  var istep = 1 - step;
  var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
  var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
  var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
  var color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

  var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
  var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
  var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
  var color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

  $('#gradient').css({
    background: "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))"
  }).css({
    background: "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)"
  });

  step += gradientSpeed;
  if (step >= 1) {
    step %= 1;
    colorIndices[0] = colorIndices[1];
    colorIndices[2] = colorIndices[3];

    colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
    colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
  }
}

setInterval(updateGradient, 10);

const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const cycleLengthText = document.getElementById("cycleLength");
const cycleCategoryText = document.getElementById("cycleCategory");

let menstrualData = {}; // Stores menstruation data per month and year
let cycleLengths = [];  // Stores cycle lengths for each month

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar() {
  calendar.innerHTML = "";
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  monthYear.innerHTML = `${new Date(currentYear, currentMonth).toLocaleString("en-US", { month: "long" })} ${currentYear}`;

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement("div");
    calendar.appendChild(emptyCell);
  }

  const currentMonthData = menstrualData[`${currentYear}-${currentMonth}`] || [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayBtn = document.createElement("button");
    dayBtn.innerText = day;
    dayBtn.onclick = () => toggleDaySelection(day);

    if (currentMonthData.includes(day)) {
      dayBtn.classList.add("active");
    }

    calendar.appendChild(dayBtn);
  }
}

function toggleDaySelection(day) {
  const key = `${currentYear}-${currentMonth}`;
  if (!menstrualData[key]) {
    menstrualData[key] = [];
  }

  if (menstrualData[key].includes(day)) {
    menstrualData[key] = menstrualData[key].filter(date => date !== day);
  } else {
    menstrualData[key].push(day);
  }

  calculateCycle();
  renderCalendar();
}

function calculateCycle() {
  const previousMonthKey = `${currentYear}-${currentMonth - 1}`;
  const currentMonthKey = `${currentYear}-${currentMonth}`;
  const previousMonthDays = menstrualData[previousMonthKey] || [];
  const currentMonthDays = menstrualData[currentMonthKey] || [];

  if (previousMonthDays.length && currentMonthDays.length) {
    const firstDayPreviousMonth = previousMonthDays[0];
    const firstDayCurrentMonth = currentMonthDays[0];

    const cycleLength = (new Date(currentYear, currentMonth, firstDayCurrentMonth) - 
                         new Date(currentYear, currentMonth - 1, firstDayPreviousMonth)) / (1000 * 60 * 60 * 24);
    
    cycleLengths.push(cycleLength);

    cycleLengthText.innerText = Math.round(cycleLength);
    cycleCategoryText.innerText = categorizeCycle(cycleLength);
  }
}

function categorizeCycle(cycleLength) {
  if (cycleLength >= 21 && cycleLength <= 35) {
    return "Normal";
  } else if (cycleLength < 21) {
    return "Short";
  } else {
    return "Long";
  }
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
}

renderCalendar();