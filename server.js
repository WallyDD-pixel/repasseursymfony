const express = require('express');
const cors = require('cors');
const { Client, Environment } = require('square');
const app = express();

// Utilisez le middleware cors
app.use(cors());

// Créez une nouvelle instance de client
const client = new Client({
  environment: Environment.Sandbox, // ou Environment.Production production
  accessToken: 'EAAAl7tcgKqwP3lUH0hCg1c0utawSbUsRQnE2JBVamyxb8MWWfqqQ9nBwy7V9wpZ', // remplacez par votre jeton d'accès
});

app.get('/create-payment-link', async (req, res) => {
  try {
    // Récupérer l'id de l'abonnement à partir des paramètres de requête
    const amount = req.query.amount;
    const title = req.query.title;

    // Vérifier si l'id de l'abonnement est présent
    if (!amount || !title) {
      res.status(400).send('Montant ou titre manquant');
      return;
    }
    
    const response = await client.checkoutApi.createPaymentLink({
      quickPay: {
        name: title,
        priceMoney: {
          amount: parseInt(amount * 100),
          currency: 'EUR',
          
        },
        locationId: 'LWZ1NPVNSDA2M'
      },
      checkoutOptions: {
        subscriptionPlanId: ''
      }
    });

    // Renvoie l'URL du lien de paiement
    res.send(response.result.paymentLink.url);
  } catch(error) {
    console.log(error);
    res.status(500).send('Erreur lors de la création du lien de paiement');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));