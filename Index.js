// Carousel and Age Gate functionality for PamPowers
const teamMembers = [
    { name: "Rose", role: "Romance " },
    { name: "Alex Heart", role: "Lover" },
    { name: "Isabella Moon", role: "Relationship " },
    { name: "Alene Star", role: "Romantic Session" },
    { name: "Luna Valentine", role: "Connection" },
    { name: "Phoenix Love", role: "Soulmate" }
];

// Carousel functionality
const cards = document.querySelectorAll(".card");
const dots = document.querySelectorAll(".dot");
const memberName = document.querySelector(".member-name");
const memberRole = document.querySelector(".member-role");
const leftArrow = document.querySelector(".nav-arrow.left");
const rightArrow = document.querySelector(".nav-arrow.right");
let currentIndex = 0;
let isAnimating = false;

function updateCarousel(newIndex) {
    if (isAnimating) return;
    isAnimating = true;

    currentIndex = (newIndex + cards.length) % cards.length;

    cards.forEach((card, i) => {
        const offset = (i - currentIndex + cards.length) % cards.length;

        card.classList.remove(
            "center",
            "left-1",
            "left-2",
            "right-1",
            "right-2",
            "hidden"
        );

        if (offset === 0) {
            card.classList.add("center");
        } else if (offset === 1) {
            card.classList.add("right-1");
        } else if (offset === 2) {
            card.classList.add("right-2");
        } else if (offset === cards.length - 1) {
            card.classList.add("left-1");
        } else if (offset === cards.length - 2) {
            card.classList.add("left-2");
        } else {
            card.classList.add("hidden");
        }
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
    });

    if (memberName && memberRole) {
        memberName.style.opacity = "0";
        memberRole.style.opacity = "0";

        setTimeout(() => {
            memberName.textContent = teamMembers[currentIndex].name;
            memberRole.textContent = teamMembers[currentIndex].role;
            memberName.style.opacity = "1";
            memberRole.style.opacity = "1";
        }, 300);
    }

    setTimeout(() => {
        isAnimating = false;
    }, 800);
}

// Event listeners for carousel
if (leftArrow) {
    leftArrow.addEventListener("click", () => {
        updateCarousel(currentIndex - 1);
    });
}

if (rightArrow) {
    rightArrow.addEventListener("click", () => {
        updateCarousel(currentIndex + 1);
    });
}

dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
        updateCarousel(i);
    });
});

cards.forEach((card, i) => {
    card.addEventListener("click", () => {
        updateCarousel(i);
    });
    
    // Add click handler to go to payment screen
    card.addEventListener("dblclick", () => {
        const memberName = teamMembers[i].name;
        const memberRole = teamMembers[i].role;
        // Redirect to payment page with member info
        window.location.href = `pay.html?member=${encodeURIComponent(memberName)}&role=${encodeURIComponent(memberRole)}`;
    });
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        updateCarousel(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
        updateCarousel(currentIndex + 1);
    }
});

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            updateCarousel(currentIndex + 1);
        } else {
            updateCarousel(currentIndex - 1);
        }
    }
}

// Initialize carousel
updateCarousel(0);

// Age Gate functionality
function initAgeGate() {
    const overlay = document.getElementById('age-gate-overlay');
    const checkbox = document.getElementById('terms-checkbox');
    const enterButton = document.getElementById('enter-button');
    const exitButton = document.getElementById('exit-button');
    const container = document.querySelector('.container');

    console.log('Initializing age gate...', { overlay, checkbox, enterButton, exitButton });

    if (!overlay || !checkbox || !enterButton || !exitButton) {
        console.log('Age gate elements not found, retrying...');
        setTimeout(initAgeGate, 100);
        return;
    }

    // Check if user has already accepted terms
    const termsAccepted = localStorage.getItem('termsAccepted');
    if (termsAccepted === 'true') {
        console.log('Terms already accepted, hiding age gate');
        overlay.classList.add('hidden');
        if (container) container.classList.remove('blur');
        return;
    }

    console.log('Showing age gate');
    // Show the age gate
    overlay.classList.remove('hidden');
    if (container) container.classList.add('blur');

    // Enable checkbox after a short delay (simulating reading time)
    setTimeout(() => {
        console.log('Enabling checkbox');
        if (checkbox) {
            checkbox.disabled = false;
            checkbox.style.opacity = '1';
        }
    }, 2000);

    // Add event listener for checkbox change
    checkbox.addEventListener('change', function() {
        console.log('Checkbox changed:', this.checked);
        if (enterButton) {
            enterButton.disabled = !this.checked;
            if (this.checked) {
                enterButton.style.opacity = '1';
                enterButton.style.cursor = 'pointer';
                enterButton.style.backgroundColor = '#ec4899';
            } else {
                enterButton.style.opacity = '0.5';
                enterButton.style.cursor = 'not-allowed';
                enterButton.style.backgroundColor = '#6b7280';
            }
        }
    });

    // Add hover effects for enter button
    enterButton.addEventListener('mouseenter', function() {
        if (!this.disabled) {
            this.style.backgroundColor = '#db2777';
        }
    });
    
    enterButton.addEventListener('mouseleave', function() {
        if (!this.disabled) {
            this.style.backgroundColor = '#ec4899';
        }
    });

    enterButton.addEventListener('click', function() {
        console.log('Enter button clicked, checkbox checked:', checkbox.checked);
        if (checkbox.checked) {
            // Store that user has accepted terms
            localStorage.setItem('termsAccepted', 'true');
            overlay.classList.add('hidden');
            if (container) container.classList.remove('blur');
        } else {
            alert('Please accept the terms and conditions first.');
        }
    });

    exitButton.addEventListener('click', function() {
        console.log('Exit button clicked');
        // Redirect to Google
        window.location.href = 'https://www.google.com';
    });
}

// Initialize age gate when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAgeGate);
} else {
    initAgeGate();
}