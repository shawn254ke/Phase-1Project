document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("table");
    const modal = document.getElementById("itemModal");
    const closeModal = document.getElementById("close-modal");
    const addItemForm = document.getElementById("itemForm");
    const sellItemForm = document.getElementById("sellForm");
    const sellModal = document.getElementById("sellFormContainer");
    const closeSellModal = document.getElementById("close-sell-modal");
    const sellQuantity = document.getElementById("sell-quantity");
    const deleteDialog = document.getElementById("dialog");
    const closeDeleteDialog = document.getElementById("close-dialog");
    const okDialogBtn = document.getElementById("ok");
    const cancelDialogBtn = document.getElementById("cancel");
    const stockDisplay = document.getElementById("stock");
    const salesDisplay = document.getElementById("sales");
    const addItemBtn = document.getElementById("add-item-btn");
    const addStockModal = document.getElementById("addFormContainer");
    const closeStockModalBtn = document.getElementById("close-Add-modal");
    const stockQuantityToAdd = document.getElementById("add-quantity");
    const darkModeToggle = document.getElementById("lightMode");
    const notificationIcon = document.getElementById("notification");
    const notifDropdown = document.getElementById("notif-dropdown");
    const clearNotifBtn = document.getElementById("clear-notifications");
    const notifCount = document.getElementById("notCount");
    const notifList = document.getElementById("notif-list");

    let currentSellingItemId = null;
    let currentSellingItem = null;
    let currentSales = null;
    let currentDeletingId = null;
    let currentStockItem =null;
    let currentStockItemId = null;
    let totalStocks = 0;
    let totalSellPrice = 0;

    // Fetch all items and update UI
    function fetchItems() {
        fetch("http://localhost:3000/items")
            .then(response => response.json())
            .then(items => {
                updateTable(items);
                updateTotalStock(items);
                populateNotification(items);
                fetchSales();
            });
    }

    // Update table rows
    function updateTable(items) {
        tableBody.innerHTML = "";
        items.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.supplier}</td>
                <td>
                    <button class="sell" data-id="${item.id}" ${item.quantity === 0 ? "disabled" : ""}>
                        ${item.quantity === 0 ? "Out of Stock" : "Sell"}
                    </button>
                    <button class="add-stock" data-id="${item.id}">Add Stock</button>
                    <button class="delete-btn" data-id="${item.id}">Delete</button>
                    <span class ="stockAlert" data-id="${item.id}">
                    ${item.quantity < 5 ? "Low On Stocks" : ""}</span>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Calculate and update total stock
    function updateTotalStock(items) {
        totalStocks = items.reduce((total, item) => total + Number(item.quantity), 0);
        stockDisplay.textContent = totalStocks;
    }

    // Fetch sales data
    function fetchSales() {
        fetch("http://localhost:3000/sales/10")
            .then(response => response.json())
            .then(sales => {
                salesDisplay.textContent = sales.sales ?? 0;
                currentSales = sales;
            })
            .catch(error => console.error("Error fetching sales:", error));
    }

    // Open sell modal and load item details
    function openSellModal(itemId) {
        fetch(`http://localhost:3000/items/${itemId}`)
            .then(response => response.json())
            .then(item => {
                currentSellingItem = item;
                currentSellingItemId = itemId;
                
                document.getElementById("sellItemName").textContent = item.name;
                document.getElementById("sellCategory").textContent = item.category;
                document.getElementById("sellPrice").textContent = item.price;
                sellQuantity.value = 1; // Default value

                sellModal.style.display = "flex";
            });
    }
    

    // Handle sell quantity input
    sellQuantity.addEventListener("input", (e) => {
        let currentQuantity = Number(e.target.value);
        if (currentSellingItem) {
            totalSellPrice = currentSellingItem.price * currentQuantity;
            document.getElementById("sellPrice").textContent = totalSellPrice;

        }
    });

    // Handle form submission for selling an item
    sellItemForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let quantityToSell = Number(sellQuantity.value);
        if (!currentSellingItem || quantityToSell <= 0) return;

        fetch(`http://localhost:3000/items/${currentSellingItemId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: currentSellingItem.quantity - quantityToSell })
        }).then(fetchItems);

        fetch("http://localhost:3000/sales/10", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sales: currentSales.sales += totalSellPrice ? totalSellPrice : currentSellingItem.price}) 
        }).then(fetchSales);

        sellModal.style.display = "none";
    });

    // Handle item addition
    addItemBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });
    addItemForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const newItem = {
            name: addItemForm.itemName.value,
            category: addItemForm.category.value,
            quantity: Number(addItemForm.quantity.value),
            price: Number(addItemForm.price.value),
            supplier: addItemForm.supplier.value,
        };

        fetch("http://localhost:3000/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newItem)
        }).then(() => {
            modal.style.display = "none";
            fetchItems();
        });
    });

    //Handle Stock Quantity Addition
    function addQuantity(itemId){
        fetch(`http://localhost:3000/items/${itemId}`)
        .then(response => response.json())
        .then(item => {
            currentStockItem = item;
            stockQuantityToAdd.value = item.quantity;
            document.getElementById("addItemName").textContent = item.name;
            document.getElementById("addCategory").textContent = item.category;

            addStockModal.style.display = "flex";
        });

    }
    addStockModal.addEventListener("submit", (e) => {
        e.preventDefault();
        fetch(`http://localhost:3000/items/${currentStockItem.id}`,{
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({quantity: stockQuantityToAdd.value})
        })
    })
    //Handle deleting an Item
    function handleDeleteModal(itemId){
        fetch(`http://localhost:3000/items/${itemId}`)
        .then(response => response.json())
        .then(item => {
            document.getElementById("item-name").textContent = item.name;
            currentDeletingId = itemId
            deleteDialog.style.display = "flex";
                

        });

    }
    okDialogBtn.addEventListener("click" , (e) => {
        fetch(`http://localhost:3000/items/${currentDeletingId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete item");
            }
            return response.json();
        })
        .then(() => {
            alert("Item deleted successfully!");
            fetchItems(); // Refresh the items list
            deleteDialog.style.display = "none"
        })
        .catch(error => console.error("Error deleting item:", error));
    
    
    });
    cancelDialogBtn.addEventListener("click", () => {
        deleteDialog.style.display = "none";
 
    });
        
    // Event delegation for dynamic buttons
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("sell")) {
            openSellModal(e.target.dataset.id);
        } else if (e.target.classList.contains("delete-btn")) {
            handleDeleteModal(e.target.dataset.id);
        }else if (e.target.classList.contains("add-stock")){
            addQuantity(e.target.dataset.id);

        }
    });

    //Handle Table search
    document.getElementById("search-input").addEventListener("input" , (e) => {
        const query = e.target.value.toLowerCase();
        const rows = document.querySelectorAll("#table tr");

        rows.forEach(row =>{
            const rowText = row.textContent.toLowerCase();
            row.style.display = rowText.includes(query) ? "" : "none";
        })
    });
    //Toggle between Dark and Light Mode 
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
       
    });
    //Populate Notifications
    function populateNotification(items) {
        notifList.innerHTML = ""; 
        const lowStockItems = items.filter(item => item.quantity <= 5); 
        lowStockItems.forEach(item => {
            const li = document.createElement("li"); 
            li.textContent = `Item: ${item.name} is Running Out of Stock`; 
            notifList.appendChild(li);
        });
    
        notifCount.style.display = lowStockItems.length > 0 ? "block" : "none";
        notifCount.textContent = lowStockItems.length;
    }
    
      // Toggle notification dropdown
    notificationIcon.addEventListener("click", function () {
        console.log("i've been clicked");
        notifDropdown.classList.toggle("hidden");
    });
     // Clear notifications when clicking "Clear"
     clearNotifBtn.addEventListener("click", function () {
        notifList.innerHTML = ""; 
        notifCount.style.display = "none"; 
        notifDropdown.classList.add("hidden"); 
    });
     // Close dropdown if clicked outside
     document.addEventListener("click", function (e) {
        if (!notificationIcon.contains(e.target) && !notifDropdown.contains(e.target)) {
            notifDropdown.classList.add("hidden");
        }
    });
    // Close modals
    closeModal.addEventListener("click", () => (modal.style.display = "none"));
    closeSellModal.addEventListener("click", () => (sellModal.style.display = "none"));
    closeDeleteDialog.addEventListener("click", () => (deleteDialog.style.display = "none"));
    closeStockModalBtn.addEventListener("click", () => {addStockModal.style.display = "none"});

    fetchItems();
});
