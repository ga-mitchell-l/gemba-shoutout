import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import {
  DatastoreQueryResponse,
  DatastoreSchema,
} from "https://deno.land/x/deno_slack_api@2.8.0/typed-method-types/apps.ts";

export const SpinRaffleFunction = DefineFunction({
  callback_id: "spin-raffle",
  title: "Get the raffle winner of the month",
  source_file: "functions/spin_raffle.ts",
  input_parameters: {
    properties: {
      event_timestamp: {
        type: Schema.slack.types.timestamp,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      next_guiding_principle: {
        type: Schema.types.string,
      },
      scheduled: {
        type: Schema.types.string,
      },
    },
    required: [
      "event_timestamp",
      "channel_id",
      "scheduled",
    ],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  SpinRaffleFunction,
  async ({ inputs, client }) => {
    const {
      event_timestamp,
      channel_id,
      scheduled,
    } = inputs;

    const raffle_date = new Date(event_timestamp * 1000);

    // if this was called by the scheduled trigger and it is not the
    // first of the month, do not continue
    if (scheduled === "true" && raffle_date.getDate() !== 1) {
      console.timeLog("Raffle not run as it was scheduled and it is not the first of the month.")
      return { outputs: {} };
    }

    const { month_start_timestamp, month_end_timestamp } = getMonthTimeStamps(
      raffle_date,
    );

    const getShoutOutResult = await client.apps.datastore.query({
      datastore: "ShoutOutDataStore",
      expression: "#timestamp between :time_start AND :time_end",
      expression_attributes: { "#timestamp": "timestamp" },
      expression_values: {
        ":time_start": month_start_timestamp,
        ":time_end": month_end_timestamp,
      },
    });
    if (!getShoutOutResult.ok) {
      return { error: `Failed get shout outs: ${getShoutOutResult.error}` };
    }

    const { shouting_count, receiving_count, winner_user_id } = getRaffleWinner(
      getShoutOutResult,
    );

    const month = raffle_date.toLocaleDateString("en-GB", { month: "long" });
    const nextMonth = new Date(
      raffle_date.getFullYear(),
      raffle_date.getMonth() + 1,
      1,
    ).toLocaleDateString("en-GB", { month: "long" });
    const emoji1 = GetRandomEmoji();
    const emoji2 = GetRandomEmoji();

    let raffle_message_1 =
      `:gemba: Hi Gemba! :gemba: **${month}** has brought us `;
    raffle_message_1 += `**${shouting_count}** Gembans shouting out - `;
    raffle_message_1 +=
      `with a total of **${receiving_count}** of you receiving shoutouts!\n\n`;
    raffle_message_1 +=
      `Remember, you get **double points** if your shoutout is tagged with one of `;
    raffle_message_1 +=
      `<https://gembaadvantage.atlassian.net/wiki/spaces/BA/pages/1011515428/Our+Guiding+Principles|our Guiding Principles>, `;
    raffle_message_1 +=
      `and **triple shoutout points** if it's the guiding principle of the month! :martial_arts_uniform: :rocket: :handshake::skin-tone-3: :first_place_medal:\n\n`;
    raffle_message_1 += `\n`;
    raffle_message_1 +=
      `:drum_with_drumsticks: :drum_with_drumsticks: :drum_with_drumsticks:\n\n`;
    raffle_message_1 +=
      `Our winner for ${month} is <@${winner_user_id}> ${emoji1}${emoji2}\n`;
    raffle_message_1 += `\n`;

    let raffle_message_2 = ``;
    if (inputs.next_guiding_principle !== undefined) {
      raffle_message_2 +=
        `${nextMonth}'s guiding principle is: *${inputs.next_guiding_principle}*\n`;
    }
    raffle_message_2 +=
      `Don’t forget to <https://gembaadvantage.atlassian.net/servicedesk/customer/portal/14|raise a ticket> `;
    raffle_message_2 +=
      `and nominate people for Small Awards too! We want to continue hearing and celebrating you! `;
    raffle_message_2 += `:admission_tickets: :admission_tickets:`;

    const getUserResult = await client.users.profile.get({
      user: winner_user_id,
    });
    if (!getUserResult.ok) {
      return { error: `Failed get user: ${getUserResult.error}` };
    }
    const winner_avatar_url = getUserResult.profile.image_192;

    const blocks = raffleWinnerBlocks(
      raffle_message_1,
      winner_avatar_url,
      raffle_message_2,
    );

    const postMessageResult = await client.chat.postMessage({
      channel: channel_id,
      blocks: blocks,
      text: "Gemba Raffle results failed to post message correctly",
    });
    if (!postMessageResult.ok) {
      return {
        error: `Failed post raffle message: ${postMessageResult.error}`,
      };
    }

    // now update the config to be next months guiding principle

    return { outputs: {} };
  },
);

function getRaffleWinner(result: DatastoreQueryResponse<DatastoreSchema>) {
  const raffle_entries: string[] = [];
  const shouting_gembans = new Set<string>();
  const receiving_gembans = new Set<string>();

  result.items.forEach((shoutout) => {
    for (let i = 0; i < shoutout.points; i++) {
      raffle_entries.push(shoutout.receiving_gemban);
      receiving_gembans.add(shoutout.receiving_gemban);

      raffle_entries.push(shoutout.shouting_gemban);
      shouting_gembans.add(shoutout.shouting_gemban);
    }
  });

  const winnerIndex = Math.floor(Math.random() * (raffle_entries.length - 1));
  const winner_user_id = raffle_entries[winnerIndex];
  const shouting_count = shouting_gembans.size;
  const receiving_count = receiving_gembans.size;
  return { shouting_count, receiving_count, winner_user_id };
}

function getMonthTimeStamps(raffle_date: Date) {
  const month_start = new Date(
    raffle_date.getFullYear(),
    raffle_date.getMonth(),
    1,
  );

  let month_end = new Date();

  if (raffle_date.getMonth() == 11) {
    month_end = new Date(raffle_date.getFullYear() + 1, 0, 1);
  } else {
    month_end = new Date(
      raffle_date.getFullYear(),
      raffle_date.getMonth() + 1,
      1,
    );
  }

  const month_end_timestamp = Math.floor(month_end.getTime() / 1000);
  const month_start_timestamp = Math.floor(month_start.getTime() / 1000);
  return { month_start_timestamp, month_end_timestamp };
}

function GetRandomEmoji(): string {
  const yay_emojis = new Array<string>(
    ":partying_face:",
    ":bongo_blob:",
    ":blob_excited:",
    ":blob-hype:",
    ":blueblob_jump:",
    ":celebrate:",
    ":frog-yay:",
    ":meow_party:",
    ":dance-doggo:",
    ":headbang:",
    ":green_heart:",
    ":tada:",
  );
  const index = Math.floor(Math.random() * (yay_emojis.length - 1));
  return yay_emojis[index];
}

function raffleWinnerBlocks(
  message_part_1: string,
  winner_avatar_url: string,
  message_part_2: string,
): any[] {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `Monthly Shout Out Raffle`,
      },
    },
    {
      type: "markdown",
      text: message_part_1,
    },
    {
      type: "image",
      image_url: winner_avatar_url,
      alt_text: "The winner's avatar",
    },
    {
      type: "markdown",
      text: message_part_2,
    },
  ];
}
