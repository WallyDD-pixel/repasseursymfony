const express = require('express');
const cors = require('cors');
const app = express();

app.get('/create-checkout/:itemId', (req, res) => {
  const squareConnect = require('square-connect');
  const defaultClient = squareConnect.ApiClient.instance;

  // Configurez OAuth2 Access Token pour l'authentification
  const oauth2 = defaultClient.authentications['oauth2'];
  oauth2.accessToken = 'EAAAl7tcgKqwP3lUH0hCg1c0utawSbUsRQnE2JBVamyxb8MWWfqqQ9nBwy7V9wpZ';

  const apiInstance = new squareConnect.CheckoutApi();

  const locationId = 'LWZ1NPVNSDA2M';
  const body = new squareConnect.CreateCheckoutRequest();

  body.idempotency_key = new Date().getTime().toString();
  body.order = {
    line_items: [
      {
        quantity: '1',
        catalog_object_id: req.params.itemId // Utilisez l'ID de l'article passé en tant que paramètre de requête
      }
    ]
  };

  apiInstance.createCheckout(locationId, body)
    .then((data) => {
      res.json({ checkoutUrl: data.checkout.checkout_page_url });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Erreur lors de la création du checkout');
    });
});
app.listen(3000, () => console.log('Server listening on port 3000'));