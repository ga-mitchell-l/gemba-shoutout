import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GetMessageFunction } from "../functions/get_message.ts";
import { StoreShoutOutFunction } from "../functions/store_shout_out.ts";
import { GetConfigFunction } from "../functions/get_config.ts";

const GiveShoutOutWorkflow = DefineWorkflow({
  callback_id: "give_shout_out_workflow",
  title: "Give a shout out",
  description: "Acknowledge the impact someone had on you",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

const shout_out = GiveShoutOutWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Give a shoutout",
    interactivity: GiveShoutOutWorkflow.inputs.interactivity,
    submit_label: "Share",
    description: "Show a Gemban you appreciate them",
    fields: {
      elements: [{
        name: "receiving_gembans",
        title: "Which Gembans would you like to shout out?",
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.user_id,
        },
      }, {
        name: "guiding_principle",
        title: "What guiding principle do they embody?",
        type: Schema.types.string,
        enum: [
          "Lead with empathy 💓",
          "Relentless focus on the customer value 💼",
          "The best ideas win 💡",
          "Get it done ✅",
          "Embrace failure 😵",
          "Continuously learn and develop others 🎓",
          "Be inclusive 👐",
          "Be ready to adapt 🦀",
          "Leave it better than you found it 🌸",
          "Think different, explore and be inventive 🧭",
          "Never lose your passion in our customer mission ❤️‍🔥",
          "The sum of the team is greater than the parts 🧩",
          "Make a difference in the world 🌍",
        ],
      }, {
        name: "shout_out_message",
        title: "Why do they deserve a shout out?",
        type: Schema.types.string,
        long: true,
      }],
      required: ["receiving_gembans", "shout_out_message"],
    },
  },
);

const config = GiveShoutOutWorkflow.addStep(GetConfigFunction, {});

GiveShoutOutWorkflow.addStep(StoreShoutOutFunction, {
  receiving_gembans: shout_out.outputs.fields.receiving_gembans,
  shouting_gemban: shout_out.outputs.submit_user,
  guiding_principle: shout_out.outputs.fields.guiding_principle,
  shout_out_message: shout_out.outputs.fields.shout_out_message,
  timestamp: shout_out.outputs.timestamp_started,
  bonus_guiding_principle: config.outputs.guiding_principle,
});

const slack_message = GiveShoutOutWorkflow.addStep(GetMessageFunction, {
  receiving_gembans: shout_out.outputs.fields.receiving_gembans,
  shouting_gemban: shout_out.outputs.submit_user,
  guiding_principle: shout_out.outputs.fields.guiding_principle,
  shout_out_message: shout_out.outputs.fields.shout_out_message,
});

GiveShoutOutWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: config.outputs.channel_id,
  message: slack_message.outputs.slack_message,
});

export { GiveShoutOutWorkflow };
