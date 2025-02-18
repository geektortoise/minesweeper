import { Injectable } from '@angular/core';
import { confetti } from '@tsparticles/confetti';

@Injectable({ providedIn: 'root' })
export class ConfettiService {
  private confettis: boolean = false;

  triggerConfettis() {
    const duration = 15 * 1000,
      animationEnd = Date.now() + duration,
      defaults = { startVelocity: 20, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0 || this.confettis) {
        return clearInterval(interval);
      }

      const particleCount = 20 * (timeLeft / duration);

      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: {
            x: Math.random() * (0.3 - 0.1) + 0.1,
            y: Math.random() - 0.2,
          },
        }),
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: {
            x: Math.random() * (0.9 - 0.7) + 0.7,
            y: Math.random() - 0.2,
          },
        }),
      );
    }, 250);
  }

  stopConfettis(stop: boolean) {
    this.confettis = stop;
  }
}
