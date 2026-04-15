# MAIL SENDER

This project is intended for personal use.

- Ajouter une actualité des entreprises dans le 2ème message de suivi comme phrase d'accroche.
Exemple: Après avoir consulté votre actualité (ajout de l'information), je reste toujours autant intéressé pour contribuer à votre projet.

# TODO

## automate formatting and filtering of CSV file:
- Remove line if email, contact name, company name or location are null or undefined.
- Check if line contains two or more emails and split them to multiple line by each different email and name.
- Add function to capitalize first letter of each word in company name.
- Add function to remove all double quotes \"\ from the file from emails and names (beware of formatting).

## Improve logging mechanisms
- Log all important data to the console during runtime.
- Improve logging details in the tracking file.

## IMAP client config
- Configure an IMAP client to store sent emails in server.
- Make sure the sent emails persist on other clients (ex: Mailspring).

## Deployment
- Prepare to release first version and deploy a production package.
