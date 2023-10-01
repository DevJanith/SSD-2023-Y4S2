import express from "express";
import passport from "passport";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

router.get("/auth/google/data", async (req, res) => {
  const token = req.query.credential;

  try {
    const client = new OAuth2Client(process.env.CLIENT_URL);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    // Extract user details from the payload (e.g., name, email, picture, etc.)
    const userDetails = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };

    // You can now use the userDetails in your application as needed
    res.json(userDetails);
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default router;
