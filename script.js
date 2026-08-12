/* ==========================================================================
   Denis & Tathy — 01.08.2026
   script.js — interações do álbum digital
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     1. Selo flutuante: aparece depois que o usuário sai do Hero
  --------------------------------------------------------------------- */
  const seal = document.querySelector('.seal');
  const hero = document.getElementById('hero');

  if (seal && hero) {
    const sealObserver = new IntersectionObserver(
      ([entry]) => {
        // Quando o hero SAI da tela, mostramos o selo
        seal.classList.toggle('is-visible', !entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    sealObserver.observe(hero);
  }

  /* ---------------------------------------------------------------------
     2. Geração automática da galeria (foto-001.jpg até foto-084.jpg)
  --------------------------------------------------------------------- */
  const GALLERY_CONFIG = {
    folder: 'img/',        // pasta onde estão as fotos
    prefix: 'foto-',       // prefixo do nome do arquivo
    extension: 'jpg',      // extensão dos arquivos (jpg, jpeg, png...)
    totalPhotos: 78,       // quantidade total de fotos (foto-001 até foto-084)
    padLength: 3,          // quantidade de dígitos no número (001, 002...)
  };

  function buildGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= GALLERY_CONFIG.totalPhotos; i++) {
      const number = String(i).padStart(GALLERY_CONFIG.padLength, '0');
      const fileName = `${GALLERY_CONFIG.prefix}${number}.${GALLERY_CONFIG.extension}`;
      const filePath = `${GALLERY_CONFIG.folder}${fileName}`;

      const link = document.createElement('a');
      link.href = filePath;
      link.className = 'gallery__item';

      const img = document.createElement('img');
      img.src = filePath;
      img.alt = `Foto ${number} do casamento — Denis & Tathy`;
      img.loading = 'lazy';

      link.appendChild(img);
      fragment.appendChild(link);
    }

    grid.appendChild(fragment);
  }

  buildGallery();

  /* ---------------------------------------------------------------------
     3. Lightbox (SimpleLightbox) — navegação por toque + setas
  --------------------------------------------------------------------- */
  if (typeof SimpleLightbox !== 'undefined') {
    new SimpleLightbox('.gallery__item', {
      captionsData: null,
      fadeSpeed: 250,
      animationSpeed: 250,
      overlayOpacity: 0.92,
      docClose: true,
      swipeClose: true,
      nav: true,
      nextOnImageClick: true,
      loop: true,
    });
  }

  /* ---------------------------------------------------------------------
     4. Reveal suave das seções ao rolar a página
     (a galeria fica de fora: cada foto já tem sua própria animação de
     entrada, e uma seção tão grande poderia nunca disparar o threshold
     de interseção em certas telas, travando tudo em opacidade zero)
  --------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.welcome, .video-section'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(el);

    // Trava de segurança: se por algum motivo o observer nunca disparar
    // (ex: seção muito grande, tela incomum), força a seção a aparecer
    // depois de 2s para nunca deixar conteúdo travado invisível.
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 2000);
  });

});
