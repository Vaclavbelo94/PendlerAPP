
import { createRoot } from 'react-dom/client'
import { StrictMode, useEffect } from 'react'
import App from './App.tsx'
import './index.css'

// Funkce pro inicializaci dat
const initializeAppData = () => {
  // Inicializace prémiových funkcí, pokud ještě neexistují
  if (!localStorage.getItem('premiumFeatures')) {
    const defaultFeatures = [
      {
        id: "1",
        name: "Plánování směn",
        description: "Přidávání a správa směn v kalendáři",
        isEnabled: true,
        key: "shifts"
      },
      {
        id: "2",
        name: "Pokročilý překladač",
        description: "Překlad delších textů a dokumentů",
        isEnabled: true,
        key: "translator"
      },
      {
        id: "3",
        name: "Daňové kalkulačky",
        description: "Rozšířené kalkulačky pro výpočet daní a odvodů",
        isEnabled: true,
        key: "calculator"
      },
      {
        id: "4",
        name: "Rozšířené materiály k němčině",
        description: "Prémiové výukové materiály a cvičení",
        isEnabled: true,
        key: "language"
      },
      {
        id: "5",
        name: "Správa vozidla",
        description: "Rozšířené funkce pro správu vozidla a nákladů",
        isEnabled: true,
        key: "vehicle"
      }
    ];
    localStorage.setItem('premiumFeatures', JSON.stringify(defaultFeatures));
  }
}

// Inicializace dat při prvním načtení aplikace
initializeAppData();

// Obalení aplikace do StrictMode pro lepší detekci chyb
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
