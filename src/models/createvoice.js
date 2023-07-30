const { Schema, model } = require("mongoose");

const createvoiceSchema = new Schema({
    Guild: String,
    Channel: String,
    Category: String,
    VoiceLimit: Number
});

module.exports = model("CreateVoice", createvoiceSchema);