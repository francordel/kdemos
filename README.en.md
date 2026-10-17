[Español](README.md) | **English**
# Meetup Calendar [kdemos.com](https://kdemos.com)

This is a React project for organizing meetups among friends. Users can select the days they are available to meet, indicate the days they cannot meet, and view recommendations based on the availability of other users. User data is stored and processed in Firebase or through Cloudflare Pages Workers, allowing multiple users to interact with the same calendar.

## Features

- **Day Selection**: Users can select the days they are available (green), the days they cannot meet (red), and the days they could make an effort to meet (orange).
- **Day Recommendation**: After users make their selections, the system suggests the days with the greatest availability (more green and fewer orange) for all users.
- **Firebase or Cloudflare Workers Persistence**: User preferences are stored in Firebase in real time or, alternatively, accessed through Cloudflare Pages Workers for greater security and control.
- **Interactive Interface**: An easy-to-use interface where users can click calendar days to indicate their availability.

## Technologies Used

- **React**: Library for building the user interface.
- **Firebase**: Real-time database for storing user preferences.
- **Cloudflare Workers**: Used to deploy a backend layer as a secure proxy between the frontend and the database.
- **React Router**: Handles routing and navigation between calendar screens.
- **CSS Grid**: Displays calendar days visually and in an organized manner.

## Installation

### Prerequisites

Make sure you have Node.js installed on your machine.

### Clone the Repository

1. Clone this repository to your local machine:

```bash
git clone https://github.com/tu-usuario/calendario-quedadas.git
```

2. Navigate to the project directory:

```bash
cd calendario-quedadas
```

3. Install the project dependencies:

```bash
npm install
```

### Environment Configuration

The project can operate with three data storage modes: `mock`, `firebase`, or `cloudflare`.

Configure the `.env` file with the desired mode:

```env
REACT_APP_DB_MODE=cloudflare
```

### Firebase Configuration (Firebase Mode or Local Development)

1. Create a project in the Firebase Console.
2. Enable the Firestore database.
3. Obtain your Firebase credentials (API Key, Auth Domain, etc.) and configure them in an `.env` file:

```env
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
```

### Start the Project

Once everything is configured, you can start the application locally:

```bash
npm start
```

This will open the application in your browser at http://localhost:3000.

## Production Deployment

This project is ready to be deployed on platforms such as Vercel, Netlify, or Cloudflare Pages.

### Deploying to Cloudflare Pages (Recommended Mode for Production)

1. Create an account on Cloudflare.
2. Connect your GitHub repository.
3. Configure the environment variables in the **Settings > Functions > Environment Variables** section:

```env
FIREBASE_PROJECT_ID
FIREBASE_API_KEY
```

4. Make sure your environment uses the following mode:

```env
REACT_APP_DB_MODE=cloudflare
```

5. Cloudflare will deploy your application and run the Workers as the backend.

### Deploying to Vercel

1. Create an account on Vercel.
2. Connect your GitHub repository to Vercel.
3. Configure the environment variables for Firebase (`apiKey`, `authDomain`, etc.).
4. Set the following mode so the frontend can access Firebase directly:

```env
REACT_APP_DB_MODE=firebase
```

## Contributions

Contributions are welcome, and we take part in Hacktoberfest.

- Start with the **good first issues**: each one indicates which files to modify and how to test it.
- Read the contribution guide, which explains the three-command setup using the mock mode and requires no credentials.
- Do you speak another language? Translating KDEMOS is a great first contribution.

## License

This project is licensed under the MIT License.
