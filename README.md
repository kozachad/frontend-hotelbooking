# Hotel Booking Frontend

This is the frontend application for the Hotel Booking system, built with React.

---

## 🚀 Deployed URLs

- **Production URL:** [https://frontend-hotelbooking.vercel.app](https://frontend-hotelbooking.vercel.app)

---

## 🛠️ Design

- **Framework:** React (JavaScript)
- **Component Structure:** The application is divided into reusable components such as `HotelSearch`, `HotelDetail`, `MyBookings`, `AdminPanel`, and authentication pages.
- **Styling:** CSS modules are used for component-level styling, located in the `src/styles/` directory.
- **Routing:** Page navigation is handled using React Router (if implemented).
- **State Management:** Local state is managed using React hooks (`useState`, `useEffect`). No global state management library is used unless specified.
- **API Integration:** The frontend communicates with a backend API for hotel data, bookings, and user authentication.

---

## 📝 Assumptions

- The backend API endpoints are available and follow RESTful conventions.
- User authentication is handled via JWT tokens or session cookies.
- Admin users have access to the `AdminPanel` for managing hotels and bookings.
- The application is primarily designed for desktop and mobile web browsers.
- Error handling and loading states are implemented for all API calls.

---

## ⚠️ Issues Encountered

- **API CORS Issues:** During development, CORS errors were encountered when connecting to the backend. This was resolved by configuring the backend to allow requests from the frontend domain.
- **Authentication Flows:** Handling token expiration and redirecting users to the login page required additional logic.
- **Responsive Design:** Ensuring the UI looked good on both desktop and mobile required several iterations and CSS adjustments.
- **Deployment:** Initial deployment on Vercel required updating environment variables and build settings.

---

## 📦 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hotel-booking-front.git
   cd hotel-booking-front
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 📄 License

This project is licensed under the MIT License.

