const sgMail = require("@sendgrid/mail");

const sendgridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPIKey);

const fromEmail = "leballote@intekglobal.com";

const sendWelcomeEmail = (toEmail, name) => {
  sgMail.send({
    to: toEmail,
    from: fromEmail,
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
};

const sendCancelationEmail = (toEmail, name) => {
  sgMail.send({
    to: toEmail,
    from: fromEmail,
    subject: "We are sorry you are leaving!",
    text: `We hope you had a great time ${name}! See you soon!`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
