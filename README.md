# IVR STUDIO

## GETTING STARTED GUIDE

### Introduction

Welcome to IVR Studio, a versatile application designed to empower both technical and non-technical users in creating their own customized Interactive Voice Response (IVR) flows. With its intuitive drag-and-drop interface, you can effortlessly design complex IVR diagrams, as the elements automatically align themselves on a grid for a neat and clear visualization. To safeguard against potential runtime crashes, the application also includes a validation feature to check and flag common input errors. The app supports running JavaScript code at any point during the flow, allowing for a wide range of possible actions.

### General UI Overview

![ui-overview](https://github.com/irfanalamt/ivr-dev-interface/assets/64161258/ca2a855b-16ff-4dfe-b356-272344204796)

### Exploring IVR Elements

#### SetParams

![setParams](https://github.com/irfanalamt/ivr-dev-interface/assets/64161258/6d8a43bb-fe13-463b-a689-59b94bc5f18d)

The setParams block is the initial block for the IVR flow.
It sets global parameters and begins the flow. The parameter list includes all call parameters and their default values. To update a parameter, select it, change the value, and click 'save' to add it to the updated parameter list.

#### PlayMessage

![playMessage](https://github.com/irfanalamt/ivr-dev-interface/assets/64161258/1183f732-8544-40cb-b330-53df4a7b196d)

The playMessage block allows you to play one or more items together.
To add items to the message list, navigate to the message list tab. Here, you can select the object type and click the "add" button to include it in the list. In the "parameters" tab, there are options available to customize the playMessage experience.

#### GetDigits

![getDigits](https://github.com/irfanalamt/ivr-dev-interface/assets/64161258/7252b7b6-eb99-468c-a046-5c0bced5cfc1)

The getDigits block is used to collect one or more digits from the user, such as a phone number or account number.
The result variable is used to store the value entered by the user. All variables must be defined in the setVariables block before using them in the getDigits block.
To add items to the message list, navigate to the message list tab. Here, you can select the object type and click the "add" button to include it in the list. In the "parameters" tab, there are options available to customize the getDigits experience.

#### PlayConfirm

![playConfirm](https://github.com/irfanalamt/ivr-dev-interface/assets/64161258/c7e8cc91-9318-4277-8317-7e15eee70dbb)

The playConfirm block enables you to play one or more items with a confirmation prompt. It consists of two paths, one for 'yes' and one for 'no'. For instance, it allows you to play a message and prompt the user to press 1 to confirm or 2 to cancel.
To add items to the message list, navigate to the message list tab. Here, you can select the object type and click the "add" button to include it in the list. In the "parameters" tab, there are options available to customize the playConfirm experience.

#### PlayMenu

![playMenu](https://github.com/irfanalamt/ivr-dev-interface/assets/64161258/7b1349d5-0e86-4765-b9ea-4237fd7d55bc)

The playMenu block is utilized to manage the flow of an IVR system based on the user's choice. It allows for multiple exit points to be configured. For instance, pressing 1 directs the user to account services, while pressing 2 directs them to credit card services.

#### RunScript

![runScript](https://github.com/irfanalamt/ivr-dev-interface/assets/64161258/4b0a4715-4fea-41f5-8d08-a758bb5a1f5c)

The runScript block serves the purpose of executing scripts and modifying IVR variables. It enables the usage of variables declared in the setVariables block by prefixing the variable name with a '$' symbol. Please note that the script syntax must adhere to valid JavaScript guidelines.

#### Switch

![switch](https://github.com/irfanalamt/ivr-dev-interface/assets/64161258/87097063-5671-472d-9735-80790fd352be)

The switch block is utilized to regulate the flow of the IVR system based on specific conditions. These conditions are determined by the values of pre-defined variables. For instance, if we have a variable named "marks" and we need to control the flow based on it, the condition would be written in the form of '$marks > 50', and the corresponding action would be 'PASS'. The default action, in case none of the conditions are met, would be 'FAIL'.

#### CallAPI

![callAPI](https://github.com/irfanalamt/ivr-dev-interface/assets/64161258/f719af81-12d4-4da9-a2e8-927032576df8)

The callAPI block is employed to query an API and establish the output variables. Prior to using the callAPI block, it is essential to ensure that all variables required by the block are defined in the setVariables block. Once all the necessary variables have been set, the callAPI block can be used to query the API and assign values to the output variables.

#### EndFLow

![endFlow](https://github.com/irfanalamt/ivr-dev-interface/assets/64161258/d155dab7-81a3-42f2-94e3-6e906207d34c)

The endFlow block is utilized to conclude an IVR flow. It provides two options: Disconnect and Transfer.

1. Disconnect (red): Choosing this option will terminate the call flow and disconnect the call.
2. Transfer (green): Selecting this option will transfer the call flow to a predefined transfer point. The user also has the option to set the transfer point at this stage.

#### Connector

![connector](https://github.com/irfanalamt/ivr-dev-interface/assets/64161258/c1e7c2da-fe8e-4488-bfee-9518c610d41b)

The connector is an optional component used to enhance the visual representation of the IVR flow in the user interface. It does not have any impact on the final script or the functioning of the IVR system. Its purpose is purely for visual organization and clarity in the UI, allowing users to better understand the flow of the IVR system.

#### Jumper

![jumper](https://github.com/irfanalamt/ivr-dev-interface/assets/64161258/61e3ab15-614f-4080-8416-b384695f76e0)

The jumper block serves the purpose of transferring control flow within a program and facilitating navigation between pages. It offers two types of jumpers: entry and exit.

1. Entry (green): This is the default option and represents the end point of a jump. It cannot be used as the 'to' shape when establishing connections.
2. Exit (orange): The exit jumper denotes the start point of a jump. It should have the same name as the corresponding entry jumper to ensure proper navigation. It is important to note that the exit jumper cannot be used as the 'from' shape while establishing connections.

### What You'll Need Before Starting

Before you begin, ensure that you have the following prerequisites installed on your system:

- Node.js (version 19 or higher)
- npm (version 9.5 or higher)

### How to Install and Run IVR Studio Locally

To set up and run IVR Studio on your local system, please follow the step-by-step guide provided below:

1. Clone the repository:

```
git clone https://github.com/irfanalamt/ivr-dev-interface.git
```

2. Navigate to the project directory

```
cd ivr-dev-interface
```

3. Access the application

```
npm start
```

At this point, IVR Studio should be up and running on your local system. To start using it, open your web browser and navigate to http://localhost:3000 to access the visual IVR builder tool.

### Tech Stack

This project is primarily built with JavaScript and uses several libraries and frameworks to streamline development and enhance functionality.

At the heart of this project is [Canvas](https://www.npmjs.com/package/canvas), an image manipulation library. Our workspace is entirely built using the Canvas API, providing a powerful and flexible environment to manipulate graphical data directly.

We're using [Next.js](https://nextjs.org/), a React framework, for server-side rendering and generating static webpages. Next.js helps to improve the performance of our app and makes it SEO-friendly. The project uses [React](https://reactjs.org/) version 18.2.0 and [React-DOM](https://www.npmjs.com/package/react-dom) for managing the DOM.

For the user interface, we're using the [Material UI](https://mui.com/) library which provides a collection of pre-built React components that follow Google's Material Design guidelines. Additionally, we utilize [@emotion/react](https://emotion.sh/docs/@emotion/react) and [@emotion/styled](https://emotion.sh/docs/@emotion/styled) for styled components and CSS-in-JS solutions.

For data fetching and handling HTTP requests, we're using [axios](https://www.npmjs.com/package/axios), a promise-based HTTP client for the browser and Node.js.

We're using [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) for handling JSON Web Tokens and [bcryptjs](https://www.npmjs.com/package/bcryptjs) for hashing and checking passwords, contributing to the security of the app.

For database interactions, we're using [mongodb](https://www.npmjs.com/package/mongodb) driver which provides a high-level API on top of mongodb-core.

On the utility side, [json2csv](https://www.npmjs.com/package/json2csv) helps to convert json data to csv format.

For parsing JavaScript, we're using [@babel/parser](https://babeljs.io/docs/en/next/babel-parser.html). To keep the codebase consistent and avoid bugs, we're using [ESLint](https://eslint.org/) along with [eslint-config-next](https://www.npmjs.com/package/eslint-config-next) for linting and [Prettier](https://prettier.io/) for code formatting.
