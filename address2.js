document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addressForm");

    // Handle form submission
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent form from submitting

        const fields = form.querySelectorAll("input, select");
        let isValid = true;

        // Clear previous error messages
        form.querySelectorAll(".error").forEach((error) => error.remove());

        fields.forEach((field) => {
            if (field.required && !field.value.trim()) {
                isValid = false;

                // Create error message
                const error = document.createElement("div");
                error.classList.add("error");
                error.textContent = "This field is required.";
                field.parentElement.appendChild(error);
            }
        });

        if (isValid) {
            alert("Address saved successfully!");
            form.reset();
            window.location.href = 'address2.html'; // Redirect to the next page
        }
    });

    // Country-to-state mapping
    const countryStateMapping = {
        "India": ["Andhra Pradesh", "Bihar", "Karnataka", "Maharashtra", "Tamil Nadu", "West Bengal"],
        "United States": ["California", "Florida", "New York", "Texas", "Washington"],
        "Canada": ["Alberta", "British Columbia", "Ontario", "Quebec", "Saskatchewan"],
        "Australia": ["New South Wales", "Queensland", "Victoria", "Western Australia", "Tasmania"]
    };

    // Dropdown elements
    const countrySelect = document.getElementById("country");
    const stateSelect = document.getElementById("state");

    // Update state dropdown when the country changes
    countrySelect.addEventListener("change", function () {
        const selectedCountry = countrySelect.value;

        // Clear previous state options
        stateSelect.innerHTML = '<option value="">Select your state</option>';

        if (selectedCountry && countryStateMapping[selectedCountry]) {
            // Populate states based on the selected country
            const states = countryStateMapping[selectedCountry];
            states.forEach(state => {
                const option = document.createElement("option");
                option.value = state;
                option.textContent = state;
                stateSelect.appendChild(option);
            });
        }
    });
});
