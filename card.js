const e = require("cors");

document.addEventListener('DOMContentLoaded', async() => {
    const stripe = Stripe('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');
    var elements = stripe.elements();
    var cardElement = elements.create('card');
    cardElement.mount('#card-element');

    const form = document.getElementById('#payment-form');
    form.addEventListener('submit', async (event) => {
        addMessage('submitting details to the backend');
       event.preventDefault();
       const {clientSecret} = await fetch('/create-payment-intent', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({paymentMethodType: 'card', currency: 'eur'})

         }).then((res) => res.json());
         addMessage('PaymentIntent created');
         const nameInput = document.querySelector('#name');
         const emailInput = document.querySelector('#email');
         const {paymentIntent} = await stripe.confirmCardPayment(
            clientSecret, {
            payment_method: {
              card: cardElement,
                billing_details: {
                    name: nameInput.value,
                    email: emailInput.value,
                }
             
            }
    })
    addMessage('PaymentIntent (${paymentIntent.id}): ${paymentIntent.status}');
});

const addMessage = (message) => {
  const messagesDiv = document.getElementById('#messages');
  messagesDiv.style.display = 'block';
  messagesDiv.innerHMTL +='>' + message + '<br>';
  console.log('StripeSampleDebug: ', message);
}
});