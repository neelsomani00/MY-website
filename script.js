document.addEventListener('DOMContentLoaded', () => {
    
    // --- FAQ Accordion Logic ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const currentItem = question.parentElement;
            
            // Close other open FAQ panels smoothly
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== currentItem) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle active status for the clicked item
            currentItem.classList.toggle('active');
        });
    });

    // --- Formspree AJAX Network Submission Logic ---
    const leadForm = document.getElementById('leadForm');
    const formStatus = document.getElementById('formStatus');

    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop the default page redirect/refresh

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const serviceType = document.getElementById('service-type').value;
            const message = document.getElementById('message').value.trim();

            // Safety double check for inputs
            if (!name || !email || !serviceType || !message) {
                displayStatus('Oops! Please complete all information fields before hitting submit.', 'error');
                return;
            }

            const submitBtn = leadForm.querySelector('.submit-btn');
            submitBtn.textContent = 'Processing Application...';
            submitBtn.disabled = true;

            // Bundle the data using the standard HTML names
            const formData = new FormData(leadForm);

            // Fetch request straight to your unique Formspree URL endpoint
            fetch('https://formspree.io/f/mredwqgg', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    displayStatus(`Success! Thank you ${name}. Your project review timeline has started. Look out for an email within 24 hours!`, 'success');
                    leadForm.reset(); // Wipe the form text fields blank
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            displayStatus(data["errors"].map(error => error["message"]).join(", "), 'error');
                        } else {
                            displayStatus("Oops! There was a problem submitting your form. Please try again.", 'error');
                        }
                    });
                }
            })
            .catch(error => {
                displayStatus("Network error! Please check your internet connection and try again.", 'error');
            })
            .finally(() => {
                // Return button to active state
                submitBtn.textContent = 'Request Free Strategy Call';
                submitBtn.disabled = false;
            });
        });
    }

    function displayStatus(msg, statusType) {
        formStatus.textContent = msg;
        formStatus.className = 'form-status'; 
        
        if (statusType === 'success') formStatus.classList.add('success');
        if (statusType === 'error') formStatus.classList.add('error');
        
        formStatus.classList.remove('hidden');
    }
});