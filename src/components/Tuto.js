import React, { useLayoutEffect, useState } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';

export default function Tuto({ steps, className, tutorialKey }) {
    const [completed, setCompleted] = useState(false);

    useLayoutEffect(() => {
        const intro = introJs();

        const startIntro = () => {
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
                setCompleted(true);
                localStorage.setItem(tutorialKey, "completed");
            });

            intro.onskip(() => {
                setCompleted(true);
                localStorage.setItem(tutorialKey, "completed");
            });

            intro.start();
        };

        const hasCompletedTutorial = localStorage.getItem(tutorialKey);

        if (!hasCompletedTutorial) {
            // Démarrer Intro.js après un court délai
            setTimeout(startIntro, 100); // Essayez avec différents délais si nécessaire
        }

        return () => {
            intro.exit();
        };
    }, [steps, tutorialKey]);

    return (
        <div className={className}>
            {/* Content */}
        </div>
    );
}
