require('dotenv').config(); // Charger les variables d'environnement

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Utiliser la clé secrète Stripe depuis les variables d'environnement
const cors = require('cors'); // Importer le middleware CORS
const app = express();
const PORT = process.env.PORT || 3000; // Utiliser le port fourni par Render ou 3000 en local

// Utiliser le middleware CORS
app.use(cors());

app.use(express.static('public'));
app.use(express.json());

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
    success_url: successUrl.toString(), // Utiliser l'URL de redirection avec les paramètres
    cancel_url: 'http://le-repasseur.fr:3000/cancel.html',
  });

  res.json({ id: session.id });
});

app.post('/create-checkout-session-produits', async (req, res) => {
  const { amount, description, email, title, type } = req.body;
  const successUrl = new URL('http://le-repasseur.fr:3000/success.html');
  successUrl.search
