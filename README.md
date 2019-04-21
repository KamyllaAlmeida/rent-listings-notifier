Rent Listings Notifier
=====================
Rent Listings Notifier is a robot set up to be executed daily that goes to Craigslist Website, get a list of rentals listings according to the filter pre-configured, saves the list in a DynamoDB, compares the current data from Craigslit with the data saved in the day before and then sends an email with the new rentals listings added on Craigslist, the removed ones and all rentals listings avaiable current added and all added in previous days. The filters that can be passed to the Lambda function are the same avaiable on Craigslist Website, they are: Km from Postal Code, Postal Code, Min. and Max of Price and Min. FT2. It was built in AWS Lambda NodeJS, DynamoDB, SNS (Simple Notification Service from AWS) and Cloudwatch event used to schedule the execution of the Lambda function.


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

To change the filters passed in the function, open the file serverless.yml and alter the values of the object "filters".

```
Input: '{"filters": {
            "postalCode": "v6b1s3",
            "kmFromPostalCode": "3",
            "minPrice": "1400",
            "maxPrice": "1850",
            "minSqft": "550"
          }
        }'

```

To change the time the function will be executed, open the file serverless.yml and alter the value of "ScheduleExpression". How to create the Schedule Expressions for Rules is well explained in the link: https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html.
