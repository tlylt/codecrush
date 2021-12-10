const $ = document.querySelectorAll.bind(document);
const $1 = document.querySelector.bind(document);
const mainDiv = createMainDiv();

const getFilename = (url) => (url.match(/file=([^&]+)/)[1]).split("/")[1];
const getSourceUrls = () => [...document.querySelectorAll("#tabs-3 a[href*='view_submitfile']:not([href*='download'])")].map(a => a.href);
const getDownloadUrls = () => [...document.querySelectorAll("#tabs-3 a[href*='view_submitfile']:not([href*='view'])")].map(a => a.href);
function newE(tag, attribs) {
    const el = document.createElement(tag);
    if (attribs) {
        for (const [name, value] of Object.entries(attribs)) {
            el[name] = value;
        }
    }
    return el;
}

function createMainDiv() {
    const div = newE("div", { "style": "margin: 1em 0" });
    $1("#content_full").append(div);
    return div;
}

function createButtons() {
    const showButton = newE("button", { "type": "button", "innerText": "Show all files", "className": "floatingButton" });
    const downloadButton = newE("button", { "type": "button", "innerText": "Download all files", "className": "floatingButton2" });
    showButton.addEventListener("click", handleShowButton);
    downloadButton.addEventListener("click", handleDownloadButton);
    mainDiv.append(showButton);
    mainDiv.append(downloadButton);
}

function createPanel(title) {
    const panel = newE("div", { "className": "panel" });
    const header = newE("h2", { "innerText": title });
    panel.append(header);
    mainDiv.append(panel);
    return panel;
}

const urlFetchSuccess = (panel) => async (res) => {
    const src = await res.text();
    panel.lastChild.remove();

    const pre = newE("pre");
    const code = newE("code", { "className": "lang-java" });
    code.innerHTML = src.replace(/(&|<|>)/g, (c) => {
        switch (c) {
            case "&":
                return "&amp;";
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            default:
                return c;
        }
    });
    hljs.highlightBlock(code);
    pre.append(code);
    panel.append(pre);
};

const urlFetchError = (panel) => async (res) => {
    alert("Please refresh to try fetching the files again:/");
};

function downloadFile(url) {
    // handle auto downloading of files
    const name = getFilename(url);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.dispatchEvent(new MouseEvent("click"));
}


function doUrl(url) {
    const name = getFilename(url);
    const panel = createPanel(name);
    panel.append(newE("p", { "innerText": "Loading..." }));
    fetch(url, { credentials: 'include' }).then(urlFetchSuccess(panel), urlFetchError(panel));
}


function handleShowButton(e) {
    e.target.remove();
    getSourceUrls().map((url) => {
        doUrl(url);
    });
}
function handleDownloadButton(e) {
    e.target.remove();
    getSourceUrls().map((url) => {
        downloadFile(url);
    });
}

createButtons();
