import pkg from '@slack/bolt';
const { App } = pkg;
import 'dotenv/config'

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
        console.log(error);
    }
});

app.message('hi', async ({ message, say }) => {
    try {
        await say({
            blocks: [
                {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Hey there <@${message.user}>!`
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Click me"
                    },
                    "action_id": "button_click"
                }
            }
        ],
            text: `Hey there <@${message.user}>!`
        });
    } catch (error) {
        console.log(error);
    }
});



app.action('button_click', async ({ body, ack, say }) => {
   try {
       // Acknowledge the action
       await ack();
       await say(`<@${body.user.id}> clicked the button`);
   } catch (error) {
       console.log(error)
   }
});

export const start = async () => {

    try {
        await app.start()
        console.log(`Rest Api started on port ${process.env.PORT}`)
    } catch (error) {
        console.log(error)
    }
};

start();

export default app;