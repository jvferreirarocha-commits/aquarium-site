const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");
const aboutSection = document.querySelector(".about");
const servicesSlider = document.querySelector("[data-services-slider]");
const projectsSlider = document.querySelector("[data-projects-slider]");
const faqItems = [...document.querySelectorAll("[data-faq-item]")];

const syncAboutMedia = () => {
  if (!aboutSection) return;

  const content = aboutSection.querySelector(".about__content");
  const media = aboutSection.querySelector(".about__media");

  if (!content || !media) return;

  media.style.removeProperty("--about-media-size");

  if (window.innerWidth <= 900) return;

  const contentHeight = content.getBoundingClientRect().height;
  const availableWidth = media.getBoundingClientRect().width;
  const mediaSize = Math.min(contentHeight, availableWidth);

  if (mediaSize > 0) {
    media.style.setProperty("--about-media-size", `${Math.round(mediaSize)}px`);
  }
};

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

const closeMenu = () => {
  header.classList.remove("is-menu-open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
};

const toggleMenu = () => {
  const willOpen = !header.classList.contains("is-menu-open");

  header.classList.toggle("is-menu-open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.setAttribute("aria-label", willOpen ? "Fechar menu" : "Abrir menu");
};

menuToggle.addEventListener("click", toggleMenu);

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    menuToggle.focus();
  }
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeMenu();
  syncAboutMedia();
});

updateHeader();
syncAboutMedia();
window.addEventListener("load", syncAboutMedia);

aboutSection?.querySelector(".about__media img")?.addEventListener("load", syncAboutMedia);

if (servicesSlider) {
  const slides = [...servicesSlider.querySelectorAll("[data-service-slide]")];
  const dots = [...servicesSlider.querySelectorAll("[data-service-dot]")];
  const prevButton = servicesSlider.querySelector("[data-services-prev]");
  const nextButton = servicesSlider.querySelector("[data-services-next]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const autoPlayDelay = 5200;
  let activeIndex = 0;
  let autoPlayTimer;

  const normalizeIndex = (index) => (index + slides.length) % slides.length;

  const setActiveSlide = (index) => {
    if (!slides.length) return;

    activeIndex = normalizeIndex(index);

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", String(isActive));
    });
  };

  const stopServicesAutoPlay = () => {
    window.clearInterval(autoPlayTimer);
  };

  const startServicesAutoPlay = () => {
    stopServicesAutoPlay();

    if (reducedMotion.matches || slides.length < 2) return;

    autoPlayTimer = window.setInterval(() => {
      setActiveSlide(activeIndex + 1);
    }, autoPlayDelay);
  };

  const handleManualNavigation = (index) => {
    stopServicesAutoPlay();
    setActiveSlide(index);
    startServicesAutoPlay();
  };

  prevButton?.addEventListener("click", () => {
    handleManualNavigation(activeIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    handleManualNavigation(activeIndex + 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      handleManualNavigation(index);
    });
  });

  servicesSlider.addEventListener("mouseenter", stopServicesAutoPlay);
  servicesSlider.addEventListener("mouseleave", startServicesAutoPlay);
  servicesSlider.addEventListener("focusin", stopServicesAutoPlay);
  servicesSlider.addEventListener("focusout", startServicesAutoPlay);

  const handleMotionPreferenceChange = () => {
    if (reducedMotion.matches) {
      stopServicesAutoPlay();
    } else {
      startServicesAutoPlay();
    }
  };

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleMotionPreferenceChange);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(handleMotionPreferenceChange);
  }

  setActiveSlide(0);
  startServicesAutoPlay();
}

if (projectsSlider) {
  const slides = [...projectsSlider.querySelectorAll("[data-project-slide]")];
  const nextButtons = [...projectsSlider.querySelectorAll("[data-project-next]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const autoPlayDelay = 5600;
  let activeIndex = 0;
  let autoPlayTimer;

  const normalizeIndex = (index) => (index + slides.length) % slides.length;

  const setActiveProject = (index) => {
    if (!slides.length) return;

    activeIndex = normalizeIndex(index);

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));

      slide.querySelectorAll("a, button").forEach((control) => {
        control.tabIndex = isActive ? 0 : -1;
      });
    });
  };

  const stopProjectsAutoPlay = () => {
    window.clearInterval(autoPlayTimer);
  };

  const startProjectsAutoPlay = () => {
    stopProjectsAutoPlay();

    if (reducedMotion.matches || slides.length < 2) return;

    autoPlayTimer = window.setInterval(() => {
      setActiveProject(activeIndex + 1);
    }, autoPlayDelay);
  };

  const handleProjectNext = () => {
    stopProjectsAutoPlay();
    setActiveProject(activeIndex + 1);
    startProjectsAutoPlay();
  };

  nextButtons.forEach((button) => {
    button.addEventListener("click", handleProjectNext);
  });

  projectsSlider.addEventListener("mouseenter", stopProjectsAutoPlay);
  projectsSlider.addEventListener("mouseleave", startProjectsAutoPlay);
  projectsSlider.addEventListener("focusin", stopProjectsAutoPlay);
  projectsSlider.addEventListener("focusout", startProjectsAutoPlay);

  const handleProjectMotionPreferenceChange = () => {
    if (reducedMotion.matches) {
      stopProjectsAutoPlay();
    } else {
      startProjectsAutoPlay();
    }
  };

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleProjectMotionPreferenceChange);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(handleProjectMotionPreferenceChange);
  }

  setActiveProject(0);
  startProjectsAutoPlay();
}

if (faqItems.length) {
  const closeFaqItem = (item) => {
    const button = item.querySelector("[data-faq-toggle]");
    const answer = item.querySelector("[data-faq-answer]");

    item.classList.remove("is-open");
    button?.setAttribute("aria-expanded", "false");
    if (answer) answer.style.maxHeight = "0px";
  };

  const openFaqItem = (item) => {
    const button = item.querySelector("[data-faq-toggle]");
    const answer = item.querySelector("[data-faq-answer]");

    item.classList.add("is-open");
    button?.setAttribute("aria-expanded", "true");
    if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
  };

  faqItems.forEach((item) => {
    const button = item.querySelector("[data-faq-toggle]");

    closeFaqItem(item);

    button?.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((currentItem) => {
        if (currentItem !== item) closeFaqItem(currentItem);
      });

      if (isOpen) {
        closeFaqItem(item);
      } else {
        openFaqItem(item);
      }
    });
  });

  window.addEventListener("resize", () => {
    faqItems.forEach((item) => {
      if (item.classList.contains("is-open")) openFaqItem(item);
    });
  });
}
