const joinchannel = require('../models/createchannel');

async function handlevoiceleave(oldState, newState) {
    try{
        if(oldState.member.guild === null) return;
    }catch(err){
        return;
    }

    if (oldState.selfMute !== newState.selfMute || oldState.selfDeaf !== newState.selfDeaf) {
        return;
    }

    const leavechanneldata = await joinchannel.findOne({ Guild: oldState.member.guild.id, User: oldState.member.id });

    if(!leavechanneldata) {
        return;
    } else{
        const voicechannel = await oldState.member.guild.channels.cache.get(leavechanneldata.Channel);

        try {
            await voicechannel.delete();
        } catch (error) {
            return;
        }

        await joinchannel.deleteOne({ Guild: oldState.guild.id, User: oldState.member.id });
    }
}

module.exports = { handlevoiceleave };