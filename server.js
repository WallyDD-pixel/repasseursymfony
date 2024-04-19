const express = require('express');
const cors = require('cors');
const { createMollieClient } = require('@mollie/api-client');
const mollieClient = createMollieClient({ apiKey: 'test_Npy6vh55ETwVeynQ6kTtvt2whUWFey' });

const app = express();
app.use(cors()); // Utilisez le middleware cors ici
app.use(express.json());

app.post('/api/createPayment', async (req, res) => {
    try {
        const payment = await mollieClient.payments.create({
            amount: {
                currency: req.body.currency,
                value: req.body.amount,
            },
            description: req.body.description,
            redirectUrl: 'https://webshop.example.org/order/12345/',
            webhookUrl: 'https://webshop.example.org/payments/webhook/',
            method: 'creditcard',
            customerId: req.body.customerId,
        });

        res.json({ paymentUrl: payment.getPaymentUrl() });
    } catch (error) {
        console.error('Something went wrong:', error);
        app.use(function (err, req, res, next) {
            console.error(err.stack)
            res.status(500).send('Erreur lors de la création du paiement')
          })
    }
});
async function createSubscription(body) {
    return await mollieClient.customers_subscriptions.create({
        customerId: body.customerId,
        amount: {
            currency: body.currency,
            value: body.amount,
        },
        times: body.times,
        interval: body.interval,
        description: body.description,
    });
}

app.use(express.static('.'));
app.listen(3000, () => console.log('Server listening on port 3000'));