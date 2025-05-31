
# Komponenty

Tato dokumentace popisuje hlavní komponenty v Pendlerově pomocníkovi.

## UI Komponenty

### Button
Základní tlačítko s podporou různých variant a velikostí.

**Varianty:**
- `default` - Hlavní tlačítko (modrá)
- `secondary` - Sekundární tlačítko (šedá)
- `destructive` - Destruktivní akce (červená)
- `outline` - Obrysové tlačítko
- `ghost` - Transparentní tlačítko
- `link` - Textový odkaz

**Velikosti:**
- `default` - Standardní velikost
- `sm` - Malé tlačítko
- `lg` - Velké tlačítko
- `icon` - Čtvercové pro ikony

### Card
Kontejner pro strukturovaný obsah.

**Části:**
- `CardHeader` - Záhlaví s nadpisem
- `CardTitle` - Hlavní nadpis
- `CardDescription` - Popisný text
- `CardContent` - Hlavní obsah
- `CardFooter` - Patička s akcemi

## Layout Komponenty

### Sidebar
Boční navigační panel s přizpůsobitelným obsahem.

### MobileNavigation
Mobilní navigace optimalizovaná pro dotykové zařízení.

### ResponsivePage
Wrapper pro stránky s responzivním layoutem.

## Premium Komponenty

### PublicPageWithPremiumCheck
Ochrana stránek s Premium funkcemi.

### PeriodSelector
Výběr období pro Premium předplatné.

## Spuštění Storybook

```bash
npm run storybook
```

Storybook se spustí na `http://localhost:6006` a zobrazí všechny dostupné komponenty s jejich variantami.
