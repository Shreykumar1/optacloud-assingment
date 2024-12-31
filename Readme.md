## Features

1. **User Authentication**: Secure login and signup functionality, allowing users to access their accounts.
2. **Location Entry**: Mandatory location input during signup, with options for manual entry or automatic detection.
3. **Addresses Page**: Users can view all saved addresses, with the ability to add, update, and delete addresses.
4. **Product Browsing**: A dedicated page for users to browse products with detailed information.
5. **Responsive Design**: The application is designed to be mobile-friendly and responsive.

## How to Run the Project

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (for the backend)
- A valid Google API key (for location services)

### Project Structure
```bash
opta-assingment/
├── client/
│ ├── app/
│ ├── components/
│ ├── public/
│ ├── store/
│ ├── utils/
│ ├── .eslintrc.json
│ ├── package.json
│ └── tsconfig.json
└── server/
├── controllers/
├── model/
├── routes/
├── utils/
├── .gitignore
├── package.json
└── tsconfig.json
```

### Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Shreykumar1/optacloud-assingment.git
   ```

2. **Navigate to the Server Directory**:

   ```bash
   cd server
   ```

3. **Install Server Dependencies**:

   ```bash
   npm install
   ```

4. **Create a `.env` File**:
   Create a `.env` file in the server directory and add the following environment variables:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   ```

5. **Run the Server**:

   ```bash
   npm run dev
   ```

6. **Navigate to the Client Directory**:

   ```bash
   cd client
   ```

7. **Install Client Dependencies**:

   ```bash
   npm install
   ```

4. **Create a `.env` File**:
   Create a `.env` file in the client directory and add the following environment variables:

   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

8. **Run the Client**:

   ```bash
   npm run dev
   ```

9. **Access the Application**:
   Open your browser and go to `http://localhost:3000` to view the application.

