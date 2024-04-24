const jwt = require("jsonwebtoken");
const axios = require("axios");

const Users = require("../models/User");
const Diagnose = require("../models/Diagnose");
const { createChatHistory } = require("../helpers");
const PersonalDetails = require("../models/PersonalDetails");

async function signUp(req, res) {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, errors: "existing email" });
  }

  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
}

async function login(req, res) {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_key");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong Email Id" });
  }
}

async function savePersonalDetails(req, res) {
  console.log(req.body, req.user);
  const details = new PersonalDetails({ ...req.body, user_id: req.user.id });
  await details.save();

  return res.json({ success: true });
}

async function startDiagnostic(req, res) {
  const diagnose = new Diagnose({
    user_id: req.user.id,
    symptoms: req.body.symptoms,
    ecg_prediction: req.body.ecg_prediction,
  });

  await diagnose.save();
  return res.json({ success: true });
}

async function runDiagnosis(req, res) {
  const user_answer = req.body?.user_answer;
  const llm_question = req.body?.llm_question;

  const diagnose = await Diagnose.findOne({ user_id: req.user.id });
  if (!diagnose) {
    return res.json({ success: false, errors: "No diagnosis found" });
  }

  const diagnoseChatHistory = diagnose.chatHistory;

  if (diagnoseChatHistory.length > 0 && !user_answer && !llm_question) {
    const is_last_message_llm =
      diagnoseChatHistory[diagnoseChatHistory.length - 1].llm;
    if (is_last_message_llm) {
      return res.json({ success: true, chatHistory: diagnoseChatHistory });
    } else {
      const userProfile = await PersonalDetails.findOne({
        user_id: req.user.id,
      });

      const chatHistory = createChatHistory(diagnoseChatHistory);
      const llm_payload = {
        chat_history: chatHistory,
        age: userProfile.age,
        complaint: diagnose.symptoms,
        heartbeat_rate: 80,
        metadata: "Some Metadata",
      };

      const response = await axios.post(
        "http://localhost:8000/ask_questions",
        llm_payload
      );

      diagnoseChatHistory.push({
        message: response.data.follow_question,
        llm: true,
      });
      return res.json({ success: true, chatHistory: diagnoseChatHistory });
    }
  }

  if (user_answer && llm_question) {
    diagnose.chatHistory.push({ message: llm_question, llm: true });
    diagnose.chatHistory.push({ message: user_answer, llm: false });
    await diagnose.save();
    diagnoseChatHistory.push({ message: llm_question, llm: true });
    diagnoseChatHistory.push({ message: user_answer, llm: false });
  }

  const userProfile = await PersonalDetails.findOne({ user_id: req.user.id });

  const chatHistory = createChatHistory(diagnoseChatHistory);
  const llm_payload = {
    chat_history: chatHistory,
    age: userProfile.age,
    complaint: diagnose.symptoms,
    heartbeat_rate: 80,
    metadata: "Some Metadata",
  };

  const response = await axios.post(
    "http://localhost:8000/ask_questions",
    llm_payload
  );

  return res.json({ success: true, response: response.data });
}

async function finalDiagnosis(req, res) {
  try {
    const diagnose = await Diagnose.findOne({ user_id: req.user.id });
    if (!diagnose) {
      return res.json({ success: false, errors: "No diagnosis found" });
    }

    const chatHistory = createChatHistory(diagnose.chatHistory);
    const llm_payload = {
      chat_history: chatHistory,
      symptoms: diagnose.symptoms,
    };

    const response = await axios.post(
      "http://localhost:8000/final_diagnosis",
      llm_payload
    );

    return res.json({ success: true, response: response.data });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, errors: "Error in final diagnosis" });
  }
}

async function getRequiredReports(req, res) {
  const diagnose = await Diagnose.findOne({ user_id: req.user.id });
  if (!diagnose) {
    return res.json({ success: false, errors: "No diagnosis found" });
  }

  const userProfile = await PersonalDetails.findOne({ user_id: req.user.id });

  const chatHistory = createChatHistory(diagnose.chatHistory);
  const llm_payload = {
    chat_history: chatHistory,
    age: userProfile.age,
    complaint: diagnose.symptoms,
    heartbeat_rate: 80,
    metadata: "Some Metadata",
  };

  const response = await axios.post(
    "http://localhost:8000/get_required_reports",
    llm_payload
  );

  return res.json({ success: true, response: response.data });
}

async function getUserProfile(req, res) {
  const userProfile = await PersonalDetails.findOne({ user_id: req.user.id });

  const response = {
    age: userProfile.age,
    height: userProfile.height,
    weight: userProfile.weight,
    gender: userProfile.gender,
    contactNumber: userProfile.contactNumber,
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  };

  return res.json({ success: true, response });
}

module.exports = {
  signUp,
  login,
  savePersonalDetails,
  startDiagnostic,
  runDiagnosis,
  finalDiagnosis,
  getRequiredReports,
  getUserProfile,
};
