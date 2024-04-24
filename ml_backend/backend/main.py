import tempfile
import os
import shutil
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware
from pydantic import BaseModel
from model.sample_prediction import ECG
from backend.doctor_agent import Diagnoser
import uvicorn
from backend.prestage_agent import ReportsAgent
from dotenv import load_dotenv

app = FastAPI()
ecg_model = ECG()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, you can specify specific domains instead of "*"
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Specify allowed HTTP methods
    allow_headers=["*"],  # Allow all headers
)

class PatientDetails(BaseModel):
    age: int
    heartbeat_rate: int
    complaint: str
    metadata: str
    chat_history: dict

class PatientSession(BaseModel):
    symptoms: str
    chat_history: dict


@app.post("/upload_records/ecg")
async def upload_files(ecg_lr: UploadFile = File(...), ecg_hr: UploadFile = File(...)):
    try:
        temp_dir = "model/tmp_data/"
        os.makedirs(temp_dir, exist_ok=True)
        ecg_lr_path = temp_dir + ecg_lr.filename
        ecg_hr_path = temp_dir + ecg_hr.filename

        with open(ecg_lr_path, "wb") as lr, open(ecg_hr_path, "wb") as hr:
            lr_co = ecg_lr.file.read()
            hr_co = ecg_hr.file.read()
            lr.write(lr_co)
            hr.write(hr_co)
        file_path = ecg_lr.filename[:-4]
        prediction = ecg_model.predict(file_path, temp_dir)
        return {"messages": "Files uploaded successfully", "prediction": prediction}

    except Exception as e:
        return {'message': str(e)}

@app.post("/ask_questions")
async def run_diagnosis(patient_info: PatientDetails):
    """Agent generates validation question to help diagnosis process"""
    diagnoser = Diagnoser()
    follow_up_question = diagnoser.ask_validation_questions(symptoms=patient_info.complaint,
                                                            chat_history=patient_info.chat_history)
    return {'follow_question': follow_up_question}

@app.post("/get_required_reports")
async def get_requirements(patient_info: PatientDetails):
    """Get the required reports and tests"""
    report_agent = ReportsAgent.from_llm()
    output = report_agent.run(conversation_history=patient_info.chat_history, patient_complain=patient_info.complaint)
    return {'suggested_reports': output}

@app.post("/final_diagnosis")
async def final_diagnosis(patient_session: PatientSession):
    """Get the final diagnosis"""
    diagnoser = Diagnoser()
    chat_history = patient_session.chat_history
    conversation_string = ""
    for doctor_response, patient_response in chat_history.items():
        conversation_string += f"Question: {doctor_response} \n Patient's Response: {patient_response}"

    required_reports = diagnoser.run_final_diagnosis(patient_session.symptoms, patient_session.chat_history)
    return {'suggested_reports': required_reports}


if __name__ == "__main__":
    uvicorn.run(app, port=8000)
