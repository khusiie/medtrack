## MEDTRACK - Your Personal Health Assitant

Medtrack is a medical recommender leveraging machine learning to provide personalized healthcare suggestions based on individual health data, optimizing treatment decisions and improving patient outcomes.
<p align="center">
<img src="https://github.com/khusiie/medtrack/assets/112059973/2bdf816e-6a97-489a-9dd3-d482afaf399b" width="200" style="margin-right: 40px;">
</p>

## Description
MedTrack provides a user-friendly interface for doctors to streamline their workflow and enhance patient care. It allows doctors to efficiently record patient data, including medical history, symptoms, and treatment plans, and store them securely in the system.

One of the key features of MedTrack is its diagnosis generation functionality. Based on the recorded patient data and audio notes, MedTrack utilizes mutli AI Agent framework incorporated with credible and acknowledged medical knowledge databases to suggest potential diagnoses for the patient's condition. Doctors can review and verify these diagnoses, ensuring accuracy and reliability in patient care.

Welcome to our project! This guide will help you set up your development environment and get started with our React web app, which uses Nodejs for backend services, a custom multilabel classification model, and FastAPI for hosting multi AI agent framework.

## Prerequisites

Before you begin, ensure you have the following installed:
- Python: For our ML agent for recommending Medical tests.
- Nodejs: For running our backend server.
- MongoDB: As a database.

### Setting Up the React Web App/Frontend

1. **Clone this repository**: Open your terminal or command prompt and run the following command:
```bash:
git clone
```
2. Navigate into `client` directory/folder:
```bash
cd client
```
3. Install dependencies including React:
```bash
npm install
```
4. Run the frontend server:
```bash
npm start
```

### Setting Up the Backend Server
1. Navigate into `server` directory:
```bash
cd server
```
2. Install Backend dependencies:
```bash
npm install
```
3. Start the backend server:
```bash
npm start
```

### Setting up ML agent:
1. Navigate into `ml_backend` directory.
```bash
cd ml_backend
```
2. Install dependencies to run our ML model.
```bash
pip install -r requirements.txt
```
3. Run the server
```bash
python -m backend.main
```

## Training

- For training the CNN architecture for Multilabel data classification (ECG).
  - Download the data from the website [Kaggle](https://www.kaggle.com/datasets/khyeh0719/ptb-xl-dataset) and place it in `model/data/`
  - Run `python model/train.py`

## Features

- **Question Generation**: Generates questions for patients to help filter potential diseases.
- **Suggested Tests**: Provides suggested tests based on the patient's symptoms and responses.
- **Phase 1 Generation**: Offers a phase 1 generation of diagnosis based on test results.
- **Report Analysis**: Analyzes patient reports to determine if they are normal or not.

## UI Preview
<p align="center">
  <img src="https://github.com/khusiie/medtrack/assets/112059973/a5d01325-fb05-4371-bd63-9fafcdd3f601" alt="Desktop - 3" width="500" style="margin-right: 40px;">
  <img src="https://github.com/khusiie/medtrack/assets/112059973/fbb1b010-25b2-4ac6-9e41-9ae32d529b05" alt="Desktop - 6" width="500" style="margin-right: 20px;">
</p>

<p align="center">
  <img src="https://github.com/khusiie/medtrack/assets/112059973/c6b0fbe3-c3fc-4cb8-ac65-085e5291a0f0" alt="Desktop - 2" width="500" style="margin-right: 20px;">
  <img src="https://github.com/khusiie/medtrack/assets/112059973/965eeee3-e47d-4bff-b0aa-83078ceafd94" alt="Desktop - 4" width="500">
</p>

<p align="center">
  <img src="https://github.com/khusiie/medtrack/assets/112059973/d12552e0-292c-4480-89d5-bbcecbffb0c0" alt="Desktop - 7" width="500">
   <img src="https://github.com/khusiie/medtrack/assets/112059973/4623c5ac-d85e-44ab-9696-cf1f575e5925" alt="Desktop - 5" width="500" style="margin-right: 20px;">
</p>

## Technologies Used

- **Frontend**: React for building the user interface.
- **Backend**: NodeJS + Express for handling authentication and defining endpoints.
- **Machine Learning**: TensorFlow for developing the custom ML model for multi-label classification.
- **Database**: MongoDB for storing user data such as conversation with LLM.
