import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { FindGIFFunction } from "../functions/find_gif.ts";

/**
 * A workflow is a set of steps that are executed in order. Each step in a
 * workflow is a function – either a built-in or custom function.
 * Learn more: https://api.slack.com/automation/workflows
 */
const GiveShoutOutWorkflow = DefineWorkflow({
  callback_id: "give_kudos_workflow",
  title: "Give kudos",
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
const kudo = GiveShoutOutWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Give a shoutout",
    interactivity: GiveShoutOutWorkflow.inputs.interactivity,
    submit_label: "Share",
    description: "Show a Gemban you appreciate them",
    fields: {
      elements: [{
        name: "gemban",
        title: "Whose deeds are deemed worthy of a kudo?",
        description: "Recognizing such deeds is dazzlingly desirable of you!",
        type: Schema.slack.types.user_id,
      }, {
        name: "kudo_channel",
        title: "Where should this message be shared?",
        type: Schema.slack.types.channel_id,
      }, {
        name: "kudo_message",
        title: "What would you like to say?",
        type: Schema.types.string,
        long: true,
      }, {
        name: "kudo_vibe",
        title: 'What is this kudo\'s "vibe"?',
        description: "What sorts of energy is given off?",
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
      required: ["gemban", "kudo_channel", "kudo_message"],
    },
  },
);

/**
 * A custom function can be added as a workflow step to modify input data,
 * collect additional data for the response, and return information for use in
 * later steps.
 * Learn more: https://api.slack.com/automation/functions/custom
 */
const gif = GiveShoutOutWorkflow.addStep(FindGIFFunction, {
  vibe: kudo.outputs.fields.kudo_vibe,
});

/**
 * Messages can be sent into a channel with the built-in SendMessage function.
 * Learn more: https://api.slack.com/automation/functions#catalog
 */
GiveShoutOutWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: kudo.outputs.fields.kudo_channel,
  message:
    `*Hey <@${kudo.outputs.fields.gemban}>!* Someone wanted to share some kind words with you :otter:\n` +
    `> ${kudo.outputs.fields.kudo_message}\n` +
    `<${gif.outputs.URL}>`,
});

export { GiveShoutOutWorkflow };
