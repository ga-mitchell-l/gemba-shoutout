import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const GetMessageFunction = DefineFunction({
  callback_id: "get-message",
  title: "Get the message for the channel",
  source_file: "functions/get_message.ts",
  input_parameters: {
    properties: {
        receiving_gemban: {
            type: Schema.slack.types.user_id,
        },
        guiding_principle: {
            type: Schema.types.string,
        },
        shout_out_message: {
            type: Schema.types.string
        }
    },
    required:[]
  },
  output_parameters: {
    properties: {
        slack_message: {
            type: Schema.types.string
        }
    },
    required:["slack_message"]
  }
});


export default SlackFunction(GetMessageFunction,({ inputs }) => {
    const slack_message = `<@${inputs.receiving_gemban}> has received a shout out!\n` +
    `Guiding principle *${inputs.guiding_principle}*\n` +
    `> ${inputs.shout_out_message}\n`

    return { outputs: {slack_message: slack_message} };
  }); 
