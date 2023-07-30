const { Schema, model } = require("mongoose");

const createchannelSchema = new Schema({
    Guild: String,
    Channel: String,
    User: String
});

module.exports = model("CreateChannel", createchannelSchema);