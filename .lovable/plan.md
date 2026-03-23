

## Changement d'image du hero par l'utilisateur

L'utilisateur souhaite pouvoir changer l'image du hero directement depuis le site, sans passer par le chat.

### Approche

Ajouter un bouton "Changer l'image" visible sur le hero qui ouvre un sélecteur de fichier (`<input type="file">`). L'image sélectionnée sera stockée en mémoire (via `URL.createObjectURL`) et affichée à la place de l'image par défaut. On utilisera `localStorage` pour persister l'image en base64 entre les rechargements de page.

### Changements

**`src/components/HeroSection.tsx`** :
- Ajouter un state `customImage` initialisé depuis `localStorage`
- Ajouter un `<input type="file" accept="image/*">` caché
- Ajouter un bouton flottant (icône caméra/image) sur l'image hero pour déclencher le sélecteur
- Quand un fichier est choisi, le convertir en base64, le stocker dans `localStorage` et mettre à jour le state
- Utiliser `customImage || heroImage` comme source de l'image

### Limites

- `localStorage` a une limite de ~5MB, donc les très grandes images pourraient poser problème
- L'image ne sera persistée que dans le navigateur de l'utilisateur (pas partagée entre appareils)
- Pour une solution plus robuste, il faudrait un backend avec stockage de fichiers (Supabase Storage)

