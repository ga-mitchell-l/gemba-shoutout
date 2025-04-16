import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const GetMessageFunction = DefineFunction({
  callback_id: "get-message",
  title: "Get the message for the channel",
  source_file: "functions/get_message.ts",
  input_parameters: {
    properties: {
        receiving_gembans: {
            type: Schema.types.array,
            items: {
              type: Schema.slack.types.user_id,
            },
        },
        shouting_gemban: {
            type: Schema.slack.types.user_id,
        },
        guiding_principle: {
            type: Schema.types.string,
        },
        shout_out_message: {
            type: Schema.types.string
        }
    },
    required:["receiving_gembans","shouting_gemban","shout_out_message"]
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
    let slack_message = ``

    if (inputs.receiving_gembans.length == 1) {
        slack_message += `<@${inputs.receiving_gembans[0]}> has `
    } else {
        inputs.receiving_gembans.forEach((element,index) => {
            slack_message += `<@${element}>`
            if (index != inputs.receiving_gembans.length -1) {
                slack_message += ` and `
            }
        });
        slack_message += ` have `
    }

    slack_message += `received a shout out from <@${inputs.shouting_gemban}>!\n`

    if (inputs.guiding_principle != undefined) {
        slack_message += `Guiding principle: *${inputs.guiding_principle}*\n`
    }
    slack_message += `> ${inputs.shout_out_message}\n`

    return { outputs: {slack_message: slack_message} };
  }); 