
import React from 'react';
import { Helmet } from 'react-helmet';

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Ochrana soukromí - PendlerApp</title>
        <meta 
          name="description" 
          content="Zásady ochrany osobních údajů aplikace PendlerApp. Informace o tom, jak shromažďujeme, používáme a chráníme vaše osobní údaje." 
        />
      </Helmet>
      
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Ochrana soukromí</h1>
          
          <div className="prose prose-lg max-w-none text-foreground">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">1. Úvod</h2>
              <p className="text-muted-foreground">Společnost Pendlerův Pomocník s.r.o., IČO: 12345678, se sídlem Hlavní 123, 150 00 Praha 5 (dále jen „správce"), jako správce osobních údajů, tímto informuje o způsobu a rozsahu zpracování osobních údajů uživatelů aplikace Pendlerův Pomocník (dále jen „aplikace").</p>
              <p className="text-muted-foreground">Ochrana vašich osobních údajů je pro nás velmi důležitá. Tato pravidla ochrany soukromí vysvětlují, jaké údaje shromažďujeme, jak je používáme a jak je chráníme.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">2. Jaké osobní údaje shromažďujeme</h2>
              <p className="text-muted-foreground">V závislosti na využívaných funkcích aplikace můžeme shromažďovat následující osobní údaje:</p>
              <ul className="list-disc pl-5 space-y-2 my-4 text-muted-foreground">
                <li>Identifikační a kontaktní údaje (jméno, příjmení, e-mail, telefon)</li>
                <li>Přihlašovací údaje (e-mailová adresa, zašifrované heslo)</li>
                <li>Údaje o pracovních směnách a dojíždění (místo práce, pracovní doba)</li>
                <li>Údaje o vozidle (pokud využíváte funkci správy vozidla)</li>
                <li>Informace o nabídkách spolujízdy</li>
                <li>Údaje o používání aplikace a interakcích s ní</li>
                <li>Technické údaje o vašem zařízení (IP adresa, typ prohlížeče)</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">3. Jak údaje používáme</h2>
              <p className="text-muted-foreground">Vaše osobní údaje používáme pro následující účely:</p>
              <ul className="list-disc pl-5 space-y-2 my-4 text-muted-foreground">
                <li>Poskytování služeb aplikace a správa uživatelského účtu</li>
                <li>Zajištění možnosti plánování směn a spolujízdy</li>
                <li>Personalizace obsahu aplikace podle vašich potřeb</li>
                <li>Komunikace s vámi a zasílání notifikací souvisejících s používáním aplikace</li>
                <li>Zlepšování a optimalizace aplikace a jejích funkcí</li>
                <li>Zajištění bezpečnosti aplikace a prevence podvodů</li>
              </ul>
              <p className="text-muted-foreground">Právním základem pro zpracování vašich osobních údajů je plnění smlouvy (poskytování služeb aplikace), plnění právních povinností, náš oprávněný zájem (zlepšování aplikace) a v některých případech váš souhlas.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">4. Sdílení údajů s třetími stranami</h2>
              <p className="text-muted-foreground">Vaše osobní údaje můžeme sdílet s třetími stranami pouze v následujících případech:</p>
              <ul className="list-disc pl-5 space-y-2 my-4 text-muted-foreground">
                <li>S poskytovateli služeb, kteří nám pomáhají s provozem aplikace (poskytovatelé hostingu, cloudových služeb)</li>
                <li>S ostatními uživateli, pokud je to nezbytné pro poskytnutí požadované služby (např. v případě spolujízdy)</li>
                <li>Pokud to vyžaduje zákon nebo v rámci právního řízení</li>
              </ul>
              <p className="text-muted-foreground">Se všemi třetími stranami, které pro nás zpracovávají osobní údaje, máme uzavřeny smlouvy o zpracování osobních údajů, které zajišťují odpovídající úroveň ochrany.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">5. Zabezpečení údajů</h2>
              <p className="text-muted-foreground">Implementovali jsme technická a organizační opatření k ochraně vašich osobních údajů proti náhodnému nebo neoprávněnému přístupu, ztrátě, zničení nebo změně.</p>
              <p className="text-muted-foreground">Pravidelně kontrolujeme a aktualizujeme naše bezpečnostní systémy a postupy.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">6. Vaše práva</h2>
              <p className="text-muted-foreground">V souvislosti se zpracováním vašich osobních údajů máte následující práva:</p>
              <ul className="list-disc pl-5 space-y-2 my-4 text-muted-foreground">
                <li>Právo na přístup k údajům</li>
                <li>Právo na opravu nepřesných údajů</li>
                <li>Právo na výmaz údajů</li>
                <li>Právo na omezení zpracování</li>
                <li>Právo na přenositelnost údajů</li>
                <li>Právo vznést námitku proti zpracování</li>
                <li>Právo odvolat souhlas se zpracováním</li>
                <li>Právo podat stížnost u dozorového úřadu</li>
              </ul>
              <p className="text-muted-foreground">Pro uplatnění těchto práv nás můžete kontaktovat na e-mailové adrese info@pendleruvpomocnik.cz.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">7. Změny pravidel ochrany soukromí</h2>
              <p className="text-muted-foreground">Tato pravidla ochrany soukromí můžeme čas od času aktualizovat. O významných změnách vás budeme informovat prostřednictvím aplikace nebo e-mailu.</p>
              <p className="text-muted-foreground">Tato pravidla ochrany soukromí jsou platná a účinná od 1.5.2025.</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
