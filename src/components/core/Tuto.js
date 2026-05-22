import React, { useLayoutEffect } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';

export default function Tuto({ steps, className, tutorialKey }) {

    useLayoutEffect(() => {
        const hasCompletedTutorial = localStorage.getItem(tutorialKey);
        if (hasCompletedTutorial) return;

        const intro = introJs();

        intro.setOptions({
            steps: steps || [],
            showStepNumbers: true,
            showBullets: false,
            showProgress: false,
            exitOnOverlayClick: false,
            hideNext: false,
            stepNumbersOfLabel: "sur",
            doneLabel: "J'ai compris",
            nextLabel: 'Suivant',
            prevLabel: 'Précédent',
        });

        intro.oncomplete(() => {
            localStorage.setItem(tutorialKey, "completed");
        });

        intro.onskip(() => {
            localStorage.setItem(tutorialKey, "completed");
        });

        const timer = setTimeout(() => intro.start(), 100);

        return () => {
            clearTimeout(timer);
            intro.exit(true);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Une seule exécution au mount — steps et tutorialKey sont stables par instance

    return (
        <div className={className}>
            {/* Content */}
        </div>
    );
}
