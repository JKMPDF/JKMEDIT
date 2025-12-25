let fullData = [];
    let navigationStack = [];
    let currentLang = 'en';
    let currentActiveBook = null;

    async function init() {
        try {
            const res = await fetch('./library.json');
            fullData = await res.json();
            
            // Check if URL has a specific book linked (e.g., #MyBook)
            const savedHash = decodeURIComponent(window.location.hash.replace('#', ''));
            if (savedHash) {
                findAndOpenByPath(savedHash);
            } else {
                render(fullData);
            }
        } catch (e) {
            document.getElementById('main-content').innerHTML = "<h2>Error Loading Library...</h2>";
        }
    }

    // New: Find book based on URL hash after refresh
    function findAndOpenByPath(path) {
        let found = fullData.find(item => item.name === path);
        if (found) {
            const txtFiles = found.children.filter(c => c.type === 'file');
            openReader(found.name, txtFiles);
        } else {
            render(fullData);
        }
    }

    function setLanguage(lang) {
        currentLang = lang;
        document.getElementById('btn-eng').classList.toggle('active', lang === 'en');
        document.getElementById('btn-hin').classList.toggle('active', lang === 'hi');
        if (currentActiveBook) openReader(currentActiveBook.name, currentActiveBook.files);
    }

    function toggleDarkMode() {
        const body = document.body;
        body.setAttribute('data-theme', body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    }

    function render(items) {
        currentActiveBook = null;
        window.location.hash = ""; // Clear hash when on home screen
        const display = document.getElementById('main-content');
        display.innerHTML = `<div id="library-display" class="library-grid"></div>`;
        const grid = document.getElementById('library-display');

        grid.innerHTML = items.map((item, index) => `
            <div class="book-card" onclick="handleClick(${index})">
                <img src="${item.image}" onerror="this.src='https://via.placeholder.com/150x220?text=${item.name}'">
                <div style="padding:10px;"><h3>${item.name}</h3></div>
            </div>
        `).join('');
    }

    function handleClick(index) {
        const currentItems = navigationStack.length ? navigationStack[navigationStack.length - 1].children : fullData;
        const selected = currentItems[index];

        if (selected.type === 'folder') {
            const txtFiles = selected.children.filter(c => c.type === 'file');
            if (txtFiles.length > 0) {
                openReader(selected.name, txtFiles);
            } else {
                navigationStack.push(selected);
                render(selected.children);
            }
        }
    }

    function openReader(title, files) {
        currentActiveBook = { name: title, files: files };
        window.location.hash = encodeURIComponent(title); // Update URL
        
        const display = document.getElementById('main-content');
        const hindiFile = files.find(f => f.name.toLowerCase().includes('hindi'));
        const defaultFile = files.find(f => !f.name.toLowerCase().includes('hindi')) || files[0];
        const rawContent = (currentLang === 'hi' && hindiFile) ? hindiFile.content : defaultFile.content;

        // Split content by new lines to create "Checkpoints"
        const paragraphs = rawContent.split('\n').filter(p => p.trim() !== "");
        
        const formattedContent = paragraphs.map((para, idx) => {
            const progressId = `${title}-${idx}`;
            const isCompleted = localStorage.getItem(progressId) === 'true';
            return `
                <div class="reading-row" style="display:flex; align-items:flex-start; margin-bottom:1.5rem; gap:15px;">
                    <div style="flex:1">${para}</div>
                    <div class="dot-marker ${isCompleted ? 'done' : ''}" 
                         onclick="toggleProgress(this, '${progressId}')"
                         style="width:20px; height:20px; border-radius:50%; border:2px solid #ccc; cursor:pointer; flex-shrink:0; margin-top:5px; transition:0.3s;">
                    </div>
                </div>
            `;
        }).join('');

        display.innerHTML = `
            <div class="reader-panel">
                <h2 style="color:var(--primary-color)">${title}</h2>
                <style>
                    .dot-marker.done { background: #2ecc71; border-color: #27ae60 !important; box-shadow: 0 0 8px #2ecc71; }
                </style>
                <hr style="opacity:0.2; margin-bottom:20px;">
                <div>${formattedContent}</div>
            </div>
        `;
        window.scrollTo(0,0);
    }

    function toggleProgress(element, id) {
        const isDone = element.classList.toggle('done');
        localStorage.setItem(id, isDone);
    }

    function goBack() {
        if (currentActiveBook) {
            render(navigationStack.length ? navigationStack[navigationStack.length - 1].children : fullData);
        } else if (navigationStack.length > 0) {
            navigationStack.pop();
            render(navigationStack.length ? navigationStack[navigationStack.length - 1].children : fullData);
        } else {
            window.history.back();
        }
    }

    init();