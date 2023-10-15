import { Ruleta } from './ruleta';
import { ByCanvas, BySVG } from './view';

type ComponentType = 'svg' | 'canvas';
window.addEventListener('load', function () {
    const ruleta = new Ruleta();
    const component = 'svg' as ComponentType;
    if (component === 'svg') {
        const view = new BySVG(ruleta);
    } else {
        const view = new ByCanvas(ruleta);
    }

    ruleta.start();
});
