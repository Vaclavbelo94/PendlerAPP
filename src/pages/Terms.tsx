
const Terms = () => {
  return (
    <div className="py-12 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Podmínky použití</h1>
        
        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Úvodní ustanovení</h2>
            <p>Tyto podmínky použití upravují práva a povinnosti uživatelů webové aplikace Pendler Helper (dále jen „aplikace") provozované společností Pendler Helper s.r.o., IČO: 12345678, se sídlem Hlavní 123, 150 00 Praha 5 (dále jen „provozovatel").</p>
            <p>Používáním aplikace vyjadřujete souhlas s těmito podmínkami. Pokud s podmínkami nesouhlasíte, není možné aplikaci používat.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Registrace a uživatelský účet</h2>
            <p>Pro plné využití funkcí aplikace je nutná registrace. Při registraci je uživatel povinen uvést pravdivé a úplné údaje.</p>
            <p>Uživatel je povinen chránit své přihlašovací údaje před zneužitím a nese odpovědnost za veškeré aktivity provedené pod jeho účtem.</p>
            <p>Provozovatel si vyhrazuje právo zrušit uživatelský účet, který porušuje tyto podmínky použití.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Práva a povinnosti uživatele</h2>
            <p>Uživatel se zavazuje:</p>
            <ul className="list-disc pl-5 space-y-2 my-4">
              <li>Nepoužívat aplikaci způsobem, který by mohl poškodit, znepřístupnit, přetížit nebo zhoršit její funkčnost</li>
              <li>Nenahrávat do aplikace obsah, který porušuje právní předpisy nebo práva třetích osob</li>
              <li>Nešířit prostřednictvím aplikace nevyžádaná sdělení (spam)</li>
              <li>Nezasahovat do technického provedení aplikace</li>
              <li>Nepoužívat automatizované systémy pro přístup k aplikaci</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Omezení odpovědnosti</h2>
            <p>Informace poskytované v aplikaci mají pouze informativní charakter a nejsou právním poradenstvím. Provozovatel nenese odpovědnost za případné škody vzniklé v důsledku použití těchto informací.</p>
            <p>Provozovatel neodpovídá za obsah vložený do aplikace uživateli (například nabídky spolujízdy).</p>
            <p>Aplikace může obsahovat odkazy na webové stránky třetích stran. Provozovatel neodpovídá za obsah těchto stránek.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Dostupnost služby</h2>
            <p>Provozovatel nezaručuje nepřetržitou dostupnost aplikace. V případě technických problémů nebo údržby může být funkčnost aplikace dočasně omezena.</p>
            <p>Provozovatel si vyhrazuje právo změnit nebo ukončit provoz aplikace nebo její části bez předchozího upozornění.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Ochrana osobních údajů</h2>
            <p>Zpracování osobních údajů uživatelů se řídí zásadami ochrany osobních údajů, které jsou dostupné v sekci „Ochrana soukromí".</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Závěrečná ustanovení</h2>
            <p>Tyto podmínky použití se řídí právním řádem České republiky.</p>
            <p>Provozovatel si vyhrazuje právo tyto podmínky použití kdykoliv změnit. O změnách bude uživatele informovat prostřednictvím aplikace.</p>
            <p>Tyto podmínky použití jsou platné a účinné od 1.5.2025.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
