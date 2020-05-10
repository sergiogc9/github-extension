import './contentscript.scss';

const nav = document.createElement('nav');
nav.setAttribute('id', 'githubExtensionNav');
nav.innerHTML = `<iframe id="githubExtensionNavIframe"></iframe>`;
document.body.appendChild(nav);
const iframe = document.getElementById("githubExtensionNavIframe");
(iframe as any).src = chrome.runtime.getURL('html/index.html?chromeUrl=' + encodeURIComponent(location.href));
(iframe as any).frameBorder = 0;
