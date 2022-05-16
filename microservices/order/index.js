const dotenv = require("dotenv");
[".env", ".env.local"].forEach(path => dotenv.config({ path }));

const express = require("express");
const app = express();
let amqp = require("amqplib/callback_api");
const Order = require("./controllers/Order");

amqp.connect(
	"amqp://myuser:mypassword@rabbitmq",
	function (error0, connection) {
		if (error0) {
			throw error0;
		}
		connection.createChannel(function (error1, channel) {
			if (error1) {
				throw error1;
			}
			var queue = "hello";
			var msg = "Hello world";

			channel.assertQueue(queue, {
				durable: false
			});

			channel.consume(queue, Order.update);
		});
		// setTimeout(function () {
		// 	connection.close();
		// 	process.exit(0);
		// }, 500);
	}
);

app.use(
	express.json({
		verify: (req, res, buf) => {
			req.rawBody = buf;
		}
	})
);

app.use("/orders", require("./routes/Order"));

app.listen(process.env.PORT || 3000, () => {
	console.log("Server is running on port " + process.env.PORT);
});
