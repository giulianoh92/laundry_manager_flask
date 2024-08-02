document.addEventListener("DOMContentLoaded", function() {
    (function() {
        const tableBody = document.querySelector("#ordersTable tbody");
        const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
        const csrfToken = csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : null;

        if (!csrfToken) {
            console.error('CSRF token not found');
            return;
        }

        const fetchOrderDetails = async (orderId) => {
            const response = await fetch(`/api/orders/details/${orderId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        };

        const fetchFinishOrder = async (orderId) => {
            const response = await fetch(`/api/orders/finish/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({ orderId })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        };

        const finishOrder = async (orderId, button) => {
            try {
                const data = await fetchFinishOrder(orderId);
                if (data.success && data.finish_date) {
                    setTimeout(() => location.reload(), 1000);
                } else {
                    console.error('Unexpected server response:', data);
                    button.disabled = false;
                }
            } catch (error) {
                console.error('Error marking order as finished:', error);
                button.disabled = false;
            }
        };

        const displayOrderDetails = async (row, orderId) => {
            try {
                const data = await fetchOrderDetails(orderId);
                removeDetailsRows(row);
                data.forEach(order => {
                    const mainColor = order.main_color ?? '';
                    const otherColor = order.other_color ?? '';
                    const colorsHTML = mainColor && otherColor
                        ? `${mainColor}, ${otherColor}`
                        : mainColor || otherColor;

                    const detailsHTML = `
                        <tr class="details-row">
                            <td colspan="6">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <strong>Item: </strong> ${order.item_name ?? ''}<br>
                                            <strong>Colors:</strong> ${colorsHTML}<br>
                                            <strong>Pattern: </strong>${order.pattern_name ?? ''}<br>
                                            <strong>Size: </strong> ${order.size_name ?? ''}<br>
                                        </div>
                                        <div class="col-md-6">
                                            <strong>Service: </strong> ${order.service_name ?? ''}<br>
                                            <strong>Softener: </strong> ${order.softener ? 'Yes' : 'No'}<br>
                                            <strong>Price: </strong> $${order.cost ?? ''}<br>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `;
                    row.insertAdjacentHTML('afterend', detailsHTML);
                });
            } catch (error) {
                console.error('Error fetching or processing order details:', error);
            }
        };

        const removeDetailsRows = (row) => {
            let sibling = row.nextElementSibling;
            while (sibling && sibling.classList.contains('details-row')) {
                const nextSibling = sibling.nextElementSibling;
                sibling.remove();
                sibling = nextSibling;
            }
        };

        tableBody.addEventListener("click", function(event) {
            const row = event.target.closest('.order-row');
            if (!row) return;

            const orderId = row.getAttribute("data-order-id");

            if (event.target.classList.contains('finish-button')) {
                event.target.disabled = true;
                finishOrder(orderId, event.target);
            } else {
                if (row.nextElementSibling && row.nextElementSibling.classList.contains('details-row')) {
                    removeDetailsRows(row);
                } else {
                    displayOrderDetails(row, orderId);
                }
            }
        });
    })();
});
