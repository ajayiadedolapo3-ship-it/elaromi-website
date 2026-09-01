// State management
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

// Mock booked dates (you can modify these)
const bookedDates = [
  new Date(2026, 8, 5),
  new Date(2026, 8, 12),
  new Date(2026, 8, 19),
  new Date(2026, 8, 26)
];

// Available time slots
const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM'
];

// Initialize calendar
function initCalendar() {
  renderCalendar();
  updateMonthDisplay();
}

// Update month display
function updateMonthDisplay() {
  const options = { month: 'long', year: 'numeric' };
  document.getElementById('monthDisplay').textContent = currentDate.toLocaleDateString('en-US', options);
}

// Render calendar
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  const calendarDiv = document.getElementById('calendar');
  calendarDiv.innerHTML = '';
  
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('button');
    emptyDay.className = 'day empty';
    calendarDiv.appendChild(emptyDay);
  }
  
  // Days of month
  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month, day);
    const dayBtn = document.createElement('button');
    dayBtn.className = 'day';
    dayBtn.textContent = day;
    
    // Check if date is booked
    const isBooked = bookedDates.some(d => 
      d.getDate() === day && 
      d.getMonth() === month && 
      d.getFullYear() === year
    );
    
    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = date < today;
    
    if (isBooked || isPast) {
      dayBtn.classList.add('booked');
      dayBtn.disabled = true;
    } else {
      dayBtn.onclick = () => selectDate(date, dayBtn);
    }
    
    // Mark selected date
    if (selectedDate && 
        date.getDate() === selectedDate.getDate() && 
        date.getMonth() === selectedDate.getMonth() && 
        date.getFullYear() === selectedDate.getFullYear()) {
      dayBtn.classList.add('selected');
    }
    
    calendarDiv.appendChild(dayBtn);
  }
}

// Previous month
function previousMonth() {
  const today = new Date();
  if (currentDate.getFullYear() > today.getFullYear() || 
      (currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() > today.getMonth())) {
    currentDate.setMonth(currentDate.getMonth() - 1);
    selectedDate = null;
    selectedTime = null;
    updateUI();
  }
}

// Next month
function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  selectedDate = null;
  selectedTime = null;
  updateUI();
}

// Select date
function selectDate(date, button) {
  selectedDate = date;
  selectedTime = null;
  updateUI();
  renderTimeSlots();
}

// Render time slots
function renderTimeSlots() {
  const slotsDiv = document.getElementById('slots');
  slotsDiv.innerHTML = '';
  
  timeSlots.forEach(time => {
    const slot = document.createElement('button');
    slot.className = 'slot';
    slot.textContent = time;
    slot.onclick = () => selectTime(time, slot);
    
    if (selectedTime === time) {
      slot.classList.add('selected');
    }
    
    slotsDiv.appendChild(slot);
  });
}

// Select time
function selectTime(time, button) {
  selectedTime = time;
  
  // Update selected slot styling
  document.querySelectorAll('.slot').forEach(slot => {
    slot.classList.remove('selected');
  });
  button.classList.add('selected');
  
  // Show summary
  updateSummary();
}

// Update summary
function updateSummary() {
  if (selectedDate && selectedTime) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = selectedDate.toLocaleDateString('en-US', options);
    
    document.getElementById('summaryDate').textContent = dateStr;
    document.getElementById('summaryTime').textContent = selectedTime;
    document.getElementById('summary').classList.add('show');
  } else {
    document.getElementById('summary').classList.remove('show');
  }
}

// Update UI
function updateUI() {
  updateMonthDisplay();
  renderCalendar();
  
  if (selectedDate) {
    document.getElementById('slotDate').textContent = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    document.getElementById('slotsSection').classList.add('show');
    renderTimeSlots();
  } else {
    document.getElementById('slotsSection').classList.remove('show');
    document.getElementById('summary').classList.remove('show');
  }
}

// Proceed to checkout
function proceedToCheckout() {
  if (selectedDate && selectedTime) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = selectedDate.toLocaleDateString('en-US', options);
    
    alert(`Appointment Details:\n\nDate: ${dateStr}\nTime: ${selectedTime}\nFee: ₦20,000\n\nProceeding to payment...`);
    
    // Here you would integrate with a payment gateway like Paystack, Flutterwave, etc.
    // Example: window.location.href = 'https://paystack.com/...';
    console.log('Checkout:', { date: dateStr, time: selectedTime });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCalendar);