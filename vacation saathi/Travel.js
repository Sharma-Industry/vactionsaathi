document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const modal = document.getElementById('review-modal');
    const closeBtn = document.querySelector('.close');
    const reviewForm = document.getElementById('review-form');
    const sortSelect = document.getElementById('sort-reviews');
    
    // Store reviews in localStorage
    let reviews = JSON.parse(localStorage.getItem('destination-reviews')) || {};
    
    // Show modal
    window.showReviewForm = function(destinationId) {
        modal.style.display = 'block';
        reviewForm.dataset.destinationId = destinationId;
    };
    
    // Close modal
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // Handle star rating selection
    const ratingStars = document.querySelectorAll('.rating-input i');
    let selectedRating = 0;
    
    ratingStars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = this.dataset.rating;
            highlightStars(rating);
        });
        
        star.addEventListener('mouseout', function() {
            highlightStars(selectedRating);
        });
        
        star.addEventListener('click', function() {
            selectedRating = this.dataset.rating;
            highlightStars(selectedRating);
        });
    });
    
    function highlightStars(rating) {
        ratingStars.forEach(star => {
            const starRating = star.dataset.rating;
            if (starRating <= rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    
    // Handle review submission
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const destinationId = this.dataset.destinationId;
        const formData = new FormData(this);
        
        const review = {
            name: formData.get('name'),
            rating: selectedRating,
            text: formData.get('review'),
            date: new Date().toISOString()
        };
        
        // Save review
        if (!reviews[destinationId]) {
            reviews[destinationId] = [];
        }
        reviews[destinationId].push(review);
        localStorage.setItem('destination-reviews', JSON.stringify(reviews));
        
        // Update UI
        updateReviewsDisplay(destinationId);
        
        // Reset and close form
        this.reset();
        selectedRating = 0;
        highlightStars(0);
        modal.style.display = 'none';
        
        // Show success message
        alert('Thank you for your review!');
    });
    
    // Sort reviews
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const reviewsArray = Object.values(reviews).flat();

        switch(sortValue) {
            case 'recent':
                reviewsArray.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'rating-high':
                reviewsArray.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating-low':
                reviewsArray.sort((a, b) => a.rating - b.rating);
                break;
        }
        displaySortedReviews(reviewsArray);
    });

    function displaySortedReviews(reviewsArray) {
        const reviewsGrid = document.querySelector('.reviews-grid');
        reviewsGrid.innerHTML = '';
        
        reviewsArray.forEach(review => {
            const reviewElement = createReviewElement(review);
            reviewsGrid.appendChild(reviewElement);
        });
    }
    function createReviewElement(review) {
        const div = document.createElement('div');
        div.className = 'review-item';
        div.innerHTML = `
            <div class="review-header">
                <span class="reviewer">${review.name}</span>
                <div class="review-stars">
                    ${getStarRating(review.rating)}
                </div>
            </div>
            <p>${review.text}</p>
            <small>${new Date(review.date).toLocaleDateString()}</small>
        `;
        return div;
    }
    function getStarRating(rating) {
        return Array(5).fill('').map((_, i) => 
            `<i class="fas fa-star${i < rating ? '' : ' inactive'}"></i>`
        ).join('');
    }
    // Initialize reviews display
    function initializeReviews() {
        Object.keys(reviews).forEach(destinationId => {
            updateReviewsDisplay(destinationId);
        });
    }
    initializeReviews();
});

// Destination prices per night
const destinationPrices = {
    lucerne: 350,
    paris: 320,
    moscow: 300,
    bali: 275,
    london: 300,
    dubai: 285
};

// Get destination from URL and set dropdown
const urlParams = new URLSearchParams(window.location.search);
const selectedDestination = urlParams.get("destination");
if (selectedDestination) {
    document.getElementById("destination").value = selectedDestination.toLowerCase();
}

// Pricing Elements
const basePriceEl = document.getElementById("base-price");
const taxesEl = document.getElementById("taxes");
const totalPriceEl = document.getElementById("total-price");

// Form Inputs
const checkinInput = document.querySelector('input[name="checkin"]');
const checkoutInput = document.querySelector('input[name="checkout"]');
const travelersInput = document.querySelector('input[name="travelers"]');
const destinationInput = document.getElementById("destination");

function calculatePrice() {
    const checkinDate = new Date(checkinInput.value);
    const checkoutDate = new Date(checkoutInput.value);
    const travelers = parseInt(travelersInput.value) || 1;
    const destination = destinationInput.value;

    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));

    if (nights > 0 && destinationPrices[destination]) {
        const basePricePerNight = destinationPrices[destination];
        const basePrice = basePricePerNight * nights * travelers;
        const taxRate = 0.1;
        const taxes = basePrice * taxRate;
        const total = basePrice + taxes;

        basePriceEl.textContent = `$${basePrice.toFixed(2)}`;
        taxesEl.textContent = `$${taxes.toFixed(2)}`;
        totalPriceEl.textContent = `$${total.toFixed(2)}`;
        generateQRCode(total);

    } else {
        basePriceEl.textContent = "$0";
        taxesEl.textContent = "$0";
        totalPriceEl.textContent = "$0";
    }
}

// Event Listeners
checkinInput.addEventListener("change", calculatePrice);
checkoutInput.addEventListener("change", calculatePrice);
travelersInput.addEventListener("input", calculatePrice);
destinationInput.addEventListener("change", calculatePrice);

// Auto recalculate if destination pre-filled
window.addEventListener("load", () => {
    if (checkinInput.value && checkoutInput.value) calculatePrice();
});


//store kar na ka laye
document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const newBooking = {
        name: this.name.value,
        email: this.email.value,
        checkin: this.checkin.value,
        checkout: this.checkout.value,
        travelers: this.travelers.value,
        destination: selectedDestination,
        requests: this.requests.value,
        basePrice: document.getElementById('base-price').textContent,
        taxes: document.getElementById('taxes').textContent,
        totalPrice: document.getElementById('total-price').textContent,
        date: new Date().toISOString()
    };

    // Get existing bookings or initialize empty array
    let allBookings = JSON.parse(localStorage.getItem('allBookings')) || [];

    // Limit to last 100
    if (allBookings.length >= 100) {
        allBookings.shift(); // remove oldest
    }

    // Add new booking
    allBookings.push(newBooking);

    // Save back to localStorage
    localStorage.setItem('allBookings', JSON.stringify(allBookings));

    alert("Booking confirmed! Data saved locally.");

    this.reset();
    window.location.href = "Travel.html"; // redirect to see all
});

localStorage.setItem('loggedInEmail', email); // Save login email
localStorage.removeItem('loggedInEmail');

 // logout ka lie
 function logout() {
    // Clear login state
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
  
    // Redirect to login page
    window.location.href = "login.html";
  }
// Add this at the top of protected pages
if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "login.html";
  }
    