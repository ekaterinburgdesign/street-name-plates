import validate from "../../src/functions/validation-info"


require('dotenv').config();

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDER)

const RECEPIENTS = process.env.RECEPIENTS.split(', ');


/*
ожидается, что в body запроса будет лежать строка следующего формата:
user_data: {"type": "улица", "street_name": "Малышева", 
"customer_name": "ФАРШШШШШ", "number": "1", "dismanting": false, 
"mounting": false, "color-code": "FF7F50", "communication": "@vasya_ebaaat"}
*/
export default async function handler(req, res) {
  console.log("/////////////////////////////////")
  let body = "";
  console.log(req.body)
  try {
    body = JSON.parse(/({.+})/.exec(req.body)[1]);
  } catch (e) {
    res.status(400).json({ });
    return;
  }

  if (
    !body.hasOwnProperty("type") ||
    !body.hasOwnProperty("street_name") ||
    !body.hasOwnProperty("customer_name") ||
    !body.hasOwnProperty("communication") ||
    !body.hasOwnProperty("number") ||
    !body.hasOwnProperty("dismanting") ||
    !body.hasOwnProperty("mounting") ||
    !body.hasOwnProperty("color-code")
  ) 
  {
    res.status(400).json({ });
    return;
  }

  const validation_info = validate(body["type"], body["street_name"], body["number"].toString())
  if (!validation_info["is_valid"]) {
    return res.status(400).json({ });
  }

  let price = validation_info["price"]
  const extra_options = []

  if (body["mounting"]) {
    price += 3000;
    extra_options.push("монтаж");
  }

  if (body["dismanting"]) {
    price += 3000;
    extra_options.push("демонтаж");
  }


  
  const text = `Поступила заявка на адресную табличку:
type: ${body["type"]}
${body["street_name"]}, ${body["number"]}
${validation_info["english_name"]}
${validation_info["width"]} х ${validation_info["height"]} мм
${body["color-code"]}
Историческое: ${validation_info["is_hist"] ? "да" : "нет"}

Опции:
${extra_options.length > 0 ? extra_options.join(', ') : "none"}

Цена:
${validation_info["price"]}

Контактное лицо:
${body["customer_name"]}
${body["communication"]}`;

  for (const r of RECEPIENTS)
  {
    const msg = {
      to: r,
      from: process.env.MAIL_ADDR,
      subject: `plate ${body["type"]} ${body["street_name"]}, ${body["number"]}`,
      text: text,
    };
    await sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(error);
    });
  }
  
  res.status(200).json({ status: "Ok" });
}