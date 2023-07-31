const { ChannelType } = require("discord.js");
const joinvoice = require('../models/createvoice');
const joinchannel = require('../models/createchannel');

async function handlevoicejoin(oldState, newState) {
    try{
        if(newState.member.guild === null) return;
    }catch(err){
        return;
    }
    const joinvoicedata = await joinvoice.findOne({ Guild: newState.guild.id });
    const joinchanneldata = await joinchannel.findOne({ Guild: newState.member.guild.id, User: newState.member.id });

    const voicechannel = newState.channel;
    
    if(!joinvoicedata) return;
    if(!voicechannel) {
        return;
    } else{
        if(voicechannel.id === joinvoicedata.Channel){
            if(joinchanneldata){
                try{
                    return await newState.member.send({
                        content: 'You already have a voice channel',
                        ephemeral: true
                    })
                }catch(err){
                    return;
                }
            }else{
                try{
                    const channel = await newState.member.guild.channels.create({
                        type: ChannelType.GuildVoice,
                        name: `${newState.member.user.username} Room`,
                        userLimit: joinvoicedata.VoiceLimit,
                        parent: joinvoicedata.Category
                    })
    
                    try{
                        await newState.member.voice.setChannel(channel.id);
                    }catch(err){
                        return;
                    }
    
                    setTimeout(() => {
                        joinchannel.create({
                            Guild: newState.member.guild.id,
                            Channel: channel.id,
                            User: newState.member.id
                        })
                    }, 500);
                }catch(err){
                    try{
                        await newState.member.send({
                            content: 'I could not create your channel, I may be missing permissions',
                            ephemeral: true
                        })
                    }catch(err){
                        return
                    }
                    return;
                }
            }
        }
    }
}

module.exports = { handlevoicejoin };