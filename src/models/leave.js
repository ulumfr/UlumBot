const { Schema, model } = require("mongoose");

const leaveSchema = new Schema({
    Guild: String,
    Channel: String,
    Msg: String,
});

module.exports = model("Leave", leaveSchema);