import { useState, useEffect } from "react";

// Composant Timer avec deux propriétés : nbr (nombre initial du timer) et play (booléen indiquant si le timer doit être démarré)
export default function Timer({ nbr, play }: { nbr: number, play: boolean }) {
    // State pour stocker le compte à rebours actuel
    const [count, setCount] = useState<number>(nbr);
    // State pour stocker l'identifiant du timer
    const [timerId, setTimerID] = useState<NodeJS.Timeout | null>(null);

    // Effet qui se déclenche lorsque la propriété play change
    useEffect(() => {
        // Si play est vrai, réinitialiser le compteur et démarrer le timer
        if (play) {
            setCount(nbr);
            // Utilisation de setInterval pour décrémenter le compteur chaque seconde
            setTimerID(setInterval(() => setCount((prev) => prev - 1), 1000));
        } else {
            // Si play est faux, arrêter le timer en utilisant clearInterval avec l'identifiant du timer
            clearInterval(timerId!);
        }

        // Nettoyage : arrêter le timer lorsque le composant est démonté ou lorsque la propriété play change
        return () => {
            clearInterval(timerId!);
        };
    }, [play]);

    // Rendu du composant : affichage du compte à rebours actuel
    return <>{count}</>;
}
