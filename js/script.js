document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close mobile menu when clicking on a nav link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Booking form functionality
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        // Initialize form steps
        const formSteps = document.querySelectorAll('.form-step');
        const steps = document.querySelectorAll('.step');
        let currentStep = 0;

        // Show first step by default
        showStep(currentStep);

        // Next/Previous button functionality
        document.querySelectorAll('.next-step').forEach(button => {
            button.addEventListener('click', function() {
                const nextStep = parseInt(this.getAttribute('data-next')) - 1;
                if (validateStep(currentStep)) {
                    currentStep = nextStep;
                    showStep(currentStep);
                    updateStepIndicator();
                }
            });
        });

        document.querySelectorAll('.prev-step').forEach(button => {
            button.addEventListener('click', function() {
                const prevStep = parseInt(this.getAttribute('data-prev')) - 1;
                currentStep = prevStep;
                showStep(currentStep);
                updateStepIndicator();
            });
        });

        // Form submission
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateStep(currentStep)) {
                // Simulate form submission
                const formData = new FormData(bookingForm);
                const formValues = Object.fromEntries(formData.entries());
                
                // Show confirmation
                document.getElementById('confirm-service').textContent = formValues.service || 'Not specified';
                document.getElementById('confirm-doctor').textContent = formValues.doctor || 'Not specified';
                document.getElementById('confirm-date').textContent = formValues.date || 'Not specified';
                document.getElementById('confirm-time').textContent = formValues.time || 'Not specified';
                
                // Hide form and show confirmation
                bookingForm.style.display = 'none';
                document.getElementById('confirmation-message').style.display = 'block';
                
                // Scroll to confirmation
                document.getElementById('confirmation-message').scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Show current step
        function showStep(stepIndex) {
            formSteps.forEach((step, index) => {
                if (index === stepIndex) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
        }

        // Update step indicator
        function updateStepIndicator() {
            steps.forEach((step, index) => {
                if (index === currentStep) {
                    step.classList.add('active');
                } else if (index < currentStep) {
                    step.classList.remove('active');
                    step.classList.add('completed');
                } else {
                    step.classList.remove('active', 'completed');
                }
            });
        }

        // Validate current step
        function validateStep(stepIndex) {
            const currentFormStep = formSteps[stepIndex];
            const requiredFields = currentFormStep.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Add error message if not already present
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                        const errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'This field is required';
                        errorMessage.style.color = 'var(--error-color)';
                        errorMessage.style.fontSize = '0.875rem';
                        errorMessage.style.marginTop = '0.25rem';
                        field.parentNode.insertBefore(errorMessage, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    const errorMessage = field.nextElementSibling;
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                }
            });

            return isValid;
        }

        // Initialize calendar
        initializeCalendar();
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            let isValid = true;
            
            // Reset previous errors
            document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            
            // Validate name
            if (!name.value.trim()) {
                showError(name, 'Name is required');
                isValid = false;
            }
            
            // Validate email
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate message
            if (!message.value.trim()) {
                showError(message, 'Message is required');
                isValid = false;
            }
            
            if (isValid) {
                // Simulate form submission
                setTimeout(() => {
                    contactForm.reset();
                    const formSuccess = document.getElementById('formSuccess');
                    if (formSuccess) {
                        contactForm.style.display = 'none';
                        formSuccess.style.display = 'block';
                        formSuccess.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 500);
            }
            
            function showError(field, message) {
                field.classList.add('error');
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = message;
                errorMessage.style.color = 'var(--error-color)';
                errorMessage.style.fontSize = '0.875rem';
                errorMessage.style.marginTop = '0.25rem';
                field.parentNode.insertBefore(errorMessage, field.nextSibling);
            }
            
            function isValidEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
        });
    }

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = null;
                        }
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = null;
                }
            });
        });
    }

    // Initialize map if on contact page
    if (document.getElementById('map')) {
        initializeMap();
    }

    // Stats counter animation
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const stats = [
            { id: 'patients-count', target: 15000, duration: 2000 },
            { id: 'doctors-count', target: 25, duration: 2000 },
            { id: 'services-count', target: 50, duration: 2000 },
            { id: 'years-count', target: 15, duration: 2000 }
        ];

        let animated = false;

        window.addEventListener('scroll', function() {
            const statsPosition = statsSection.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (statsPosition < screenPosition && !animated) {
                animateStats();
                animated = true;
            }
        });

        function animateStats() {
            stats.forEach(stat => {
                const element = document.getElementById(stat.id);
                if (!element) return;

                const target = stat.target;
                const duration = stat.duration;
                const start = 0;
                const increment = target / (duration / 16); // 60fps
                let current = start;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        element.textContent = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.ceil(current).toLocaleString();
                    }
                }, 16);
            });
        }
    }
});

// Initialize calendar for booking
function initializeCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const timeSlots = document.getElementById('time-slots');
    
    if (!calendarDays || !currentMonthElement) return;
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Available time slots (in a real app, this would come from an API)
    const availableSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];
    
    // Render calendar
    function renderCalendar() {
        // Update month and year display
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Clear previous days
        calendarDays.innerHTML = '';
        
        // Get first day of month and total days in month
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        
        // Previous month's days
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day other-month';
            dayElement.textContent = daysInPrevMonth - i;
            calendarDays.appendChild(dayElement);
        }
        
        // Current month's days
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonthIndex = today.getMonth();
        const currentYearFull = today.getFullYear();
        
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            
            // Highlight today
            if (i === currentDay && currentMonth === currentMonthIndex && currentYear === currentYearFull) {
                dayElement.classList.add('today');
            }
            
            // Disable past days
            if (currentYear < currentYearFull || 
                (currentYear === currentYearFull && currentMonth < currentMonthIndex) ||
                (currentYear === currentYearFull && currentMonth === currentMonthIndex && i < currentDay)) {
                dayElement.classList.add('disabled');
            }
            
            dayElement.textContent = i;
            
            // Add click event for selecting a date
            if (!dayElement.classList.contains('disabled')) {
                dayElement.addEventListener('click', function() {
                    // Remove selected class from all days
                    document.querySelectorAll('.day').forEach(day => {
                        day.classList.remove('selected');
                    });
                    
                    // Add selected class to clicked day
                    this.classList.add('selected');
                    
                    // Update time slots
                    updateTimeSlots(i);
                });
            }
            
            calendarDays.appendChild(dayElement);
        }
        
        // Next month's days (to fill the last row)
        const totalDaysShown = firstDay + daysInMonth;
        const remainingDays = 7 - (totalDaysShown % 7);
        
        if (remainingDays < 7) {
            for (let i = 1; i <= remainingDays; i++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'day other-month';
                dayElement.textContent = i;
                calendarDays.appendChild(dayElement);
            }
        }
    }
    
    // Update time slots based on selected date
    function updateTimeSlots(day) {
        if (!timeSlots) return;
        
        // In a real app, you would fetch available time slots from an API
        // For this example, we'll use the predefined slots
        timeSlots.innerHTML = '';
        
        availableSlots.forEach(slot => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = slot;
            
            // Randomly mark some slots as unavailable (for demo purposes)
            if (Math.random() < 0.3) {
                timeSlot.classList.add('unavailable');
                timeSlot.title = 'This time slot is already booked';
            } else {
                timeSlot.addEventListener('click', function() {
                    // Remove selected class from all time slots
                    document.querySelectorAll('.time-slot').forEach(slot => {
                        slot.classList.remove('selected');
                    });
                    
                    // Add selected class to clicked time slot
                    this.classList.add('selected');
                    
                    // Update hidden input field (if needed)
                    const timeInput = document.getElementById('appointment-time');
                    if (timeInput) {
                        const selectedDate = new Date(currentYear, currentMonth, day);
                        const [time, period] = slot.split(' ');
                        let [hours, minutes] = time.split(':').map(Number);
                        
                        if (period === 'PM' && hours < 12) {
                            hours += 12;
                        } else if (period === 'AM' && hours === 12) {
                            hours = 0;
                        }
                        
                        selectedDate.setHours(hours, minutes, 0);
                        timeInput.value = selectedDate.toISOString();
                    }
                });
            }
            
            timeSlots.appendChild(timeSlot);
        });
    }
    
    // Event listeners for month navigation
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }
    
    // Initialize calendar
    renderCalendar();
}

// Initialize map for contact page
function initializeMap() {
    // In a real application, you would initialize a map here using a library like Leaflet or Google Maps
    // For this example, we'll just create a placeholder
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.innerHTML = `
            <div style="width: 100%; height: 100%; background-color: #f3f4f6; 
                        display: flex; align-items: center; justify-content: center;
                        border-radius: 8px; color: #6b7280;">
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-map-marker-alt" style="font-size: 3rem; margin-bottom: 1rem; color: #ef4444;"></i>
                    <h3 style="margin-bottom: 0.5rem;">Our Location</h3>
                    <p>123 Health Street, Medical District, NY 10001</p>
                    <p style="margin-top: 1rem;">[Interactive Map Would Be Here]</p>
                </div>
            </div>
        `;
    }
}
