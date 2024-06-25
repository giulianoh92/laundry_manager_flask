document.addEventListener("DOMContentLoaded", function () {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const endpoints = {
        cliente_nombre: "/get_clients",
        item: "/get_items",
        tipo_servicio: "/get_services",
        color_principal: "/get_colors",
        color_secundario: "/get_colors",
        patron_tela: "/get_patterns",
        tamano_objeto: "/get_sizes"
    };

    function clearAndPopulateSelect(endpoint, selectId) {
        const select = document.getElementById(selectId);
        select.innerHTML = '';  // Clear all options

        // Add an empty option
        const emptyOption = document.createElement("option");
        emptyOption.value = '';
        emptyOption.text = '-- Select an option --';
        select.appendChild(emptyOption);

        fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const option = document.createElement("option");
                option.value = item.id; // Assuming each item has an `id` field
                option.text = item.name || item.description; // Use `name` or `description`
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching data:", error));
    }

    function setupNewItems(newItem) {
        const selects = newItem.querySelectorAll('select');
        selects.forEach(select => {
            const selectId = select.getAttribute('id');
            if (endpoints.hasOwnProperty(selectId)) {
                clearAndPopulateSelect(endpoints[selectId], selectId);
            }
        });
    }

    // Initial setup for existing items
    Object.keys(endpoints).forEach(key => {
        clearAndPopulateSelect(endpoints[key], key);
    });

    document.getElementById("btn_extender").addEventListener("click", function () {
        document.getElementById("datos_cliente").style.display = "block";
    });

    document.getElementById("btn_agregar_item").addEventListener("click", function () {
        const itemContainer = document.querySelector("fieldset .item").parentNode;
        const newItem = document.querySelector(".item").cloneNode(true);

        // Clear any input values in the cloned item
        newItem.querySelectorAll('input[type="text"]').forEach(input => {
            input.value = '';
        });

        // Clear and populate selects in the cloned item
        setupNewItems(newItem);

        // Insert the new item before the "Agregar Item" button
        itemContainer.insertBefore(newItem, document.getElementById("btn_agregar_item"));
    });
});
