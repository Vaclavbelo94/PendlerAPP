
const Cookies = () => {
  return (
    <div className="py-12 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Cookies</h1>
        
        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Co jsou cookies</h2>
            <p>Cookies jsou malé textové soubory, které jsou ukládány do vašeho prohlížeče nebo zařízení při návštěvě webových stránek. Cookies umožňují webovým stránkám rozpoznat vaše zařízení a zapamatovat si určité informace o vaší návštěvě.</p>
            <p>Cookies jsou široce používány ke zlepšení funkčnosti webových stránek, jejich výkonu a poskytování lepšího uživatelského zážitku.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Jaké cookies používáme</h2>
            <p>V naší aplikaci Pendler Helper používáme následující typy cookies:</p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Nezbytné cookies</h3>
            <p>Tyto cookies jsou nezbytné pro fungování aplikace. Umožňují základní funkce jako navigaci na stránce a přístup k zabezpečeným oblastem aplikace. Tyto cookies neukládají žádné informace, které by mohly být použity pro marketingové účely.</p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Funkční cookies</h3>
            <p>Tyto cookies umožňují aplikaci zapamatovat si volby, které jste učinili (jako je jazyk nebo region) a poskytovat vylepšené, personalizované funkce. Informace, které tyto cookies shromažďují, mohou být anonymizovány a nemohou sledovat vaši aktivitu na jiných webových stránkách.</p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Výkonnostní cookies</h3>
            <p>Tyto cookies shromažďují informace o tom, jak používáte aplikaci, které stránky jste navštívili a na které odkazy jste klikli. Všechny informace, které tyto cookies shromažďují, jsou agregované a anonymní. Používají se pouze ke zlepšení fungování aplikace.</p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Cookies třetích stran</h3>
            <p>V některých případech používáme služby třetích stran, které mohou také ukládat cookies ve vašem prohlížeči. Tyto cookies jsou používány pro následující účely:</p>
            <ul className="list-disc pl-5 space-y-2 my-4">
              <li>Analýza návštěvnosti (Google Analytics)</li>
              <li>Zobrazování map (Google Maps)</li>
              <li>Integrace sociálních médií</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Jak spravovat cookies</h2>
            <p>Většina webových prohlížečů umožňuje kontrolovat cookies prostřednictvím nastavení. Můžete blokovat nebo mazat cookies, případně nastavit prohlížeč tak, aby vás upozornil, když jsou cookies posílány do vašeho zařízení.</p>
            <p>Pokud blokujete nebo mažete cookies, nemusí některé části naší aplikace fungovat správně nebo vůbec.</p>
            
            <p className="mt-4">Informace, jak spravovat cookies v nejpoužívanějších prohlížečích:</p>
            <ul className="list-disc pl-5 space-y-2 my-4">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/cs/kb/povoleni-zakazani-cookies" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.microsoft.com/cs-cz/microsoft-edge/odstran%C4%9Bn%C3%AD-soubor%C5%AF-cookie-v-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
              <li><a href="https://support.apple.com/cs-cz/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Změny v používání cookies</h2>
            <p>Vyhrazujeme si právo kdykoli změnit nebo aktualizovat tyto zásady používání cookies. Změny budou zveřejněny na této stránce s uvedením data poslední aktualizace.</p>
            <p>Tyto zásady používání cookies jsou platné a účinné od 1.5.2025.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
