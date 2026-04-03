export function attachRipple(el: HTMLElement): void {
  el.addEventListener('pointerdown', (e: PointerEvent) => {
    if (el instanceof HTMLButtonElement && el.disabled) return;
    if (el.getAttribute('aria-disabled') === 'true') return;

    const r = el.getBoundingClientRect();
    const wave = document.createElement('span');
    wave.className = 'vx-ripple';
    wave.style.left = `${e.clientX - r.left}px`;
    wave.style.top = `${e.clientY - r.top}px`;
    el.appendChild(wave);

    wave.addEventListener('animationend', () => wave.remove(), { once: true });
  });
}

export function initRipples(root: Document | HTMLElement = document): void {
  const sel = '.vx-btn, .vx-icon-btn, .vx-fab, .vx-chip, .vx-card-interactive';
  root.querySelectorAll<HTMLElement>(sel).forEach(attachRipple);
}

export function toggleChip(chip: HTMLElement): void {
  const isSelected = chip.classList.toggle('selected');
  const icon = chip.querySelector('.vx-chip-check');

  if (isSelected && !icon) {
    chip.insertAdjacentHTML(
      'afterbegin',
      `<span class="vx-chip-icon vx-chip-check">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
          stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
       </span>`
    );
  } else if (!isSelected && icon) {
    icon.remove();
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initRipples();

    document.querySelectorAll<HTMLElement>('.vx-chip[data-toggle]').forEach(chip => {
      chip.addEventListener('click', () => toggleChip(chip));
    });
  });
}