document.addEventListener("DOMContentLoaded", function() {
    const rows = document.querySelectorAll("#ordersTable tbody .order-row");

    rows.forEach(row => {
        row.addEventListener("click", function(event) {
            if (event.target.classList.contains('finish-button')) {
                const orderId = event.target.getAttribute("data-order-id");
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                
                fetch(`/api/orders/finish/${orderId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken 
                    },
                    body: JSON.stringify({ orderId: orderId })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success === true && data.finish_date) {
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    } else {
                        console.error('Unexpected server response:', data);
                    }
                })
                .catch(error => console.error('Error marking order as finished:', error));
            } else {
                const orderId = this.getAttribute("data-order-id");
                let detailsRows = Array.from(this.parentElement.children).filter(child => child.classList.contains('details-row'));

                if (detailsRows.length > 0) {
                    detailsRows.forEach(detailsRow => detailsRow.remove());
                } else {
                    fetch(`/api/orders/details/${orderId}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            detailsRows.forEach(detailsRow => detailsRow.remove());

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
                            
                                // Insertar detalles después de la fila de la orden clickeada
                                row.insertAdjacentHTML('afterend', detailsHTML);
                            });
                        })
                        .catch(error => console.error('Error fetching or processing order details:', error));
                }
            }
        });
    });
});

function isValidDate(date) {
    return date instanceof Date && !isNaN(date);
}
