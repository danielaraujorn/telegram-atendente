const botgram = require("botgram");
const bot = botgram("980684550:AAFFb3ggGALRnpP-IPfYKS0YTzX4cvc0mtM");

const getMensagemInicial = name => `
Olá ${name}, esse é nosso atendimento automático. Por favor, você poderia me dizer qual marmita você vai querer hoje? nossas opções são:
    *Funcional*: com comida tal e tal.
    *Low Carb*: com comida tal e tal.
    *Vegetariano*: com comida tal e tal.
Para fazer o pedido basta escrever /pedir <opção desejada>
`;

// Olá, seja bem vindo ao nosso atendimento automático. Por favor, você poderia me dizer qual marmita você vai querer hoje? nossas opções são:
// Funcional: com comida tal e tal.
// Low Carb: com comida tal e tal.
// Vegetariano: com comida tal e tal.
var TYPE = "zp.0a";
const encodeData = (chatId, action) => {
  return JSON.stringify({ type: TYPE, action: action, chatId });
};
bot.text(function(msg, reply, next) {
  reply.inlineKeyboard([
    [
      {
        text: "Sim",
        callback_data: encodeData(msg.chat.id, "AcceptOrder")
      },
      {
        text: "Não",
        callback_data: encodeData(msg.chat.id, "DenyOrder")
      }
    ]
  ]);
  reply.text(
    `Olá ${msg.user.firstname}, esse é nosso atendimento automático. Você gostaria de fazer um pedido?`
  );
});
const thankYou = (chatId, reply) => {
  reply.text("ok, tenha um otimo dia");
};
const showMenu = (chatId, reply) => {
  reply.inlineKeyboard([
    [
      {
        text: "Funcional",
        callback_data: encodeData(chatId, "Funcional")
      },
      {
        text: "Low carb",
        callback_data: encodeData(chatId, "Low carb")
      },
      {
        text: "Vegetariano",
        callback_data: encodeData(chatId, "Vegetariano")
      }
    ]
  ]);
  reply.text(
    `Por favor, você poderia me dizer qual opção você vai querer hoje? nossas opções são:`
  );
};

const makeOrder = (chatId, reply, option) => {
  reply.text(
    `Seu pedido do ${option} foi anotado, assim que sair para a entrega, te avisaremos!`
  );
  setTimeout(() => reply.text("Seu pedido saiu para entrega"), 5000);
};

bot.callback(function(query, next) {
  // Try to parse the query, otherwise pass it down
  try {
    var data = JSON.parse(query.data);
  } catch (e) {
    return next();
  }

  // Verify this query is, indeed, for us
  if (data.type !== TYPE) return next();
  const { chatId } = data;
  const botReply = bot.reply(chatId);
  if (data.action === "AcceptOrder") showMenu(chatId, botReply);
  else if (data.action === "DenyOrder") thankYou(chatId, botReply);
  else if (
    data.action === "Funcional" ||
    data.action === "Vegetariano" ||
    data.action === "Low carb"
  )
    makeOrder(chatId, botReply, data.action);
  else next();
  // Try to send the chat action where the payload says
  // DON'T DO THIS AT HOME! A bad client could manipulate the
  // value of any field and make the bot send actions to whoever he wants!

  // Encoding request data in callback_data is practical but
  // shouln't be done in production because callback_data can
  // only be up to 64 bytes long, and a client could send
  // specially crafted data, such as:
  //
  //     { "type": TYPE }
  //
  // which would make this code crash at the call to bot.reply(...)
});
