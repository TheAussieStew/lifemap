# Project Lifemap

## Features 

- Totality Data Model 
    - Each quanta of information can be viewed as different *structures*
        - Tables, Lists, Cyclic Graph, Trees, Kanban, Code and other custom structures
    - Mix and match *lenses* according to your needs
        - Rose-Tinted, Non-Symbolic, Language, Emoji, Vitality
- Fluid Design System
    - *All* views are adjustible
    - *All* transitions are smoothly animated
- Relations and Transformations over Static State
    - Everything is modelled through relations 
        - Time, Emotions, Entities, Concepts, People, Lists
    - View the flowering of your lifemap over time

## What is this useful for?
- Shorter term planning (e.g. planning projects, movies or books I want to read, operational tasks like paying bills or taxes)
- Life planning (e.g. where do I want to be in 10 years, what do I want to achieve by the end of my life, how do I achieve my dreams?)
- Self-reflection (e.g. therapy, counselling, shadow work, work on thought or habit patterns, journaling, diarying, self authoring, life review, work on relationships with others)
- Organising knowledge and wisdom (e.g. reviewing learnings on technical subjects, conducting scientific research, condensing and consolidating knowledge, sharing notes with others)
- Recurring habit formation and destruction (e.g. tracking learning a language daily, catching up with friends or acquaintances regularly, quitting smoking, walking 7000 steps a day)

## What is this less useful for?
While these use cases will probably work fine and probably a bit better than other tools, these are not a primary focus.
- Nothing?
## Getting Started 
You'll need the following tools:
- VSCode
- NPM
- Yarn

You'll need the following VSCode extensions:
- Etc
- Etc
- Etc

### 1. Clone this repo
```bash
git clone etc 
```
### 2. Install depdenencies
```bash
yarn install 
```
### 3. Run Lifemap 
```bash
yarn start 
```
### 4. Run tests 
```bash
yarn test 
```
## Engineering design decisions
- While this project uses TypeScript, the way it is written takes some inspiration from Haskell. Namely minimising side effects, pattern matching*, strict typing, abstract data types, immutable data, and union types. Exceptions have been made where necessary. For example, graph operations are simpler, clearer and faster when written in an iterative style utilising mutability.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
