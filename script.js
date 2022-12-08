'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
	e.preventDefault();
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

const closeModal = function () {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModal();
	}
});

// Styles
// getComputedStyle(message); // Returns all the styles for the element

// Button Scrolling
btnScrollTo.addEventListener('click', function (e) {
	const s1coords = section1.getBoundingClientRect();
	// console.log(s1coords);

	// console.log(e.target.getBoundingClientRect());

	// console.log('Current SCroll (X/Y)', window.pageXOffset, window.pageYOffset);

	// console.log(
	// 	'Height/Width viewport',
	// 	document.documentElement.clientHeight,
	// 	document.documentElement.clientWidth
	// );

	// // Scrolling

	// OLD SCHOOL WAY

	// window.scrollTo(
	// 	s1coords.left + window.pageXOffset,
	// 	s1coords.top + window.pageYOffset
	// );

	// window.scrollTo({
	// 	left: s1coords.left + window.pageXOffset,
	// 	top: s1coords.top + window.pageYOffset,
	// 	behavior: 'smooth',
	// });

	// MODERN WAY
	section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
// 	el.addEventListener('click', function (e) {
// 		e.preventDefault();
// 		const id = this.getAttribute('href');
// 		console.log(id);
// 		document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
// 	});
// });

// Using Event Delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
	e.preventDefault();

	// Matching Strategy
	if (e.target.classList.contains('nav__link')) {
		const id = e.target.getAttribute('href');
		document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
	}
});

// Tabbed Component

tabsContainer.addEventListener('click', function (e) {
	const clicked = e.target.closest('.operations__tab');
	console.log(clicked);

	// Guard clause
	if (!clicked) return; // Ignoring tabs outside buttons (Null tabs)

	// Remove Active class for both tabs and content
	tabs.forEach(t => t.classList.remove('operations__tab--active'));
	tabsContent.forEach(c => c.classList.remove('operations__content--active'));

	// Activate Tab
	clicked.classList.add('operations__tab--active');

	// Activate content area
	console.log(clicked.dataset.tab);
	document
		.querySelector(`.operations__content--${clicked.dataset.tab}`)
		.classList.add('operations__content--active');
});

// Menu fade animation

const handleHover = function (e) {
	if (e.target.classList.contains('nav__link')) {
		const link = e.target;
		const siblings = link.closest('.nav').querySelectorAll('.nav__link');
		const logo = link.closest('.nav').querySelector('img');

		siblings.forEach(el => {
			if (el !== link) el.style.opacity = this;
		});
		logo.style.opacity = this;
	}
};

// passing "argument" into handler
// nav.addEventListener('mouseover', function (e) {
// 	handleHover(e, 0.5);
// });

nav.addEventListener('mouseover', handleHover.bind(0.5));

// nav.addEventListener('mouseout', function (e) {
// 	handleHover(e, 1);
// });

nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky Navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
// 	if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
// 	else nav.classList.remove('sticky');
// });

// Sticky Navigation: Intersection Observer API
// const obsCallback = function (entries, observer) {
// 	entries.forEach(entry => console.log(entry));
// };

// const obsOptions = {
// 	root: null,
// 	threshold: [0, 0.2], // 0 => means the callback func will be called each time the target moves completely out of the view and also as soon as it enters the view
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
	const [entry] = entries; // equals entries[0]
	if (!entry.isIntersecting) {
		nav.classList.add('sticky');
	} else {
		nav.classList.remove('sticky');
	}
};

const headerObserver = new IntersectionObserver(stickyNav, {
	root: null,
	threshold: 0,
	rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal Section

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
	const [entry] = entries;

	if (!entry.isIntersecting) return;
	entry.target.classList.remove('section--hidden');

	observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
	root: null,
	threshold: 0.15,
});
allSections.forEach(function (section) {
	sectionObserver.observe(section);
	section.classList.add('section--hidden');
});

// Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
	const [entry] = entries;
	console.log(entry);

	if (!entry.isIntersecting) return;

	// Replace src with data-src
	entry.target.src = entry.target.dataset.src;
	// entry.target.classList.remove('lazy-img'); // bad practice , because if the network is slow the images are gonna take time to load so we should listen to the load event instead

	entry.target.addEventListener('load', function () {
		entry.target.classList.remove('lazy-img'); // now it will remove the lazy img class after the image is completely loaded
	});

	observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
	root: null,
	threshold: 0,
	rootMargin: '100px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider

const slider = function () {
	const slides = document.querySelectorAll('.slide');
	const btnLeft = document.querySelector('.slider__btn--left');
	const btnRight = document.querySelector('.slider__btn--right');
	const dotContainer = document.querySelector('.dots');

	let currentSlide = 0;
	const maxSlide = slides.length;

	const slider = document.querySelector('.slider');

	// Functions

	const createDots = function () {
		slides.forEach(function (_, i) {
			dotContainer.insertAdjacentHTML(
				'beforeend',
				`<button class="dots__dot" data-slide="${i}"></button>`
			);
		});
	};

	const activateDots = function (slide) {
		document
			.querySelectorAll('.dots__dot')
			.forEach(dot => dot.classList.remove('dots__dot--active'));

		document
			.querySelector(`.dots__dot[data-slide="${slide}"]`)
			.classList.add('dots__dot--active');
	};

	const goToSlide = function (slide) {
		slides.forEach(
			(s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
		);
	};

	// next slide

	const nextSlide = function () {
		currentSlide === maxSlide - 1 ? (currentSlide = 0) : currentSlide++;

		goToSlide(currentSlide);
		activateDots(currentSlide);
	};

	const prevSlide = function () {
		currentSlide === 0 ? (currentSlide = maxSlide - 1) : currentSlide--;
		goToSlide(currentSlide);
		activateDots(currentSlide);
	};

	const init = function () {
		goToSlide(0);
		createDots();
		activateDots(0);
	};
	init();

	// Event Handlers

	btnRight.addEventListener('click', nextSlide);
	btnLeft.addEventListener('click', prevSlide);

	document.addEventListener('keydown', function (e) {
		if (e.key === 'ArrowLeft') prevSlide();
		e.key === 'ArrowRight' && nextSlide();
	});

	dotContainer.addEventListener('click', function (e) {
		if (e.target.classList.contains('dots__dot')) {
			const slide = e.target.dataset.slide;
			goToSlide(slide);
			activateDots(slide);
		}
	});
};

slider();

//toggle hamburger

const hamMenu = document.querySelector('.hamburger');
const hiddenMenu = document.querySelector('.nav__links');

hamMenu.addEventListener('click', function () {
	if (document.querySelector('.nav').classList.contains('sticky')) {
		hiddenMenu.classList.toggle('active-sticky');
	} else {
		hiddenMenu.classList.toggle('active');
		if (hiddenMenu.classList.contains('active')) {
			hamMenu.classList.remove('fa-bars');
			hamMenu.classList.add('fa-xmark');
		} else {
			hamMenu.classList.add('fa-bars');
			hamMenu.classList.remove('fa-xmark');
		}
	}
});
///////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// Lessons

// const randomInt = (min, max) =>
// 	Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
// 	`rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// console.log(randomColor(0, 255));

// const h1 = document.querySelector('h1');

// // Going Downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes); // returns every thing including (Text , Comments, Elements)
// console.log(h1.children); // returns only the child elements
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // Going Upwards : Parents
// console.log(h1.parentNode); // same as childNodes
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// // Going sideways: Siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
// 	if (el !== h1) {
// 		el.style.transform = 'scale(0.5)';
// 	}
// });
