// Mobile Navigation Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = menuToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Copy Rekening Number Function
function copyRekening(event) {
    const rekeningNumber = document.getElementById('rekeningNumber').textContent;
    // Remove hyphens/dashes from the number
    const cleanNumber = rekeningNumber.replace(/-/g, '');
    
    // Copy to clipboard
    navigator.clipboard.writeText(cleanNumber).then(() => {
        // Show success notification
        showNotification('✓ Nomor rekening berhasil dicopy!');
        
        // Change button text temporarily
        const copyBtn = event.target.closest('.copy-btn');
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = '#4CAF50';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
        showNotification('Gagal copy nomor rekening');
    });
}

// Scroll to booking function
function scrollToBooking() {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// City and District Cascade Data
const cityDistrictData = {
    'Jakarta Utara': [
        'Kec. Penjaringan',
        'Kec. Pademangan',
        'Kec. Tanjung Priok',
        'Kec. Koja',
        'Kec. Cilincing',
        'Kec. Kelapa Gading'
    ],
    'Jakarta Barat': [
        'Kec. Cengkareng',
        'Kec. Grogol Petamburan',
        'Kec. Taman Sari',
        'Kec. Tambora',
        'Kec. Kebon Jeruk',
        'Kec. Kembangan',
        'Kec. Kalideres',
        'Kec. Palmerah'
    ],
    'Jakarta Pusat': [
        'Kec. Gambir',
        'Kec. Tanah Abang',
        'Kec. Sawah Besar',
        'Kec. Kemayoran',
        'Kec. Senen',
        'Kec. Cempaka Putih',
        'Kec. Menteng',
        'Kec. Johar Baru'
    ],
    'Jakarta Timur': [
        'Kec. Matraman',
        'Kec. Jatinegara',
        'Kec. Pasar Rebo',
        'Kec. Kramat Jati',
        'Kec. Pulo Gadung',
        'Kec. Cakung',
        'Kec. Ciracas',
        'Kec. Cipayung',
        'Kec. Makasar',
        'Kec. Duren Sawit'
    ]
};

const citySelect = document.getElementById('city');
const districtSelect = document.getElementById('district');

if (citySelect && districtSelect) {
    citySelect.addEventListener('change', function() {
        const selectedCity = this.value;
        districtSelect.innerHTML = '<option value="">Pilih Kecamatan</option>';
        
        if (selectedCity && cityDistrictData[selectedCity]) {
            districtSelect.disabled = false;
            cityDistrictData[selectedCity].forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        } else {
            districtSelect.disabled = true;
            districtSelect.innerHTML = '<option value="">Pilih Kota Terlebih Dahulu</option>';
        }
    });
}

// Set minimum date for booking (today)
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
}

// Form submission handler
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const city = formData.get('city');
        const district = formData.get('district');
        const address = formData.get('address');
        const date = formData.get('date');
        const time = formData.get('time');
        const payment = formData.get('payment');
        
        // Format date for better readability
        const formattedDate = new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Create WhatsApp message with payment method info
        let paymentInfo = '';
        if (payment === 'Transfer Bank') {
            paymentInfo = `%0A%0A💳 *Info Transfer Bank:*%0ANo. Rek: 003-201-041859504%0Aa.n. Sururudin`;
        } else if (payment === 'QRIS') {
            paymentInfo = `%0A%0A📱 *Info QRIS:*%0ASilakan scan QRIS yang tersedia untuk pembayaran`;
        } else if (payment === 'Cash') {
            paymentInfo = `%0A%0A💵 *Pembayaran Cash:*%0ADibayar setelah layanan selesai`;
        }
        
        const message = `*Booking Baru - Fa3 Barbershop*%0A%0A` +
            `👤 *Nama:* ${name}%0A` +
            `📱 *Nomor HP:* ${phone}%0A` +
            `📍 *Kota:* ${city}%0A` +
            `📍 *Kecamatan:* ${district}%0A` +
            `🏠 *Alamat:* ${address}%0A` +
            `📅 *Tanggal:* ${formattedDate}%0A` +
            `⏰ *Jam:* ${time}%0A` +
            `💳 *Metode Pembayaran:* ${payment}` +
            paymentInfo +
            `%0A%0A💰 *Total Harga:* Rp40.000%0A%0A` +
            `Mohon konfirmasi ketersediaan jadwal. Terima kasih!`;
        
        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/6283812748477?text=${message}`;
        window.open(whatsappUrl, '_blank');
        
        // Optional: Show success message
        showNotification('Booking berhasil! Anda akan diarahkan ke WhatsApp untuk konfirmasi.');
        
        // Reset form after a delay
        setTimeout(() => {
            this.reset();
            // Reset date to today
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }, 2000);
    });
}

// Notification function
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #fff;
        color: #000;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.98)';
        header.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.9)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.8)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Add hover effect to service cards
document.querySelectorAll('.service-card, .feature-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Form validation
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const city = document.getElementById('city').value;
    const district = document.getElementById('district').value;
    const address = document.getElementById('address').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const payment = document.getElementById('payment').value;
    
    // Basic validation
    if (name.length < 3) {
        showNotification('Nama minimal 3 karakter');
        return false;
    }
    
    // Phone validation (Indonesian format)
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    if (!phoneRegex.test(phone.replace(/[-\s]/g, ''))) {
        showNotification('Format nomor HP tidak valid');
        return false;
    }
    
    if (!city) {
        showNotification('Pilih kota terlebih dahulu');
        return false;
    }
    
    if (!district) {
        showNotification('Pilih kecamatan terlebih dahulu');
        return false;
    }
    
    if (address.length < 10) {
        showNotification('Alamat minimal 10 karakter');
        return false;
    }
    
    if (!date) {
        showNotification('Pilih tanggal terlebih dahulu');
        return false;
    }
    
    if (!time) {
        showNotification('Pilih jam terlebih dahulu');
        return false;
    }
    
    if (!payment) {
        showNotification('Pilih metode pembayaran terlebih dahulu');
        return false;
    }
    
    return true;
}

// Add validation to form submission
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
        }
    });
}

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        // Remove all non-digit characters
        let value = this.value.replace(/\D/g, '');
        
        // Format Indonesian phone numbers
        if (value.startsWith('62')) {
            value = '+62 ' + value.substring(2);
        } else if (value.startsWith('0')) {
            value = '+62 ' + value.substring(1);
        } else if (value.length > 0 && !value.startsWith('+')) {
            value = '+62 ' + value;
        }
        
        this.value = value;
    });
}

// Add loading state to submit button
if (bookingForm) {
    bookingForm.addEventListener('submit', function() {
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Mengirim...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 3000);
    });
}