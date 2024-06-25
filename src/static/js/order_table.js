document.addEventListener("DOMContentLoaded", function() {
    const rows = document.querySelectorAll("#ordersTable tbody .order-row");

    rows.forEach(row => {
        row.addEventListener("click", function(event) {
            // Evitar que se active el detalle si se hizo clic en el botón "Terminar"
            if (event.target.classList.contains('finish-button')) {
                const orderId = event.target.getAttribute("data-order-id");
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                
                fetch(`/finish/${orderId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken // Incluir el token CSRF en el encabezado X-CSRFToken
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
                    // Manejar la respuesta del servidor
                    if (data.success === true && data.finish_date) {
                        console.log('Orden marcada como terminada:', data.finish_date);
                        // Recargar la página después de un segundo
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    } else {
                        console.error('Respuesta inesperada del servidor:', data);
                    }
                })
                .catch(error => console.error('Error marking order as finished:', error));
            } else {
                // Código para mostrar detalles de la orden como antes
                const orderId = this.getAttribute("data-order-id");
                let detailsRows = Array.from(this.parentElement.children).filter(child => child.classList.contains('details-row'));

                // Si hay detalles visibles, se eliminan para ocultarlos
                if (detailsRows.length > 0) {
                    detailsRows.forEach(detailsRow => detailsRow.remove());
                } else {
                    // Si no hay detalles visibles, se hace la solicitud para obtener los detalles
                    fetch(`/details/${orderId}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Limpiar cualquier detalle existente antes de agregar nuevos
                            detailsRows.forEach(detailsRow => detailsRow.remove());

                            // Construir y mostrar los detalles de la orden para cada objeto en la lista
                            data.forEach(order => {

                                const detailsHTML = `
                                    <tr class="details-row">
                                        <td colspan="6">
                                            <div>
                                                <strong>Item: </strong> ${order.item_name}<br>
                                                <strong>Colores:</strong> 
                                                <div class="color-container">
                                                    <div class="circle" style="background-color: ${order.main_color};"></div> 
                                                    <div class="circle" style="background-color: ${order.other_color};"></div><br>
                                                </div>
                                                <strong>Patrón: </strong>${order.pattern_name}<br>
                                                <strong>Tamaño: </strong> ${order.size_name}<br>
                                                <strong>Servicio: </strong> ${order.service_name},
                                                <strong>Suavizante: </strong> ${order.softener? 'Sí' : 'No'}<br>
                                                <strong>Costo: </strong> ${order.cost}<br>
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
