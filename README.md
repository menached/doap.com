# DOAP Shop --- Order Management and Delivery System

**DOAP Shop** is a scalable, serverless order management and delivery system that uses AWS Cloud services like Lambda, API Gateway, S3, SES, and SNS to process orders, store data, and send email notifications dynamically.

## Project Overview
The project streamlines online orders by integrating:
- A **web frontend** for customers to place orders.
- A **backend API** built with AWS Lambda to process orders.
- Dynamic storage of order details in Amazon S3.
- Real-time email notifications using AWS Simple Email Service (SES) and Simple Notification Service (SNS).

The project dynamically adapts based on subdomains to provide localized services for cities across **Northern California**.

## Features
- **Subdomain Detection**: Updates phone numbers, branding, and OpenGraph metadata based on the subdomain.
- **Cart System**: Allows users to add, update, and manage items in their cart.
- **Order Processing**: Submits order details to an API endpoint.
- **Payment Method Support**: Handles various payment methods, including Credit Card, Cash, Crypto, Zelle, Venmo, and PayPal.
- **Email Notifications**: Sends order confirmation emails to customers and alerts to the back-office team.

## Tech Stack
The project leverages the following technologies:
- **AWS Services**: Lambda, S3, API Gateway, SES, SNS
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: AWS Lambda (Node.js)
- **CloudFormation**: Infrastructure as Code (IaC) to automate resource deployment.

## Project Structure
```plaintext
project-root/
├── permissions-policy.json       # IAM permissions policy
├── trust-policy.json             # Trust policy for Lambda execution role
├── cart.js                       # Dynamic cart and metadata logic
├── style.css                     # Styling for the frontend
├── zipFinder.js                  # ZIP code search and redirect logic
├── template.yaml                 # CloudFormation template for AWS deployment
├── LICENSE                       # License file (AGPL-3.0)
└── README.md                     # Project documentation (this file)
```

## Setup Instructions
### Prerequisites
- AWS CLI configured with appropriate IAM permissions.
- Node.js installed for local testing (optional).
- A registered domain and subdomains pointing to your setup.

### Deployment Steps
1. **Deploy Infrastructure** using CloudFormation:
   ```bash
   aws cloudformation create-stack \
     --stack-name doap-shop \
     --template-body file://template.yaml \
     --capabilities CAPABILITY_NAMED_IAM
   ```
   This creates the necessary AWS resources: Lambda function, API Gateway, IAM roles, and S3 bucket.

2. **Frontend Setup**:
   - Host `cart.html`, `cart.js`, `style.css`, and `zipFinder.js` on your web server.
   - Point your subdomains to the correct server.

3. **Test the API**:
   Use `curl` or Postman to test the API endpoint:
   ```bash
   curl -X POST https://<API-GATEWAY-URL>/prod/checkout \
     -H 'Content-Type: application/json' \
     -d '{
           "items": [{"name": "Item1", "quantity": 2, "price": 10}],
           "name": "John Doe",
           "city": "Pleasanton",
           "phone": "1234567890",
           "email": "john.doe@example.com",
           "address": "123 Main St",
           "total": "$20",
           "paymentMethod": "credit-card"
         }'
   ```

4. **Verify Email Notifications**:
   - Check customer inbox for confirmation.
   - Check back-office inbox for order alerts.

## Usage
1. **Visit your subdomain** (e.g., `https://walnutcreek.doap.com/cart.html`).
2. Add items to the cart, provide order details, and choose a payment method.
3. Submit the order.
4. Receive a confirmation email.

## License
This project is licensed under the **GNU AGPL-3.0 License**. See the `LICENSE` file for details.

## Contributors
- **David Menache** - AWS Solutions Architect, Full Stack Developer

---
For any issues or contributions, please open a GitHub issue or contact `dmenache@doap.com`.
