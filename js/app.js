document.addEventListener('DOMContentLoaded', () => {
	const menus = [...document.querySelectorAll('.has-submenu')];
	const closeMenus = () => menus.forEach((menu) => {
		menu.classList.remove('is-open');
		menu.querySelector('.submenu-toggle')?.setAttribute('aria-expanded', 'false');
	});

	menus.forEach((menu) => {
		const toggle = menu.querySelector('.submenu-toggle');
		toggle?.addEventListener('click', () => {
			const willOpen = !menu.classList.contains('is-open');
			closeMenus();
			menu.classList.toggle('is-open', willOpen);
			toggle.setAttribute('aria-expanded', String(willOpen));
		});
	});

	document.addEventListener('click', (event) => {
		if (!event.target.closest('.has-submenu')) closeMenus();
	});

	const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
	const programCards = [...document.querySelectorAll('.program-card')];
	const programSearch = document.querySelector('#program-search');
	const programResults = document.querySelector('#program-results');
	const updatePrograms = () => {
		const query = normalize(programSearch.value.trim());
		const visible = programCards.filter((card) => {
			const matches = normalize(card.textContent).includes(query);
			card.hidden = !matches;
			return matches;
		});
		programResults.textContent = `${visible.length} ${visible.length === 1 ? 'programa disponible' : 'programas disponibles'}`;
	};
	programSearch?.addEventListener('input', updatePrograms);
	if (programSearch) updatePrograms();

	const eventFilters = [...document.querySelectorAll('.filter-button')];
	const eventItems = [...document.querySelectorAll('.event-item')];
	const eventResults = document.querySelector('.event-results');
	eventFilters.forEach((filter) => filter.addEventListener('click', () => {
		const category = filter.dataset.filter;
		let visibleCount = 0;
		eventFilters.forEach((button) => {
			const selected = button === filter;
			button.classList.toggle('is-active', selected);
			button.setAttribute('aria-pressed', String(selected));
		});
		eventItems.forEach((item) => {
			item.hidden = category !== 'all' && item.dataset.category !== category;
			if (!item.hidden) visibleCount += 1;
		});
		eventResults.textContent = `${visibleCount} ${visibleCount === 1 ? 'actividad visible' : 'actividades visibles'}`;
	}));
	if (eventResults) eventResults.textContent = `${eventItems.length} actividades visibles`;

	const programInfo = {
		'Diseño y Programación Web': ['Desarrollo de aplicaciones web modernas, interfaces atractivas y soluciones digitales funcionales.', ['Desarrollo web', 'Diseño de interfaces', 'Duración: 3 años']],
		'Enfermería Técnica': ['Formación especializada para atender necesidades del sector salud con ética y responsabilidad.', ['Atención en salud', 'Práctica técnica', 'Duración: 3 años']],
		'Mecatrónica Automotriz': ['Especialización en sistemas automotrices, diagnóstico y mantenimiento tecnológico.', ['Diagnóstico automotriz', 'Mantenimiento', 'Duración: 3 años']],
		'Industrias Alimentarias': ['Procesamiento, control de calidad y seguridad en la producción de alimentos.', ['Procesamiento', 'Control de calidad', 'Duración: 3 años']],
		'Producción Agropecuaria': ['Gestión integral de producción agrícola y pecuaria con enfoque sostenible.', ['Producción agrícola', 'Manejo pecuario', 'Duración: 3 años']]
	};
	const programModal = document.querySelector('#program-modal');
	let modalOpener;
	document.querySelectorAll('.program-detail').forEach((button) => button.addEventListener('click', () => {
		const name = button.dataset.program;
		const [description, highlights] = programInfo[name];
		programModal.querySelector('#modal-title').textContent = name;
		programModal.querySelector('.modal-content > p').textContent = description;
		const highlightList = programModal.querySelector('.modal-highlights');
		highlightList.replaceChildren(...highlights.map((text) => {
			const item = document.createElement('span');
			item.textContent = text;
			return item;
		}));
		modalOpener = button;
		programModal.hidden = false;
		programModal.querySelector('.modal-close').focus();
	}));
	programModal?.querySelectorAll('[data-close-modal]').forEach((control) => control.addEventListener('click', () => {
		programModal.hidden = true;
		modalOpener?.focus();
	}));

	const lightbox = document.querySelector('#gallery-lightbox');
	const lightboxImage = lightbox?.querySelector('img');
	let galleryOpener;
	document.querySelectorAll('.gallery-item').forEach((button) => button.addEventListener('click', () => {
		const image = button.querySelector('img');
		lightboxImage.src = image.src;
		lightboxImage.alt = image.alt;
		galleryOpener = button;
		lightbox.hidden = false;
		lightbox.querySelector('.lightbox-close').focus();
	}));
	const closeLightbox = () => {
		lightbox.hidden = true;
		galleryOpener?.focus();
	};
	lightbox?.querySelector('[data-close-lightbox]')?.addEventListener('click', closeLightbox);
	lightbox?.addEventListener('click', (event) => {
		if (event.target === lightbox) closeLightbox();
	});

	document.addEventListener('keydown', (event) => {
		if (event.key !== 'Escape') return;
		closeMenus();
		if (programModal && !programModal.hidden) {
			programModal.hidden = true;
			modalOpener?.focus();
		}
		if (lightbox && !lightbox.hidden) closeLightbox();
	});

	document.querySelectorAll('.faq-list details').forEach((detail) => detail.addEventListener('toggle', () => {
		if (detail.open) document.querySelectorAll('.faq-list details').forEach((other) => {
			if (other !== detail) other.open = false;
		});
	}));

	const contactForm = document.querySelector('.contact-form');
	contactForm?.addEventListener('submit', (event) => {
		event.preventDefault();
		if (!contactForm.reportValidity()) return;
		const data = new FormData(contactForm);
		const subject = `Consulta web de ${data.get('nombre')}`;
		const body = `Nombre: ${data.get('nombre')}\nCorreo: ${data.get('correo')}\n\n${data.get('mensaje')}`;
		contactForm.querySelector('.form-feedback').textContent = 'Abriendo tu aplicación de correo para completar el envío.';
		window.location.href = `mailto:admision@iestphuanta.edu.pe?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
	});

	const backToTop = document.querySelector('.back-to-top');
	const updateBackToTop = () => backToTop?.classList.toggle('is-visible', window.scrollY > 500);
	window.addEventListener('scroll', updateBackToTop, { passive: true });
	updateBackToTop();
	backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
