import { PresentationController } from './PresentationController';
import { sections } from './slides';

const container = document.getElementById('canvas-container');
if (!container) throw new Error('Canvas container not found');

const presentation = new PresentationController(container, sections);

const content = document.getElementById('content');
if (!content) throw new Error('Content container not found');

sections.forEach((section, index) => {
  const sectionEl = document.createElement('section');
  sectionEl.className = 'section';
  
  // Add special class for the first section (welcome section)
  const isFirstSection = index === 0;
  if (isFirstSection) {
    sectionEl.classList.add('section-welcome');
  }
  
  // Add special class for the last section (firework section)
  const isLastSection = index === sections.length - 1;
  if (isLastSection) {
    sectionEl.classList.add('section-firework');
  }
  
  // Add special class for Team section
  if (section.title === 'Team') {
    sectionEl.classList.add('section-team');
  }
  
  // Add special class for Consenza slide (title with logo)
  const isConsenzaSection = section.title === 'Consenza' && section.imageUrl === '/logo.jpeg';
  if (isConsenzaSection) {
    sectionEl.classList.add('section-consenza');
  }
  
  // Add special class for STOP section (has transparent PNG)
  if (section.title === 'STOP') {
    sectionEl.classList.add('section-stop');
  }
  
  const title = document.createElement('h1');
  title.className = 'title';
  title.textContent = section.title;
  sectionEl.appendChild(title);
  
  // For the last section or Consenza section, render content after title but before image
  if ((isLastSection || isConsenzaSection) && section.content.length > 0) {
    section.content.forEach(line => {
      const p = document.createElement('p');
      p.textContent = line;
      sectionEl.appendChild(p);
    });
  }
  
  if (section.imageUrl) {
    const img = document.createElement('img');
    img.src = section.imageUrl;
    const sizeClass = section.imageSize === 'small' ? 'small' : 'large';
    img.className = `section-image ${sizeClass}`;
    // Add special class for transparent images (like stop.png)
    if (section.imageUrl === '/stop.png') {
      img.classList.add('image-transparent');
    }
    img.alt = section.title;
    sectionEl.appendChild(img);
  }
  
  // For other sections, render content after title/image
  if (!isLastSection && !isConsenzaSection && section.content.length > 0) {
    // Special handling for Team section - render with profile pictures
    if (section.title === 'Team' && section.content.length === 7) {
      const teamContainer = document.createElement('div');
      teamContainer.className = 'team-container';
      
      section.content.forEach((line, idx) => {
        const [name, position] = line.split('|');
        const memberEl = document.createElement('div');
        memberEl.className = 'team-member';
        
        const img = document.createElement('img');
        img.src = `/profile-${idx + 1}.jpg`; // Placeholder - update with actual image paths
        img.alt = name || `Team Member ${idx + 1}`;
        img.className = 'team-photo';
        
        const nameEl = document.createElement('div');
        nameEl.className = 'team-name';
        nameEl.textContent = name || `Team Member ${idx + 1}`;
        
        const positionEl = document.createElement('div');
        positionEl.className = 'team-position';
        positionEl.textContent = position || `Position ${idx + 1}`;
        
        memberEl.appendChild(img);
        memberEl.appendChild(nameEl);
        memberEl.appendChild(positionEl);
        teamContainer.appendChild(memberEl);
      });
      
      sectionEl.appendChild(teamContainer);
    } else {
      // Regular content rendering
      section.content.forEach(line => {
        const p = document.createElement('p');
        p.textContent = line;
        sectionEl.appendChild(p);
      });
    }
  }
  
  content.appendChild(sectionEl);
});

// Navigation controls
const prevButton = document.getElementById('prev-button') as HTMLButtonElement;
const nextButton = document.getElementById('next-button') as HTMLButtonElement;
const currentSectionSpan = document.getElementById('current-section') as HTMLSpanElement;
const totalSectionsSpan = document.getElementById('total-sections') as HTMLSpanElement;

if (!prevButton || !nextButton || !currentSectionSpan || !totalSectionsSpan) {
  throw new Error('Navigation controls not found');
}

totalSectionsSpan.textContent = sections.length.toString();

function updateNavigationState() {
  const current = presentation.getCurrentSection();
  currentSectionSpan.textContent = (current + 1).toString();
  
  prevButton.disabled = current === 0;
  nextButton.disabled = current === sections.length - 1;
}

// Update navigation state on scroll - use both immediate and debounced updates
let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
window.addEventListener('scroll', () => {
  // Immediate update for responsive button states
  updateNavigationState();
  
  // Toggle contrast layer visibility for firework section
  // Keep it visible a bit longer after section ends to account for offset
  const fireworkSection = document.querySelector('.section-firework') as HTMLElement;
  if (fireworkSection) {
    const rect = fireworkSection.getBoundingClientRect();
    const offset = window.innerHeight * 0.15; // 15vh offset to extend beyond section
    const isVisible = rect.top < window.innerHeight + offset && rect.bottom > -offset;
    fireworkSection.classList.toggle('is-visible', isVisible);
  }
  
  // Debounced update for performance optimization
  if (scrollTimeout !== null) {
    clearTimeout(scrollTimeout);
  }
  scrollTimeout = setTimeout(() => {
    updateNavigationState();
  }, 50);
});

// Button handlers
prevButton.addEventListener('click', () => {
  presentation.goToPrevious();
});

nextButton.addEventListener('click', () => {
  presentation.goToNext();
});

// Keyboard navigation
window.addEventListener('keydown', (e) => {
  // Prevent default scrolling behavior for these keys when not in input
  if (['ArrowLeft', 'ArrowRight', 'Space', 'PageUp', 'PageDown'].includes(e.key)) {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }
    e.preventDefault();
  }

  switch (e.key) {
    case 'ArrowLeft':
    case 'PageUp':
      presentation.goToPrevious();
      break;
    case 'ArrowRight':
    case 'Space':
    case 'PageDown':
      presentation.goToNext();
      break;
    case 'Home':
      e.preventDefault();
      presentation.scrollToSection(0);
      break;
    case 'End':
      e.preventDefault();
      presentation.scrollToSection(sections.length - 1);
      break;
  }
});

// Initial state
updateNavigationState();

// Initialize contrast layer visibility
const fireworkSection = document.querySelector('.section-firework') as HTMLElement;
if (fireworkSection) {
  const rect = fireworkSection.getBoundingClientRect();
  const offset = window.innerHeight * 0.15; // 15vh offset to extend beyond section
  const isVisible = rect.top < window.innerHeight + offset && rect.bottom > -offset;
  fireworkSection.classList.toggle('is-visible', isVisible);
}

window.addEventListener('beforeunload', () => presentation.dispose());