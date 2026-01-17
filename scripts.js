document.addEventListener('DOMContentLoaded', () => {
    
    // ELEMENTS
    const menuBtn = document.getElementById('menuBtn');
    const searchBtn = document.getElementById('searchBtn');
    const closeMenu = document.getElementById('closeMenu');
    const closeSearch = document.getElementById('closeSearch');
    
    const menuOverlay = document.getElementById('menuOverlay');
    const searchOverlay = document.getElementById('searchOverlay');

    // --- MENU LOGIC ---
    if(menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop scrolling
        });

        closeMenu.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close when clicking outside content
        menuOverlay.addEventListener('click', (e) => {
            if(e.target === menuOverlay) {
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- SEARCH LOGIC ---
    if(searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            document.getElementById('globalSearchInput').focus();
            document.body.style.overflow = 'hidden';
        });

        closeSearch.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        searchOverlay.addEventListener('click', (e) => {
            if(e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- SEARCH FILTER FUNCTION ---
    const searchInput = document.getElementById('globalSearchInput');
    if(searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') {
                // You can replace this with a real search results page later
                alert("Search functionality coming soon! You typed: " + searchInput.value);
            }
        });
    }
});
