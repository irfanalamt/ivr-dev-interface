# IVR STUDIO

## GETTING STARTED GUIDE

### Introduction

Welcome to IVR Studio, a versatile application designed to empower both technical and non-technical users in creating their own customized Interactive Voice Response (IVR) flows. With its intuitive drag-and-drop interface, you can effortlessly design complex IVR diagrams, as the elements automatically align themselves on a grid for a neat and clear visualization. To safeguard against potential runtime crashes, the application also includes a validation feature to check and flag common input errors. The app supports running JavaScript code at any point during the flow, allowing for a wide range of possible actions.

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

Please ensure that you have all these dependencies correctly installed in your development environment before you start contributing to this project.
