import moment from 'moment';
import pkg from '@slack/bolt';
import log from './logger/log.js'
const { App } = pkg;
import 'dotenv/config';
import connect from './configs/db.js';
import Hobbie from './models/hobbies.js'
import UserState from './models/userState.js'

const app = new App({
    token: process.env.SLACK_BOT_USER_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode:true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000
});

//respond to a simple hello
app.message('hello', async ({message, say}) => {
    try {
        await say(`Hey there <@${message.user}>!`);
    } catch (error) {
        //logger doesnt block IO like console.log does
        log.error(error);
    }
});


// The echo command simply echoes on command
app.command('/bot', async ({ command, ack, respond }) => {
    // Acknowledge command request
    try{
        await ack();
        // console.log(command)
        await respond({
            "blocks": [
                {
                    "type": "input",
                    "element": {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select an item",
                            "emoji": true
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Doing Well",
                                    "emoji": true
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Neutral",
                                    "emoji": true
                                },
                                "value": "value-1"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Feeling Lucky",
                                    "emoji": true
                                },
                                "value": "value-2"
                            }
                        ],
                        "action_id": "welcome_trigger"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Welcome. How are you doing?",
                        "emoji": true
                    }
                }
                
            ]
        });
    }catch(e){
        //logger doesnt block IO like console.log does
        log.error(e);
    }
});

app.action('welcome_trigger', async ({ respond ,action, body, ack, say }) => {
    try {
        
        // Acknowledge the action
        await ack();
        // log.info(action)
        // log.info(`body is`);
        // log.info(body)
        let { text } = action.selected_option.text;
        const { username, id } = body.user;
        const channelName = body.channel.name;
        const channelId = body.channel.id;
        const today = moment().startOf('day');

        //checks if user has answered the question today
        const exists = await UserState.findOne({
        createdAt: {
            $gte: today.toDate(),
            $lte: moment(today).endOf('day').toDate()
        }, channelId, userId: id })

        //if user hasnt answered the question today save in the database
        if(!exists){
            const saveState = await UserState.create({ state: text, userId: id, username, channelId, channelName })
        }        
        
       log.info(text);

        await respond({
            "blocks": [
                {
                    "type": "input",
                    "element": {
                        "type": "multi_static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select options",
                            "emoji": true
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Football",
                                    "emoji": true
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Music",
                                    "emoji": true
                                },
                                "value": "value-1"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Sleep",
                                    "emoji": true
                                },
                                "value": "value-2"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Movies",
                                    "emoji": true
                                },
                                "value": "value-3"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Basketball",
                                    "emoji": true
                                },
                                "value": "value-4"
                            }
                        ],
                        "action_id": "hobbies_select"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "What are your favorite hobbies. ?",
                        "emoji": true
                    }
                }
            ]
        });

       

    } catch (error) {
        //logger doesnt block IO like console.log does
        log.error(error);
    }
});

app.action('hobbies_select', async ({ body, action , ack, say }) => {
    try {
        // Acknowledge the action
        await ack();
        const { username, id } = body.user;
        const channelName = body.channel.name;
        const channelId = body.channel.id;
        const today = moment().startOf('day');

       //Todo Insert into db
        const { selected_options } = action;
        let responseArray = []
        selected_options.map((item , i)=> {
            let response = item.text.text
            if(responseArray.indexOf(response) === -1) responseArray.push(response);
        })

        //update record if it esist else create a record 
        const exist = await Hobbie.findOneAndUpdate({ channelId, userId: id, createdAt: {
            $gte: today.toDate(),
            $lte: moment(today).endOf('day').toDate()
        }, 
        }, { channelId, channelName, username, userId: id,  hobbies: responseArray }, { upsert: true, new: true,})

        log.info(exist);
       
        await say(`<@${body.user.id}> Thank You`);
    } catch (error) {
        //logger doesnt block IO like console.log does
        log.error(error);
    }
});

export const start = async () => {

    try {
        await connect();
        await app.start()
        log.info(`Rest Api started on port ${process.env.PORT}`)
    } catch (error) {
        //logger doesnt block IO like console.log does
        log.error(error);
    }
};

start();

export default app;