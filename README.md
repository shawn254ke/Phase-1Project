# Phase-1 Project: Inventory Management System  

This project is an **Inventory Management System** that allows users to **add, delete, sell, and update inventory** while tracking **sales and stock levels**. It includes a **real-time notification system** for low-stock alerts and a **dark mode** feature for improved user experience.

---

## Features  

- **Inventory Management**: Users can add, update, delete, and sell items.  
- **Sales Tracking**: Monitors sold items and updates stock automatically.  
- **Stock Notifications**: Alerts users when stock runs low.  
- **Dark Mode**: Switch between light and dark themes.  
- **User-Friendly UI**: Simple and interactive design.  

---

## How It Works  

### 1. Managing Inventory  
- Users can **add new items** with a name, quantity, and price.  
- Items can be **updated or deleted** from the inventory.  
- The system **automatically updates stock** after a sale.  

### 2. Stock Notifications  
- If an item’s `quantity` is **≤ 5**, a notification is displayed.  
- Notifications appear in a **dropdown list** with a count.  

### 3. Dark Mode  
- A toggle button switches between **light mode** and **dark mode**.  
- The system saves user preference using `localStorage`.  

---

## Setup Instructions  

### 1. Clone the Repository  
```sh
git clone https://github.com/shawn254ke/Phase-1Project.git
cd Phase-1Project
