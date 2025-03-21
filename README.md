# LearnHub - Education Portal for Students

This is an education portal where students can upload resources (PDFs) for others to access, join and create topic-based groups for discussions, ask and answer questions in a forum, and interact with a chatbot powered by Gemini API. The application is AI-moderated to filter out toxic content in user inputs.

## Features
- **Resource Upload**: Students can upload PDF resources which are stored securely in Cloudinary.
- **Groups & Chat**: Users can create and join topic-based groups and chat with others using real-time communication powered by **Socket.IO**.
- **Forum**: Students can ask questions, answer others, and vote on questions (like/dislike).
- **AI Moderation**: Text content in the forum and chat is monitored using an AI-based moderation system. The system detects and alerts users about toxic content (e.g., inappropriate language, hate speech).
- **Chatbot**: Students can interact with a chatbot for assistance powered by the **Gemini API**.
- **Authentication**: Secure login and registration using **JWT (JSON Web Tokens)**.

## Tech Stack
- **Frontend**:
  - **React**: For building the user interface.
  - **TailwindCSS**: For responsive and customizable UI design.

- **Backend**:
  - **Node.js** with **Express**: For handling server-side logic and API routes.
  - **Socket.IO**: For real-time communication in group chats.
  - **JWT**: For user authentication and session management.

- **Database**:
  - **MongoDB**: For storing user data, forum questions, answers, and other related information.

- **AI Moderation**:
  - **Flask**: For serving the AI-based moderation API.
  - **Detoxify**: For detecting toxic content in the text.
  - **Transformers**: For topic extraction using the T5 model.
  - **Sentence-Transformers**: For calculating relevance scores based on topic embeddings.

- **Cloud Storage**:
  - **Cloudinary**: For securely storing PDF resources uploaded by students.

## Folder Structure

This project is organized into three main folders:
- **`client/`**: Contains the React-based frontend code.
- **`flask-recommendation-engine/`**: Contains the Flask-based recommendation engine and AI moderation API.
- **`server/`**: Contains the Node.js/Express backend code.
