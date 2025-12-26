
//for bidding
function placeBid(itemId, currentBid) {
    const bidInput = document.getElementById(`bidInput${itemId}`);
    const newBid = parseFloat(bidInput.value);
  
    if (newBid > currentBid) {
        document.getElementById(`bid${itemId}`).innerText = newBid;
        alert('Bid placed successfully!');
    } else {
        alert('Bid must be higher than the current bid.');
    }
  }
  
   // Search Functionality
   function search() {
   let input = document.getElementById('search-input').value.toLowerCase();
   let auctionItems = document.getElementsByClassName('auction-item');
    
        // Loop through the auction items and hide those that don't match the search 
   input
   for (let i = 0; i < auctionItems.length; i++) {
    let item = auctionItems[i];
     let itemName = item.getElementsByTagName('h3')
      [0].textContent.toLowerCase();
            
        if (itemName.indexOf(input) > -1) {
               item.style.display = '';  // Show item
            } else {
              item.style.display = 'none';  // Hide item
            }
     }        
  }
  
  // Function to filter products based on the selected category
  function filterProducts() {
    const category = document.getElementById('category').value;
    const products = document.querySelectorAll('.auction-item');  // Get all product divs
  
    products.forEach(product => {
        // Get the category of each product from the data-category attribute
        const productCategory = product.getAttribute('data-category');
  
        // If the selected category is 'all' or the product matches the selected category
        if (category === 'all' || productCategory === category) {
            product.style.display = 'block';  // Show the product
        } else {
            product.style.display = 'none';  // Hide the product
        }
    });
  }
       
let bids = [
  { id: 1, bidders: [] },
  { id: 2, bidders: [] },
  { id: 3, bidders: [] },
  { id: 4, bidders: [] },
];

function placeBid(itemId, currentBid) {
  const bidInput = document.getElementById(`bidInput${itemId}`);
  const newBid = parseInt(bidInput.value, 10);
  const bidDisplay = document.getElementById(`bid${itemId}`);
  const biddersList = document.getElementById(`bidders${itemId}`);

  if (isNaN(newBid) || newBid <= currentBid) {
    alert('Please enter a bid higher than the current bid.');
    return;
  }

  const bidderName = prompt('Please enter your name:');
  if (!bidderName) {
    alert('Bidder name is required.');
    return;
  }

  // Update current bid
  bidDisplay.textContent = newBid;

  // Update the bids data
  const bidIndex = bids.findIndex(bid => bid.id === itemId);
  bids[bidIndex].bidders.push({ name: bidderName, amount: newBid });

  // Update the UI
  const listItem = document.createElement('li');
  listItem.textContent = `${bidderName}: Rs ${newBid}`;
  biddersList.appendChild(listItem);

  bidInput.value = ''; // Clear the input field
}

function adjustTimer(itemId) {
  const reduceHours = parseInt(prompt(`Enter the number of hours to subtract for Item ${itemId}:`), 10);
  const reduceMinutes = parseInt(prompt(`Enter the number of minutes to subtract for Item ${itemId}:`), 10);

  if (
    (isNaN(reduceHours) || reduceHours < 0) ||
    (isNaN(reduceMinutes) || reduceMinutes < 0 || reduceMinutes >= 60)
  ) {
    alert('Please enter valid hours (>= 0) and minutes (0-59).');
    return;
  }

  const totalSeconds = reduceHours * 3600 + reduceMinutes * 60;
  const timerData = timersData.find(timer => timer.id === itemId);

  if (timerData) {
    timerData.remainingTime -= totalSeconds;

    if (timerData.remainingTime < 0) {
      timerData.remainingTime = 0; // Ensure it doesn't go negative
    }

    alert(`Timer for item ${itemId} has been decreased by ${reduceHours} hours and ${reduceMinutes} minutes.`);
  }
}

function startTimers() {
  timersData.forEach(timerData => {
    const timerElement = document.querySelector(`#item${timerData.id} .time`);

    function updateTimer() {
      if (timerData.remainingTime > 0) {
        const hours = Math.floor(timerData.remainingTime / 3600);
        const minutes = Math.floor((timerData.remainingTime % 3600) / 60);
        const seconds = timerData.remainingTime % 60;

        timerElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
        timerData.remainingTime--;
      } else {
        clearInterval(timerData.intervalId);
        timerElement.textContent = "Auction Ended";
        handleAuctionEnd(timerData.id);
      }
    }

    // Start the timer interval
    timerData.intervalId = setInterval(updateTimer, 1000);
    updateTimer(); // Initialize immediately
  });
}

function handleAuctionEnd(itemId) {
  const timerData = timersData.find(timer => timer.id === itemId);
  if (timerData.highestBidder) {
    alert(`The product is sold to ${timerData.highestBidder} for Rs ${timerData.highestBid}`);
  } else {
    alert('No bids were placed for this product.');
  }
}

// Auction data with initial settings
let timersData = [
  { id: 1, remainingTime: 24 * 60 * 60, highestBidder: null, highestBid: 2000, intervalId: null },
  { id: 2, remainingTime: 24 * 60 * 60, highestBidder: null, highestBid: 200000, intervalId: null },
  { id: 3, remainingTime: 24 * 60 * 60, highestBidder: null, highestBid: 600000, intervalId: null },
  { id: 4, remainingTime: 24 * 60 * 60, highestBidder: null, highestBid: 200000, intervalId: null },
  
];

// Start all timers
function startTimers() {
  timersData.forEach(timerData => {
    const timerElement = document.querySelector(`#item${timerData.id} .time`);
    const bidInput = document.getElementById(`bidInput${timerData.id}`);
    const placeBidButton = document.querySelector(`#item${timerData.id} button[onclick*="placeBid"]`);
    const adjustTimerButton = document.querySelector(`#item${timerData.id} button[onclick*="adjustTimer"]`);

    if (!timerElement) {
      console.error(`Timer element not found for item${timerData.id}`);
      return;
    }

    function updateTimer() {
      if (timerData.remainingTime > 0) {
        const hours = Math.floor(timerData.remainingTime / 3600);
        const minutes = Math.floor((timerData.remainingTime % 3600) / 60);
        const seconds = timerData.remainingTime % 60;

        timerElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
        timerData.remainingTime--;
      } else {
        clearInterval(timerData.intervalId);
        timerElement.textContent = "Auction Ended";
        handleAuctionEnd(timerData.id);

        // Disable bid input and buttons
        bidInput.disabled = true;
        placeBidButton.disabled = true;
        adjustTimerButton.disabled = true;
      }
    }

    timerData.intervalId = setInterval(updateTimer, 1000);
    updateTimer(); // Initialize immediately
  });
}

// Place a bid on an auction item
function placeBid(itemId, basePrice) {
  const bidInput = document.getElementById(`bidInput${itemId}`);
  const bidValue = parseInt(bidInput.value, 10);

  if (isNaN(bidValue) || bidValue <= basePrice) {
    alert(`Please enter a bid greater than the current price (Rs ${basePrice}).`);
    return;
  }

  const bidderName = prompt("Enter your name:");
  if (!bidderName) {
    alert("You must enter your name to place a bid.");
    return;
  }

  const timerData = timersData.find(timer => timer.id === itemId);
  if (timerData && timerData.remainingTime > 0) {
    timerData.highestBid = bidValue;
    timerData.highestBidder = bidderName;

    document.getElementById(`bid${itemId}`).textContent = bidValue;

    const biddersList = document.getElementById(`bidders${itemId}`);
    const listItem = document.createElement("li");
    listItem.textContent = `${bidderName}: Rs ${bidValue}`;
    biddersList.appendChild(listItem);

    alert(`${bidderName} has placed a bid of Rs ${bidValue} on Item ${itemId}.`);
  } else {
    alert("The auction for this item has ended. No more bids are allowed.");
  }
}

// Adjust the timer by reducing hours and minutes
function adjustTimer(itemId) {
  const reduceHours = parseInt(prompt(`Enter the number of hours to subtract for Item ${itemId}:`), 10);
  const reduceMinutes = parseInt(prompt(`Enter the number of minutes to subtract for Item ${itemId}:`), 10);

  if (
    isNaN(reduceHours) || reduceHours < 0 ||
    isNaN(reduceMinutes) || reduceMinutes < 0 || reduceMinutes >= 60
  ) {
    alert('Please enter valid hours (>= 0) and minutes (0-59).');
    return;
  }

  const totalSeconds = reduceHours * 3600 + reduceMinutes * 60;
  const timerData = timersData.find(timer => timer.id === itemId);

  if (timerData && timerData.remainingTime > 0) {
    timerData.remainingTime -= totalSeconds;

    if (timerData.remainingTime < 0) {
      timerData.remainingTime = 0; // Prevent negative time
    }

    alert(`Timer for item ${itemId} has been decreased by ${reduceHours} hours and ${reduceMinutes} minutes.`);
  } else {
    alert("The auction for this item has ended. Timer adjustment is not allowed.");
  }
}

// Handle the end of an auction
function handleAuctionEnd(itemId) {
  const timerData = timersData.find(timer => timer.id === itemId);
  if (timerData) {
    if (timerData.highestBidder) {
      alert(
        `Auction for Item ${itemId} has ended.\n` +
        `Winner: ${timerData.highestBidder}\n` +
        `Winning Bid: Rs ${timerData.highestBid}`
      );
    } else {
      alert(`Auction for Item ${itemId} has ended with no bids.`);
    }
  }
}

// Initialize timers
startTimers();







function placeBid(itemId, currentBid) {
  const bidInput = document.getElementById(`bidInput${itemId}`);
  const newBid = parseFloat(bidInput.value);
  const bidderName = prompt("Enter your name:");

  if (newBid > currentBid) {
      document.getElementById(`bid${itemId}`).innerText = newBid;
      const bidContainer = document.getElementById(`item${itemId}`).querySelector('.bid-container');
      let bidderInfo = bidContainer.querySelector('.bidder-info');
      if (!bidderInfo) {
          bidderInfo = document.createElement('p');
          bidderInfo.className = 'bidder-info';
          bidContainer.appendChild(bidderInfo);
      }
      bidderInfo.innerText = `Bidder: ${bidderName}`;
      alert('Bid placed successfully!');
  } else {
      alert('Bid must be higher than the current bid.');
  }
}

