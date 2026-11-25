document.addEventListener('DOMContentLoaded', function() {

// Gallery data - You can add more items here

const galleryItems = [

{

image: 'gallery1.jpg',

description: 'Handcrafted Dining Table'

},

{

image: 'gallery2.jpg',

description: 'Vintage Wooden Bookshelf'

},

{

image: 'gallery3.jpg',

description: 'Custom Coffee Table'

},

{

image: 'gallery4.jpg',

description: 'Wooden Bed Frame'

},

{

image: 'gallery5.jpg',

description: 'Artisan Wooden Chair'

},

{

image: 'gallery6.jpg',

description: 'Decorative Wall Shelf'

},

{

image: 'gallery7.jpg',

description: 'Custom Cabinet'

},

{

image: 'gallery8.jpg',

description: 'Hand-carved Wooden Bowl'

}

];

// Function to populate gallery

function populateGallery() {

const galleryGrid = document.getElementById('gallery-grid');

galleryItems.forEach(item => {

const galleryItem = document.createElement('div');

galleryItem.className = 'gallery-item';

galleryItem.innerHTML =

<img src="
i
t
e
m
.
i
m
a
g
e
"
a
l
t
=
"
item.image"alt="{item.description}" class="gallery-image" onerror="this.src='placeholder-image.jpg'">

<div class="gallery-description">${item.description}</div>

;

galleryGrid.appendChild(galleryItem);

});

}

// Initialize gallery

populateGallery();

// Smooth scrolling for navigation links

document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {

anchor.addEventListener('click', function (e) {

e.preventDefault();

const target = document.querySelector(this.getAttribute('href'));

if (target) {

window.scrollTo({

top: target.offsetTop - 80,

behavior: 'smooth'

});

}

});

});

// Add scroll animation to sections

const sections = document.querySelectorAll('section');

const observerOptions = {

root: null,

rootMargin: '0px',

threshold: 0.1

};

const observer = new IntersectionObserver((entries) => {

entries.forEach(entry => {

if (entry.isIntersecting) {

entry.target.style.opacity = 1;

entry.target.style.transform = 'translateY(0)';

}

});

}, observerOptions);

sections.forEach(section => {

section.style.opacity = 0;

section.style.transform = 'translateY(20px)';

section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

observer.observe(section);

});

// Add hover effect to workshop image

const workshopImage = document.getElementById('workshop-image');

if (workshopImage) {

workshopImage.addEventListener('mouseenter', function() {

this.style.transform = 'scale(1.02)';

});

workshopImage.addEventListener('mouseleave', function() {

this.style.transform = 'scale(1)';

});

}

// Add click effect to gallery items

const galleryItemsElements = document.querySelectorAll('.gallery-item');

galleryItemsElements.forEach(item => {

item.addEventListener('click', function() {

this.style.transform = 'scale(0.95)';

setTimeout(() => {

this.style.transform = '';

}, 200);

});

});

// Add animation to header on page load

const header = document.querySelector('header');

if (header) {

header.style.opacity = 0;

header.style.transform = 'translateY(-20px)';

setTimeout(() => {

header.style.transition = 'opacity 1s ease, transform 1s ease';

header.style.opacity = 1;

header.style.transform = 'translateY(0)';

}, 100);

}

// Add keyboard navigation support

document.addEventListener('keydown', function(e) {

if (e.key === 'Escape') {

// Close any open modals or reset animations

document.querySelectorAll('.gallery-item').forEach(item => {

item.style.transform = '';

});

}

});

// Responsive behavior for small screens

function handleResize() {

const galleryGrid = document.getElementById('gallery-grid');

if (window.innerWidth < 768) {

galleryGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';

} else {

galleryGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';

}

}

// Initial resize handling

handleResize();

// Add event listener for window resize

window.addEventListener('resize', handleResize);

// Simulate loading delay for better UX

setTimeout(() => {

document.body.style.opacity = 1;

}, 300);

});")]