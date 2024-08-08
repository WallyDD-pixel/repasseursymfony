const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Utiliser la clé secrète Stripe depuis les variables d'environnement
const cors = require('cors'); // Importer le middleware CORS
const path = require('path'); // Importer path pour gérer les chemins de fichiers
const app = express();
const PORT = process.env.PORT || 3000; // Utiliser le port fourni par Render ou 3000 en local

// Utiliser le middleware CORS
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques depuis le dossier 'public'
app.use(express.static('public'));

// Servir le fichier 'index.html' situé à la racine lorsqu'un utilisateur accède à la racine '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route pour créer une session de paiement avec abonnement
app.post('/create-checkout-session', async (req, res) => {
  const { amount, description, email, title } = req.body;
  const successUrl = new URL('http://le-repasseur.fr:3000/success.html');
  successUrl.searchParams.append('amount', amount);
  successUrl.searchParams.append('description', description);
  successUrl.searchParams.append('email', email);
  successUrl.searchParams.append('title', title);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: title,
            description: description,
          },
          recurring: {
            interval: 'month', // Intervalle de récurrence (mois)
          },
          unit_amount: parseInt(amount) * 100, // Montant en centimes
        },
        quantity: 1,
      },
    ],
    mode: 'subscription', // Mode d'abonnement
    customer_email: email,
    success_url: successUrl.toString(),
    cancel_url: 'http://le-repasseur.fr:3000/cancel.html',
  });

  res.json({ id: session.id });
});

// Route pour créer une session de paiement pour un produit (unique ou abonnement)
app.post('/create-checkout-session-produits', async (req, res) => {
  const { amount, description, email, title, type } = req.body;
  const successUrl = new URL('http://le-repasseur.fr:3000/success.html');
  successUrl.searchParams.append('amount', amount);
  successUrl.searchParams.append('description', description);
  successUrl.searchParams.append('email', email);
  successUrl.searchParams.append('title', title);

  let sessionConfig = {
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: title,
            description: description,
          },
          unit_amount: parseInt(amount) * 100, // Montant en centimes
        },
        quantity: 1,
      },
    ],
    customer_email: email,
    success_url: successUrl.toString(),
    cancel_url: 'http://le-repasseur.fr:3000/cancel.html',
  };

  if (type === 'subscription') {
    sessionConfig.mode = 'subscription';
    sessionConfig.line_items[0].price_data.recurring = {
      interval: 'month', // Intervalle de récurrence (mois)
    };
  } else {
    sessionConfig.mode = 'payment'; // Mode de paiement unique
  }

  const session = await stripe.checkout.sessions.create(sessionConfig);

  res.json({ id: session.id });
});

// Lancer le serveur
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
