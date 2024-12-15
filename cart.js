Code:
  ZipFile: |
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();
    const sns = new AWS.SNS();
    const ses = new AWS.SES();

    exports.handler = async (event) => {
        try {
            console.log("Received event:", JSON.stringify(event, null, 2));

            if (!event.body) {
                throw new Error("Request body is missing.");
            }

            const requestBody = JSON.parse(event.body);
            const { items, email, address, total, city } = requestBody;

            if (!email) throw new Error("Email is required.");
            if (!address) throw new Error("Address is required.");
            if (!city) throw new Error("City is required.");

            const timestamp = new Date().toISOString();
            const orderDetails = {
                city,
                timestamp,
                items,
                email,
                address,
                total,
                message: "Order processed successfully!",
            };

            // Save order to S3
            const bucketName = "doap";
            const fileName = `${city.toLowerCase()}-orders.txt`;

            let existingData = "";
            try {
                const data = await s3.getObject({
                    Bucket: bucketName,
                    Key: fileName,
                }).promise();
                existingData = data.Body.toString("utf-8");
            } catch (err) {
                if (err.code !== "NoSuchKey") {
                    console.error(`Error reading ${fileName}:`, err);
                    throw err;
                }
            }

            const updatedData = `${existingData}\n${JSON.stringify(orderDetails)}`;
            await s3.putObject({
                Bucket: bucketName,
                Key: fileName,
                Body: updatedData,
                ContentType: "text/plain",
            }).promise();

            // Publish to SNS
            const snsParams = {
                TopicArn: process.env.SNS_TOPIC_ARN,
                Message: `New order from ${city}: ${JSON.stringify(orderDetails, null, 2)}`,
                Subject: `New Order Alert - ${city}`,
            };
            await sns.publish(snsParams).promise();

            // Send confirmation email via SES
            const sesParams = {
                Source: process.env.SENDER_EMAIL,
                Destination: { ToAddresses: [email] },
                Message: {
                    Subject: { Data: `${city} Doap - Order Confirmation` },
                    Body: {
                        Html: {
                            Data: `
                                <html>
                                <body>
                                    <h2>Order Received</h2>
                                    <p>Your order has been processed successfully!</p>
                                    <p><strong>${city} Doap - Order Summary:</strong></p>
                                    <ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>
                                    <p><strong>Total:</strong> ${total}</p>
                                    <p>Thank you for shopping with ${city} Doap!</p>
                                </body>
                                </html>
                            `,
                        },
                    },
                },
            };
            await ses.sendEmail(sesParams).promise();

            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(orderDetails),
            };
        } catch (error) {
            console.error("Error:", error.message);
            return {
                statusCode: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ error: error.message }),
            };
        }
    };

