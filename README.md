# RWS – Robot Welding Services Website

## Stack
- **Frontend**: React (CRA)
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Email**: Nodemailer (optional)

## Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB running locally OR MongoDB Atlas URI

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MONGO_URI and optional email settings
npm run dev
```

### 3. Frontend Setup (new terminal)
```bash
cd client
npm install
npm start
```

Visit http://localhost:3000

## Environment Variables (server/.env)
| Variable | Description |
|---|---|
| PORT | Server port (default: 5000) |
| MONGO_URI | MongoDB connection string |
| EMAIL_USER | Gmail address for notifications |
| EMAIL_PASS | Gmail App Password |

## Build for Production
```bash
cd client && npm run build
```
Serve the `client/build` folder with your Node server by adding `express.static`.

## Contact Form
- Submissions are saved to MongoDB `contacts` collection
- Optional email notification to `sales@robotweldingservices.com`
