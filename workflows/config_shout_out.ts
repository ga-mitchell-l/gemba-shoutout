import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { StoreConfigFunction } from "../functions/store_config.ts";

const ConfigShoutOutWorkflow = DefineWorkflow({
  callback_id: "config_shout_out_workflow",
  title: "Configure Shoutouts",
  description: "Set the config for Gemba shout outs ",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

const config = ConfigShoutOutWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Configure Shout Outs",
    interactivity: ConfigShoutOutWorkflow.inputs.interactivity,
    submit_label: "Update",
    description: "Configure the shout outs",
    fields: {
      elements: [{
        name: "shout_out_channel",
        title: "Where should this message be shared?",
        type: Schema.slack.types.channel_id,
      }, {
        name: "guiding_principle",
        title: "Current guiding principle",
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
        name: "next_guiding_principle",
        title: "Next month's guiding principle",
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
      }],
      required: ["shout_out_channel"],
    },
  },
);

const storeConfig = ConfigShoutOutWorkflow.addStep(StoreConfigFunction, {
    channel_id: config.outputs.fields.shout_out_channel,
    guiding_principle: config.outputs.fields.guiding_principle,
    next_guiding_principle: config.outputs.fields.next_guiding_principle,
    user_id: config.outputs.submit_user
  })
  
ConfigShoutOutWorkflow.addStep(Schema.slack.functions.SendEphemeralMessage, {
    channel_id: config.outputs.fields.shout_out_channel,
    user_id: config.outputs.submit_user,
    message: storeConfig.outputs.message
  }
  );

  export { ConfigShoutOutWorkflow };
