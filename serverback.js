

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
app.post('/api/createSubscription', async (req, res) => {
    try {
        const subscription = await createSubscription(req.body);
        res.json(subscription);
    } catch (error) {
        console.error('Something went wrong:', error);
        res.status(500).send('Erreur lors de la création de l\'abonnement');
    }
});
async function createCustomer(body) {
    return await mollieClient.customers.create({
        name: body.name,
        email: body.email,
        // Vous pouvez ajouter d'autres champs ici si nécessaire
    });
}
async function createMandate(customerId, consumerName, consumerAccount) {
    return await mollieClient.customers_mandates.create({
        customerId: customerId,
        method: 'directdebit',
        consumerName: consumerName,
        consumerAccount: consumerAccount, // Ajouter ce champ
        // Pour les autres méthodes de paiement, vous devrez peut-être fournir des informations supplémentaires
    });
}

async function createSubscription(body) {
    // Créer un client
    const customer = await createCustomer(body);
    console.log('Customer ID:', customer.id);

    // Créer un mandat pour ce client
    const mandate = await createMandate(customer.id, "client", "NL91ABNA0417164300"); // Utiliser "client" comme 'consumerName' et 'NL91ABNA0417164300' comme 'consumerAccount'
    console.log('Mandate ID:', mandate.id);

    // Créer un abonnement pour ce client
    console.log('Creating subscription...'); // Ajouter cette ligne

const subscription = await mollieClient.customers_subscriptions.create({
    customerId: customer.id,
    amount: {
        currency: body.currency,
        value: body.amount,
    },
    times: body.times,
    interval: body.interval,
    description: body.description,
    startDate: body.startDate, 
    method: body.method, 
    mandateId: mandate.id,
    webhookUrl: body.webhookUrl, 
    metadata: body.metadata, 
});

console.log('Subscription created:', subscription); // Ajouter cette ligne

return subscription;
}
app.use(express.static('.'));
app.listen(3000, () => console.log('Server listening on port 3000'));
