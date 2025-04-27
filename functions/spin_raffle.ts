import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

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
        type: Schema.types.string
      }
    },
    required: [
      "event_timestamp",
      "channel_id",
    ],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

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
    ":tada:"
  );
  const index = Math.floor(Math.random() * (yay_emojis.length - 1));
  return yay_emojis[index]
}

export default SlackFunction(
  SpinRaffleFunction,
  async ({ inputs, client }) => {
    const {
      event_timestamp,
      channel_id,
    } = inputs;

    const raffle_date = new Date(event_timestamp * 1000);

    // if (raffle_date.getDate()!==1) {
    //     return
    // }
    const { month_start_timestamp, month_end_timestamp } = getMonthTimeStamps(
      raffle_date,
    );

    const result = await client.apps.datastore.query({
      datastore: "ShoutOutDataStore",
      expression: "#timestamp between :time_start AND :time_end",
      expression_attributes: { "#timestamp": "timestamp" },
      expression_values: {
        ":time_start": month_start_timestamp,
        ":time_end": month_end_timestamp,
      },
    });

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
    
    const month = raffle_date.toLocaleDateString("en-GB", { month: "long" });
    const shouting_count = shouting_gembans.size;
    const receiving_count = receiving_gembans.size;
    const nextMonth = new Date(
      raffle_date.getFullYear(),
      raffle_date.getMonth() + 1,
      1,
    ).toLocaleDateString("en-GB", { month: "long" });
    const emoji1 = GetRandomEmoji();
    const emoji2 = GetRandomEmoji();

    let raffle_message = `Hi Gemba! *${month}* has brought us `;
    raffle_message += `*${shouting_count}* Gembans shouting out - `;
    raffle_message +=
      `with a total of *${receiving_count}* of you receiving shoutouts!\n`;
    raffle_message +=
      `And remember, you get double points if your shoutout is tagged with one of `;
    raffle_message +=
      `<https://gembaadvantage.atlassian.net/wiki/spaces/BA/pages/1011515428/Our+Guiding+Principles|our Guiding Principles>, `;
    raffle_message +=
      `and triple shoutout points if it's the guiding principle of the month! :martial_arts_uniform: :rocket: :handshake::skin-tone-3: :first_place_medal:\n`;
    raffle_message += `\n`;
    raffle_message +=
      `:drum_with_drumsticks: :drum_with_drumsticks: :drum_with_drumsticks:\n`;
    raffle_message +=
      `Our winner for ${month} is <@${winner_user_id}> ${emoji1}${emoji2}\n`;
    raffle_message += `\n`;
    
    if (!inputs.next_guiding_principle!==undefined) {
      raffle_message += `${nextMonth}'s guiding principle is: *${inputs.next_guiding_principle}*\n`;
    }
    raffle_message +=
      `Don’t forget to <https://gembaadvantage.atlassian.net/servicedesk/customer/portal/14|raise a ticket> `;
    raffle_message +=
      `and nominate people for Small Awards too! We want to continue hearing and celebrating you! `;
    raffle_message += `:admission_tickets: :admission_tickets:`;

    // would be nice to include the users photo
    // need to call api to get user info
    // also pass blocks rather than text into post message
    try {
      const result = await client.chat.postMessage({
        channel: channel_id,
        text: raffle_message,
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }

    return { outputs: {} };
  },
);

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
