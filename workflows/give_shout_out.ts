import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GetMessageFunction } from "../functions/get_message.ts";

/**
 * A workflow is a set of steps that are executed in order. Each step in a
 * workflow is a function – either a built-in or custom function.
 * Learn more: https://api.slack.com/automation/workflows
 */
const GiveShoutOutWorkflow = DefineWorkflow({
  callback_id: "give_shout_out_workflow",
  title: "Give a shout out",
  description: "Acknowledge the impact someone had on you",
  input_parameters: {
    properties: {
      /**
       * This workflow users interactivity to collect input from the user.
       * Learn more: https://api.slack.com/automation/forms#add-interactivity
       */
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

/**
 * Collecting input from users can be done with the built-in OpenForm function
 * as the first step.
 * Learn more: https://api.slack.com/automation/functions#open-a-form
 */
const shout_out = GiveShoutOutWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Give a shoutout",
    interactivity: GiveShoutOutWorkflow.inputs.interactivity,
    submit_label: "Share",
    description: "Show a Gemban you appreciate them",
    fields: {
      elements: [{
        name: "gemban",
        title: "Which Gemban would you like to shout out?",
        type: Schema.slack.types.user_id,
      }, {
        name: "shout_out_channel",
        title: "Where should this message be shared?",
        type: Schema.slack.types.channel_id,
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
      required: ["gemban", "shout_out_channel", "shout_out_message"],
    },
  },
);

/**
 * A custom function can be added as a workflow step to modify input data,
 * collect additional data for the response, and return information for use in
 * later steps.
 * Learn more: https://api.slack.com/automation/functions/custom
 */
const slack_message = GiveShoutOutWorkflow.addStep(GetMessageFunction, {
  receiving_gemban: shout_out.outputs.fields.gemban,
  shouting_gemban: shout_out.outputs.submit_user,
  guiding_principle: shout_out.outputs.fields.guiding_principle,
  shout_out_message: shout_out.outputs.fields.shout_out_message,
});

/**
 * Messages can be sent into a channel with the built-in SendMessage function.
 * Learn more: https://api.slack.com/automation/functions#catalog
 */
GiveShoutOutWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: shout_out.outputs.fields.shout_out_channel,
  message: slack_message.outputs.slack_message
});

export { GiveShoutOutWorkflow };
