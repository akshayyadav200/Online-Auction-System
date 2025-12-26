// Handle form submission
document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);

    // Create an object from the form data
    const productDetails = {
        title: formData.get('productTitle'),
        description: formData.get('productDescription'),
        category: formData.get('productCategory'),
        price: formData.get('startingPrice'),
        image: formData.get('productImage'), // This will be a file
        auctionStart: formData.get('auctionStartTime'),
        auctionEnd: formData.get('auctionEndTime')
    };

    // Display the collected data (for demo purposes)
    console.log('Product Details:', productDetails);

    // You can submit the data to the server or handle it as needed
    alert('Product added to auction!');
    
    // Reset form after submission
    event.target.reset();
});