import { Message } from '@html/types/Message';

import './contentscript.scss';

const __hideSidebar = () => {
	document.body.classList.remove('padding-left');
	document.getElementById('githubExtensionNav').remove();
};

const __showSidebar = () => {
	document.body.classList.add('padding-left');
	document.getElementById('githubExtensionNav').classList.add('visible');
};

const __handleMessages = async (message: Message) => {
	if (message.type === 'sidebar_status') {
		if (message.data === 'hidden') __hideSidebar();
		else if (message.data === 'visible') __showSidebar();
	}
};

const startSidebar = () => {
	const nav = document.createElement('nav');
	nav.setAttribute('id', 'githubExtensionNav');
	nav.innerHTML = `<iframe id="githubExtensionNavIframe"></iframe>`;
	document.body.appendChild(nav);
	const iframe = document.getElementById('githubExtensionNavIframe');
	(iframe as any).src = chrome.runtime.getURL('html/index.html?chromeUrl=' + encodeURIComponent(location.href));
	(iframe as any).frameBorder = 0;
};

chrome.runtime.onMessage.addListener(__handleMessages);
startSidebar();
