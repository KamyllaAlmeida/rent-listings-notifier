Rent Listings Notifier
=====================
Rent Listings Notifier is a robot set up to be executed every day that goes to Craigslist Website, get a list of rental properties according to the filter pre-configured, saves the list in a DynamoDB, compares the current data from Craigslit with the data saved in the day before and then sends an email with the new rental properties added on Craigslist, the properties added in previous days and the removed ones. The filters that can be passed to the Lambda function are the same avaiable on Craigslist Website, they are: Km from Postal Code, Min. and Max of Price, Min. and Max Bathrooms, Min. and Max FT, has image, bundle duplicates and others. It was built in AWS Lambda NodeJS, DynamoDB, SNS (Simple Notification Service from AWS) and Cloudwatch event used to schedule the execution of the Lambda function.


### Contributor
[Kamylla Almeida](https://github.com/KamyllaAlmeida)

### Email sent by Rent Listings Notifier Robot


### Dependencies

* aws-sdk - ^2.422.0
* axios - ^0.18.0
* cheerio - 1.0.0-rc.2
* dynamodb-data-types - ^3.0.1

### Usage

Clone the project and create your own git repo. 

Set up the AWS CLI https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html .

Open the project into Terminal.


```
npm install
serverless deploy

```
