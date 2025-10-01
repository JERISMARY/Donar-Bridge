// DOM Elements
const donorName = document.getElementById('donorName');
const donorBlood = document.getElementById('donorBlood');
const donorLocation = document.getElementById('donorLocation');
const donorEmail = document.getElementById('donorEmail');
const donorPhone = document.getElementById('donorPhone');
const lastDonation = document.getElementById('lastDonation');
const registerBtn = document.getElementById('registerBtn');

const reqBlood = document.getElementById('reqBlood');
const reqLocation = document.getElementById('reqLocation');
const requestBtn = document.getElementById('requestBtn');

const donorCards = document.getElementById('donorCards');

// Load donors from localStorage
let donors = JSON.parse(localStorage.getItem('donors')) || [];

// Register Donor
registerBtn.addEventListener('click', () => {
    if (!donorName.value || !donorBlood.value || !donorLocation.value || !donorEmail.value || !donorPhone.value || !lastDonation.value) {
        alert("Please fill all fields");
        return;
    }

    const donor = {
        id: Date.now(), // unique ID
        name: donorName.value,
        blood: donorBlood.value.toUpperCase(),
        location: donorLocation.value.toLowerCase(),
        email: donorEmail.value,
        phone: donorPhone.value,
        lastDonation: lastDonation.value,
        verified: Math.random() > 0.3  // 70% verified
    };

    donors.push(donor);
    localStorage.setItem('donors', JSON.stringify(donors));

    donorName.value = donorBlood.value = donorLocation.value = donorEmail.value = donorPhone.value = lastDonation.value = '';
    alert("Donor Registered Successfully!");
});

// Request Blood
requestBtn.addEventListener('click', () => {
    donorCards.innerHTML = '';
    const bloodType = reqBlood.value.toUpperCase();
    const location = reqLocation.value.toLowerCase();

    // Filter by blood type & partial match for city/village
    const filteredDonors = donors.filter(d => 
        d.blood === bloodType && 
        d.location.includes(location) && 
        d.verified
    );

    if (filteredDonors.length === 0) {
        donorCards.innerHTML = `<p>No verified donors found nearby.</p>`;
        return;
    }

    filteredDonors.forEach(d => {
        const lastDonationDate = new Date(d.lastDonation);
        const today = new Date();
        const diffMonths = (today - lastDonationDate)/(1000*60*60*24*30);

        let cardClass = 'verified';
        let statusBadge = '';
        if(diffMonths < 1){
            cardClass = 'recent-donation';
            statusBadge = 'Donated <1 month ago';
        }

        const card = document.createElement('div');
        card.classList.add('card', cardClass);
        card.innerHTML = `
            <h3>${d.name}</h3>
            <p>Blood: ${d.blood}</p>
            <p>Location: ${d.location}</p>
            <span class="status-badge">${statusBadge}</span>
            <button onclick="toggleContact(${d.id})">Contact Info</button>
            <div class="contact-info" id="contact-${d.id}" style="display:none"></div>
        `;
        donorCards.appendChild(card);
    });
});

// Show/Hide Contact Info
window.toggleContact = function(id){
    const infoDiv = document.getElementById(`contact-${id}`);
    if(infoDiv.style.display === 'none'){
        const donorInfo = donors.find(d => d.id === id);
        infoDiv.innerHTML = `
            📧 Email: ${donorInfo.email}<br>
            📞 Phone: ${donorInfo.phone}<br>
            🩸 Last Donation: ${new Date(donorInfo.lastDonation).toDateString()}<br>
            📍 Location: ${donorInfo.location}
        `;
        infoDiv.style.display = 'block';
    } else {
        infoDiv.style.display = 'none';
    }
}