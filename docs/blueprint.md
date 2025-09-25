# **App Name**: Brewly Coffee

## Core Features:

- Product Display: Display coffee, tea, and pastries with images, names, and prices, fetched dynamically from Firestore.
- Menu Filtering: Allow users to filter menu items by category (hot/cold, tea/coffee, pastries).
- Cart Management: Implement a slide-in cart drawer for adding, removing, and viewing selected items.
- Secure Authentication: Implement Firebase Authentication for user login (Google, Facebook, Email) before checkout.
- Store Locator: Display a map with store markers using Leaflet.js, sourced from Firestore.
- Loyalty Point Calculation: Determine the number of loyalty points to give a user on a purchase, using an AI tool to decide the amount based on past history.
- Order History: Display past orders fetched from the orders collection in Firestore.

## Style Guidelines:

- Primary color: Earthy brown (#6B4226) to reflect coffee and warmth.
- Background color: Cream (#F5F0E6) for a light and inviting feel.
- Accent color: Dark green (#2E473B) as a contrasting color to suggest a natural vibe.
- Headline font: 'Playfair' (serif) for titles, providing an elegant look.
- Body font: 'Inter' (sans-serif) for body text, ensuring readability and a modern feel.
- Use minimalistic, custom-designed icons for categories and actions.
- Employ subtle animations (Framer Motion) for transitions, modal openings, and micro-interactions.