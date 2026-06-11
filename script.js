document.addEventListener('DOMContentLoaded', () => {
  // Application State
  let toolsData = [];
  let currentCategory = 'all';
  let searchQuery = '';

  // DOM Elements Selector Cache
  const toolsGrid = document.getElementById('tools-grid');
  const searchInput = document.getElementById('search-input');
  const categoryFilters = document.getElementById('category-filters');
  const loadingSpinner = document.getElementById('loading-spinner');
  const noResults = document.getElementById('no-results');
  const toolCountBadge = document.getElementById('tool-count');

  /**
   * Initializes database pipeline from JSON repository
   */
  async function initializeDirectory() {
    try {
      // Simulate real asynchronous load phase for rendering animation
      const response = await fetch('tools.json');
      if (!response.ok) throw new Error('Network response data malfunctioned.');
      
      toolsData = await response.json();
      
      // Clear out layout loaders and populate nodes
      loadingSpinner.style.display = 'none';
      renderDirectory();
    } catch (error) {
      console.error('Fatal initialization failure:', error);
      loadingSpinner.innerHTML = `<p style="color: #f43f5e;">Failed to synchronize directory framework assets.</p>`;
    }
  }

  /**
   * Filters and builds targeted DOM element nodes
   */
  function renderDirectory() {
    // Clear out target wrapper grid safely
    toolsGrid.innerHTML = '';

    // Apply filtering logic
    const filteredTools = toolsData.filter(tool => {
      const matchesCategory = currentCategory === 'all' || tool.category === currentCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery) || 
                            tool.description.toLowerCase().includes(searchQuery) ||
                            tool.category.toLowerCase().includes(searchQuery);
      return matchesCategory && matchesSearch;
    });

    // Handle empty data states
    if (filteredTools.length === 0) {
      noResults.style.display = 'block';
      toolCountBadge.textContent = '0';
      return;
    }

    noResults.style.display = 'none';
    toolCountBadge.textContent = filteredTools.length.toString();

    // Generate tool array element models fragment
    const listFragment = document.createDocumentFragment();

    filteredTools.forEach((tool, index) => {
      const card = document.createElement('article');
      card.className = 'tool-card';
      card.setAttribute('data-cat', tool.category);
      // Stagger animations smoothly
      card.style.animationDelay = `${index * 0.03}s`;

      card.innerHTML = `
        <div>
          <div class="card-header">
            <img src="${tool.logo}" alt="${tool.name} Logo" class="tool-logo" loading="lazy">
            <div>
              <h2 class="tool-title">${tool.name}</h2>
              <span class="category-badge">${tool.category}</span>
            </div>
          </div>
          <p class="tool-description">${tool.description}</p>
        </div>
        <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="visit-btn">
          Launch Framework
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </a>
      `;
      listFragment.appendChild(card);
    });

    toolsGrid.appendChild(listFragment);
  }

  /**
   * Search query execution input tracker
   */
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderDirectory();
  });

  /**
   * Category Filter Selection Event Delegation Matrix
   */
  categoryFilters.addEventListener('click', (e) => {
    const targetButton = e.target.closest('.filter-btn');
    if (!targetButton) return;

    // Shift active style paradigms across items
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    targetButton.classList.add('active');

    currentCategory = targetButton.getAttribute('data-category');
    renderDirectory();
  });

  // Execute continuous engine run loop execution
  initializeDirectory();
});