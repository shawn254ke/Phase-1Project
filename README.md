# Phase-1Project
phase -1 javascript project 
# Inventory Notification System

This project is an **Inventory Notification System** that tracks stock levels and alerts users when items are running low. The system dynamically updates notifications and includes a **dark mode** feature.

---

## Features
- **Stock Monitoring**: Detects low-stock items and displays notifications.  
- **Live Notifications**: Updates in real time when an item's quantity changes.  
- **Dark Mode**: Allows users to switch between light and dark themes.  
- **User-Friendly UI**: Interactive design for easy navigation.  

---

## How It Works  

1. **Filtering Items**:  
   - The system checks if an item’s `quantity` is **≤ 5**.  
   - If true, it generates a notification in the list.  

2. **Displaying Notifications**:  
   - Notifications appear in a dropdown list.  
   - The total count of low-stock items is displayed.  

3. **Dark Mode**:  
   - A toggle button allows users to switch between **light mode** and **dark mode**.  
   - Saves user preference using `localStorage`.  

---

## Setup Instructions  

### 1. Clone the Repository  
```sh
git clone https://github.com/shawn254ke/Phase-1Project.git
cd inventory-notifications

