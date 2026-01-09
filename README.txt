DRK Infodisplay V4

Start
npm install
npm start

Test
http://localhost:3000/?bgsrc=picsum&bgsec=5&qsec=5

Normalbetrieb
http://localhost:3000/

Hintergrund Logik
Standard: Hintergrund wechselt nur, wenn sich die Wetterlage aendert
Mit bgsec: Rotation innerhalb derselben Wettergruppe in Sekunden

Zitat Logik
Standard: ein Zitat pro Tag aus public/quotes.json
Mit qsec: Rotation in Sekunden

Dateien
public/Speiseplan.jpg austauschen
public/quotes.json fuer Zitate
public/bg enthaelt Hintergrundbilder nach Saison und Wettergruppe

Zeitplan Bilder
public/Speiseplan.jpg Standard
07:30 bis 08:29 Fruehstueck.jpg
11:45 bis 12:59 Mittagessen.jpg
14:30 bis 15:29 Nachmittagskaffee.jpg
17:30 bis 18:59 Abendbrot.jpg
