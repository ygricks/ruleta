import { Ruleta } from './ruleta';
import { ByCanvas } from './view';

window.addEventListener('load', function () {
    const ruleta = new Ruleta();
    const view = new ByCanvas(ruleta);
    ruleta.start();
});
