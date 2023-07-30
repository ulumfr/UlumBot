const { Schema, model } = require("mongoose");

const warningSchema = new Schema({
    Guild: String,
    UserID: String,
    UserTag: String,
    Content: Array
});

module.exports = model("Warning", warningSchema);