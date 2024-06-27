const axios = require("axios")
module.exports = {
	config: {
		name: 'naruto',
        aliases: ["ninja"],
		version: '1.2',
		author: 'Luxion/fixed by Riley',
		countDown: 0,
		role: 0,
		shortDescription: 'AI CHAT',
		longDescription: {
			en: 'Chat with Xae'
		},
		category: 'Ai chat',
		guide: {
			en: "{pn} <word>: chat with lina"
				+ "\Example:{pn} hi"
		}
	},

	langs: {
		en: {
			turnedOn: "𝐈𝐥 𝐞𝐬𝐭 𝐭𝐚𝐧𝐭 𝐝𝐞 𝐫𝐚𝐦𝐞𝐧𝐞𝐫 𝐥'𝐨𝐫𝐝𝐫𝐞 𝐚 𝐊𝐨𝐧𝐨𝐡𝐚⚔⚔️",
			turnedOff: "𝐀𝐝𝐢𝐞𝐮 𝐥𝐞𝐬 𝐛𝐚𝐭𝐚𝐫𝐝𝐬 𝐦𝐞𝐬 𝐑𝐚𝐦𝐞𝐧 𝐦'𝐚𝐭𝐭𝐞𝐧𝐝𝐞𝐧𝐭🍲",
			chatting: 'Already Chatting with 𝗟𝗢𝗙𝗧...',
			error: "𝘽𝙊𝙐𝙁𝙁𝙊𝙉......🌱
		}
	},

	onStart: async function ({ args, threadsData, message, event, getLang }) {
		if (args[0] == 'on' || args[0] == 'off') {
			await threadsData.set(event.threadID, args[0] == "on", "settings.simsimi");
			return message.reply(args[0] == "on" ? getLang("turnedOn") : getLang("turnedOff"));
		}
		else if (args[0]) {
			const yourMessage = args.join(" ");
			try {
				const responseMessage = await getMessage(yourMessage);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
        console.log(err)
				return message.reply(getLang("error"));
			}
		}
	},

	onChat: async ({ args, message, threadsData, event, isUserCallCommand, getLang }) => {
		if (args.length > 1 && !isUserCallCommand && await threadsData.get(event.threadID, "settings.simsimi")) {
			try {
				const langCode = await threadsData.get(event.threadID, "settings.lang") || global.GoatBot.config.language;
				const responseMessage = await getMessage(args.join(" "), langCode);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				return message.reply(getLang("error"));
			}
		}
	}
};

async function getMessage(yourMessage, langCode) {
	const res = await axios.post(
    'https://api.simsimi.vn/v1/simtalk',
    new URLSearchParams({
        'text': yourMessage,
        'lc': 'fr'
    })
);

	if (res.status > 200)
		throw new Error(res.data.success);

	return res.data.message;
      }