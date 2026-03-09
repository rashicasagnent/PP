document.addEventListener('DOMContentLoaded', function() {
    console.log('Reviews script loaded');
    const reviewTextarea = document.getElementById('textarea');
    const submitReviewButton = document.getElementById('submit-review');
    const displayReviewsSection = document.getElementById('display-reviews');

    console.log('Review elements found:', { reviewTextarea, submitReviewButton, displayReviewsSection });

    // Function to load reviews from Local Storage (if any)
    function loadReviews() {
        const storedReviews = JSON.parse(localStorage.getItem('productReviews')) || [];
        console.log('Loading reviews:', storedReviews);
        storedReviews.forEach(review => addReviewToDisplay(review, false)); // Don't save again
    }

    // Function to add a review to the display area
    function addReviewToDisplay(reviewText, save = true) {
        console.log('Adding review:', reviewText, 'Save:', save);
        
        if (reviewText.trim() === "") {
            alert("Please write something before submitting your review!");
            return;
        }

        const reviewWrapper = document.createElement('div');
        reviewWrapper.classList.add('user-review-item'); // Add a class for styling

        const reviewContent = document.createElement('p');
        reviewContent.textContent = reviewText;

        const reviewMeta = document.createElement('span');
        // Get current date and time for the review timestamp
        const now = new Date();
        const dateTimeString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
        // You could add a "user name" input field to make this dynamic
        reviewMeta.textContent = `Posted by Anonymous on ${dateTimeString}`; // Placeholder user

        reviewWrapper.appendChild(reviewContent);
        reviewWrapper.appendChild(reviewMeta);

        // Add the new review to the top of the display section
        // To show latest reviews first, use insertAdjacentElement
        if (displayReviewsSection) {
            // Hide the placeholder text if it exists
            const placeholder = displayReviewsSection.querySelector('p');
            if (placeholder && placeholder.textContent.includes('No reviews yet')) {
                placeholder.style.display = 'none';
            }
            
            displayReviewsSection.prepend(reviewWrapper);
            console.log('Review added to display');
        } else {
            console.error('Display reviews section not found');
        }

        // Optional: Save to Local Storage (client-side persistence)
        if (save) {
            let storedReviews = JSON.parse(localStorage.getItem('productReviews')) || [];
            storedReviews.unshift(reviewText); // Add to the beginning of the array
            localStorage.setItem('productReviews', JSON.stringify(storedReviews));
        }

        // Clear the textarea after submission
        reviewTextarea.value = '';
    }

    // Event listener for the submit button
    if (submitReviewButton) {
        submitReviewButton.addEventListener('click', function() {
            console.log('Submit button clicked');
            const review = reviewTextarea.value;
            console.log('Review text:', review);
            addReviewToDisplay(review);
        });
    } else {
        console.error('Submit review button not found');
    }

    // Load reviews when the page loads
    loadReviews();
});