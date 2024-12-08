// Function to get the current date in IST
const getISTDate = () => {
    const now = new Date();
    const istOffset = 330; // IST is UTC + 5:30
    const istDate = new Date(now.getTime() + istOffset * 60 * 1000);
    return istDate;
  };
  
const calendarGrid = document.getElementById("calendarGrid");
const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const timeSlots = document.getElementById("timeSlots");

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Function to get the number of days in a given month and year
const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

// Function to generate the calendar for the current month and year
const generateCalendar = (year, month) => {
    calendarGrid.innerHTML = ""; // Clear existing dates
    calendarDays.innerHTML = ""; // Clear previous headers
  
    // Render days of the week
    daysOfWeek.forEach((day) => {
      const dayDiv = document.createElement("div");
      dayDiv.textContent = day;
      dayDiv.classList.add("calendar-day-name");
      calendarDays.appendChild(dayDiv);
    });
  
    // Get the current IST date
    const today = getISTDate();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();
  
    // Add empty slots for days before the first day of the month
    const firstDay = new Date(year, month, 1).getDay(); // Sunday = 0, Monday = 1, etc.
    for (let i = 0; i < firstDay; i++) {
      const emptySlot = document.createElement("div");
      emptySlot.classList.add("empty-slot");
      calendarGrid.appendChild(emptySlot);
    }
  
    // Generate days of the month
    const days = daysInMonth(year, month);
    for (let i = 1; i <= days; i++) {
      const dayDiv = document.createElement("div");
      dayDiv.textContent = i;
      dayDiv.classList.add("calendar-day");
  
      // Disable past dates
      if (year < todayYear || (year === todayYear && month < todayMonth) || (year === todayYear && month === todayMonth && i < todayDate)) {
        dayDiv.classList.add("disabled");
      } else {
        // Enable clickable days for current and future dates
        dayDiv.onclick = () => selectDate(i);
      }
  
      calendarGrid.appendChild(dayDiv);
    }
  
    // Update the month and year display
    monthYear.textContent = `${monthNames[month]} ${year}`;
  };
  
// Function to handle selecting a date
const selectDate = (day) => {
  // Remove the "selected" class from all day elements
  document.querySelectorAll(".calendar-day").forEach((el) => el.classList.remove("selected"));

  // Add the "selected" class to the clicked day
  const dayIndex = day + new Date(currentYear, currentMonth, 1).getDay() - 1;
  const selectedDay = document.querySelector(`.calendar-grid div:nth-child(${dayIndex + 1})`);
  if (selectedDay) selectedDay.classList.add("selected");

  // Load time slots for the selected day
  loadTimeSlots(day);
};

// Function to load time slots for the selected date
const loadTimeSlots = (day) => {
  const slots = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
  ];
  timeSlots.innerHTML = `<h2>Available Time Slots for ${monthNames[currentMonth]} ${day}, ${currentYear}</h2>`;
  timeSlots.innerHTML += slots.map(slot => `<span>${slot}</span>`).join("");
};

// Event listeners for Previous and Next buttons
prevMonthBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11; // Move to December of the previous year
    currentYear--;
  }
  generateCalendar(currentYear, currentMonth);
});

nextMonthBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0; // Move to January of the next year
    currentYear++;
  }
  generateCalendar(currentYear, currentMonth);
});

// Initialize the calendar
generateCalendar(currentYear, currentMonth);

document.getElementById('calendarGrid').addEventListener('click', function (event) {
    const selectedDay = event.target.getAttribute('data-day');
    document.getElementById('selectedDay').value = selectedDay;
  });
  
  document.getElementById('timeSlots').addEventListener('click', function (event) {
    const selectedTime = event.target.getAttribute('data-time');
    document.getElementById('selectedTime').value = selectedTime;
  });
  
  // Handle form submission
const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    const form = event.target;
  
    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        window.location.href = "home.html"; // Redirect on success
      } else {
        showErrorPopup("Error occurred while submitting form");
        window.location.href = "calendar.html"; // Redirect on failure
      }
    } catch (error) {
      showErrorPopup("Error occurred while submitting form");
      window.location.href = "calendar.html"; // Redirect on failure
    }
  
    return false; // Prevent default behavior
  };
  
  // Show error popup
  const showErrorPopup = (message) => {
    alert(message); // Simple popup alert
  };
  
  // Add click effect for time slots
  document.addEventListener("click", (e) => {
    if (e.target.matches("#timeSlots span")) {
      document
        .querySelectorAll("#timeSlots span")
        .forEach((el) => el.classList.remove("selected-slot"));
      e.target.classList.add("selected-slot");
      document.getElementById("selectedTime").value = e.target.textContent; // Update hidden field
    }
  });
  