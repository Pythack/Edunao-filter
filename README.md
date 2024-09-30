
# Filtre Edunao

Filtre Edunao (ou **Edunao Filter**) est une extension open source pour Safari et Chrome, conçue pour améliorer l'expérience utilisateur sur le site [Edunao](https://centralesupelec.edunao.com/) utilisé à CentraleSupélec. Cette extension permet de personnaliser et de filtrer l'affichage du contenu et de se connecter automatiquement en ajoutant des fonctionnalités pratiques.

## Fonctionnalités

- **Personnalisation du contenu** : Modifie l'affichage du site selon vos besoins.
- **Intégration iCal** : Ajoutez un lien iCal pour voir vos événements et cours actuels.
- **Compatibilité multi-plateforme** : Disponible pour Safari et Chrome.
- **Entièrement open source** : Le code est disponible pour modification, personnalisation et contribution.

## Installation

### Pour Chrome

1. Clonez le dépôt ou téléchargez les fichiers de l'extension :
   ```bash
   git clone https://github.com/nom-utilisateur/filtre-edunao.git
   ```

2. Ouvrez Chrome et allez dans les **Extensions**.

3. Activez le **mode développeur** dans Chrome.

4. Cliquez sur **Charger l’extension non empaquetée** et sélectionnez le dossier où vous avez téléchargé/cloné l’extension.

5. L’extension devrait maintenant être installée et prête à l’emploi.

### Pour Safari

1. Ouvrez le projet dans **Xcode**.
2. Configurez le projet et construisez l'application pour votre système.
3. Activez l’extension dans les **Préférences de Safari**, section **Extensions**.

## Utilisation

1. Installez l'extension en suivant les étapes ci-dessus.
2. Accédez à l'interface de l'extension via l'icône située dans la barre d'outils.
3. Ajoutez l'URL de votre calendrier iCal pour afficher les cours et événements actuels.

## Contribution

Les contributions sont les bienvenues ! Si vous souhaitez contribuer à l'amélioration de cette extension, voici comment vous pouvez le faire :

1. Forkez le dépôt.
2. Créez une nouvelle branche pour vos modifications :
   ```bash
   git checkout -b ma-nouvelle-fonctionnalité
   ```
3. Effectuez vos modifications et validez-les :
   ```bash
   git commit -m "Ajout d'une nouvelle fonctionnalité"
   ```
4. Poussez votre branche sur GitHub :
   ```bash
   git push origin ma-nouvelle-fonctionnalité
   ```
5. Ouvrez une **Pull Request** et décrivez vos modifications.

## Confidentialité

L'extension **Filtre Edunao** n'est en aucun cas affiliée à CentraleSupélec ou Edunao. Elle est maintenue bénévolement et ne collecte aucune donnée des utilisateurs. Pour plus d’informations, vous pouvez consulter [notre politique de confidentialité](https://bdb.cs-campus.fr/confidentialite).

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

*Filtre Edunao est une extension communautaire et open-source destinée à améliorer l'utilisation des plateformes Edunao et CentraleSupélec. Elle est maintenue par des bénévoles et est ouverte à toutes les contributions.*

## Todo
- [x] Etendre aux 1A
- [x] Faire une interface plus accueillante
- [ ] Ajouter un lien vers tuto pour trouver l'iCal
- [ ] Ajouter un bouton "Rate this extension"
- [ ] Etendre à Android