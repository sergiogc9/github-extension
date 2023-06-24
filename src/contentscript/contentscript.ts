import Storage from '@html/lib/Storage';
import { Message } from '@html/types/Message';

import './contentscript.css';

type GithubThemeMode = 'light' | 'light_high_contrast' | 'dark' | 'dark_high_contrast' | 'dark_dimmed';
const detectGithubThemeMode = (): GithubThemeMode => {
	const savedLightMode = document.getElementsByTagName('html')[0]?.getAttribute('data-light-theme') as GithubThemeMode;
	const savedDarkMode = document.getElementsByTagName('html')[0]?.getAttribute('data-dark-theme') as GithubThemeMode;
	const savedMode = document.getElementsByTagName('html')[0]?.getAttribute('data-color-mode');

	if (savedMode === 'dark') return savedDarkMode;
	return savedLightMode ?? 'light';
};

const observeThemeModeChange = () => {
	const targetNode = document.getElementsByTagName('html')[0];
	const config = { attributes: true };

	// Callback function to execute when mutations are observed
	const callback = mutationsList => {
		let isThemeUpdated = false;
		mutationsList.forEach(mutation => {
			if (
				mutation.type === 'attributes' &&
				['data-light-theme', 'data-dark-theme', 'data-color-mode'].includes(mutation.attributeName) &&
				!isThemeUpdated
			) {
				isThemeUpdated = true;
				const mode = detectGithubThemeMode();
				Storage.set('github_theme_mode', mode);
				const nav = document.getElementById('githubExtensionNavIframe') as HTMLIFrameElement;
				// eslint-disable-next-line no-restricted-globals
				if (nav)
					nav.src = chrome.runtime.getURL(
						// eslint-disable-next-line no-restricted-globals
						`html/index.html?chromeUrl=${encodeURIComponent(location.href)}&themeMode=${mode}`
					);
			}
		});
	};

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);
};

let currentBodyClassChangeObserver: MutationObserver | undefined;
const observeBodyClassChange = () => {
	if (currentBodyClassChangeObserver) currentBodyClassChangeObserver.disconnect();
	const targetNode = document.getElementsByTagName('body')[0];
	const config = { attributes: true };

	// Callback function to execute when mutations are observed
	const callback = mutationsList => {
		mutationsList.forEach(mutation => {
			if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
				const mode = detectGithubThemeMode();
				Storage.set('github_theme_mode', mode);
				const nav = document.getElementById('githubExtensionNav') as HTMLDivElement;
				if (nav && nav.classList.contains('visible')) {
					if (!targetNode.classList.contains('padding-left')) targetNode.classList.add('padding-left');
				}
			}
		});
	};

	// Create an observer instance linked to the callback function
	currentBodyClassChangeObserver = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	currentBodyClassChangeObserver.observe(targetNode, config);
};

const DEFAULT_SIDEBAR_WIDTH = 300;

const __addSidebarWidthToHTMLDocument = async () => {
	const savedSidebarWidth = (await Storage.get('github_extension_sidebar_width')) ?? DEFAULT_SIDEBAR_WIDTH;
	document.documentElement.style.setProperty('--github-body-padding-left', `${savedSidebarWidth}px`);
	return savedSidebarWidth;
};

const startSidebar = async () => {
	const nav = document.createElement('nav');
	nav.setAttribute('id', 'githubExtensionNav');
	nav.innerHTML = `<iframe id="githubExtensionNavIframe"></iframe>`;
	document.body.appendChild(nav);

	const savedSidebarWidth = await __addSidebarWidthToHTMLDocument();
	nav.style.width = `${savedSidebarWidth}px`;

	const iframe = document.getElementById('githubExtensionNavIframe') as HTMLIFrameElement;

	const mode = detectGithubThemeMode();
	Storage.set('github_theme_mode', mode);
	observeThemeModeChange();

	iframe.src = chrome.runtime.getURL(
		// eslint-disable-next-line no-restricted-globals
		`html/index.html?chromeUrl=${encodeURIComponent(location.href)}&themeMode=${mode}`
	);
	iframe.frameBorder = '0';

	$('#githubExtensionNav').resizable({
		handles: 'e',
		minWidth: 200,
		resize: (_, ui) => {
			const newWidth = ui.size.width;
			document.documentElement.style.setProperty('--github-body-padding-left', `${newWidth}px`);
			Storage.set('github_extension_sidebar_width', newWidth);
		},
		// The start / stop properties are needed to solve a bug when making nav smaller
		start: () => {
			$('#githubExtensionNav').each((_, element) => {
				const d = $(
					`<div class="iframeCover" style="zindex:99;position:absolute;width:100%;top:0px;left:0px;height:${$(
						element
					).height()}px"></div>`
				);
				$(element).append(d);
			});
		},
		stop() {
			$('.iframeCover').remove();
		}
	});
	$('.ui-resizable-e').on('dblclick', () => {
		document.documentElement.style.setProperty('--github-body-padding-left', `${DEFAULT_SIDEBAR_WIDTH}px`);
		nav.style.width = `${DEFAULT_SIDEBAR_WIDTH}px`;
		Storage.set('github_extension_sidebar_width', DEFAULT_SIDEBAR_WIDTH);
	});
};

const __hideSidebar = () => {
	document.body.classList.remove('padding-left');
	document.getElementById('githubExtensionNav').classList.remove('visible');
};

const __showSidebar = () => {
	observeBodyClassChange();
	document.body.classList.add('padding-left');
	document.getElementById('githubExtensionNav').classList.add('visible');
};

const __handleMessages = async (message: Message) => {
	if (message.type === 'sidebar_status') {
		if (message.data === 'hidden') __hideSidebar();
		else if (message.data === 'visible') __showSidebar();
	} else if (message.type === 'tab_updated') {
		if (message.data.change.status) await __addSidebarWidthToHTMLDocument();
	}
};

chrome.runtime.onMessage.addListener(__handleMessages);
startSidebar();
