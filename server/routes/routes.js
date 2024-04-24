const express = require("express");
const {
  signUp,
  login,
  savePersonalDetails,
  startDiagnostic,
  runDiagnosis,
  finalDiagnosis,
  getRequiredReports,
  getUserProfile,
} = require("../controllers");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.post("/signup", signUp);

router.post("/login", login);

router.get("/user_profile", isAuth, getUserProfile);

router.post("/details", isAuth, savePersonalDetails);

router.post("/start_diagnostic", isAuth, startDiagnostic);

router.post("/run_diagnosis", isAuth, runDiagnosis);

router.get("/final_diagnosis", isAuth, finalDiagnosis);

router.get("/get_required_reports", isAuth, getRequiredReports);

// Export the router
module.exports = router;
