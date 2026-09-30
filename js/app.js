document.addEventListener('DOMContentLoaded', () => {
	const menus = document.querySelectorAll('.has-submenu');

	const closeMenus = () => {
		menus.forEach((menu) => {
			menu.classList.remove('is-open');
			menu.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
		});
	};

	menus.forEach((menu) => {
		const trigger = menu.querySelector(':scope > a');
		if (!trigger) return;

		trigger.addEventListener('click', (event) => {
			event.preventDefault();
			const willOpen = !menu.classList.contains('is-open');
			closeMenus();
			menu.classList.toggle('is-open', willOpen);
			trigger.setAttribute('aria-expanded', String(willOpen));
		});
	});

	document.addEventListener('click', (event) => {
		if (!event.target.closest('.has-submenu')) closeMenus();
	});
});
