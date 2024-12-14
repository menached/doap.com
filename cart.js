document.getElementById("checkoutButton").addEventListener("click", submitCart);

const cartForm = document.getElementById('cartForm');
const totalDisplay = document.getElementById('total');

cartForm.addEventListener('change', () => {
    const itemElements = cartForm.querySelectorAll('input[name="item"]');
    if (!itemElements) {
        console.error('No items found in the cart.');
        totalDisplay.textContent = '$0';
        return;
    }

    const items = Array.from(itemElements)
        .filter(el => el.checked)
        .map(el => parseFloat(el.value.split('|')[1]));

    const total = items.reduce((sum, price) => sum + price, 0);
    totalDisplay.textContent = `$${total}`;
});

async function submitCart() {
    try {
        const itemElements = cartForm.querySelectorAll('input[name="item"]');
        if (!itemElements) {
            throw new Error('No items found in the cart.');
        }

        const items = Array.from(itemElements)
            .filter(el => el.checked)
            .map(el => el.value.split('|')[0]);

        if (items.length === 0) {
            throw new Error('No items selected.');
        }

        const address = document.getElementById('address').value;
        if (!address) {
            throw new Error('Address is required.');
        }

        const total = totalDisplay.textContent;

        const data = { items, address, total };

        const response = await fetch(
            'https://nh4za4vqt3.execute-api.us-west-2.amazonaws.com/prod/checkout',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }
        );

        if (response.ok) {
            alert('Order submitted successfully!');
        } else {
            const errorText = await response.text();
            console.error('Error submitting order:', errorText);
            alert('Error submitting order.');
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert(error.message);
    }
}

