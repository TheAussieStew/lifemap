# Moira Lifemap

Moira Lifemap is a lifemapping tool designed to allow users to map out and actualise their dreams. It integrates higher dimensional thinking that allows the user to more flexibly and effectively resolve their problems and actualise their lives. It also allows the embedding of advanced tools into pages.

## Architecture

Moira Lifemap is built on top of the rich text editor framework ProseMirror and its derivative TipTap. The foundation is therefore like an amped up notepad with all sorts of rich text functionality. On top of this foundation are mini-apps, that each handle a unique aspect of its functionality. For example, Moira Chronos handles all linear time related functionality that has to do with synchronising with others. These include pomodoro timers, time zone functionality, meeting scheduling and so on. These mini-apps can be used stand alone, or added into any Moira Lifemap page as required. Moira Lifemap is therefore a super app that composes all these mini-apps.

These mini-apps include:

1. Chronos - linear time and synchronisation with others
2. Kairos - non-linear and personal time
3. Natural Scientific Calculator - maths and scientific calculations

## Values
- Humanist

Lifemap is designed to empower the individual to fully live out their lives. This is in contrast to much existing software which has a productivity maximisation focus.

- Visual

Lifemap attempts to utilise as many visual ways of organising information as possible. It tends to shy away from an excessive reliance on text and numbers.

- Kinesthetic

Lifemap attempts to organise information using their energetic qualities. This means that all quanta has an aura, and this can be visually seen at a glance, allowing the user to easily see the "health" of various areas.

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
yarn dev-web 
```

### 4. Run tests 
```bash
yarn test
```

```

# Technical design document
Refer to this design in Framer for the rationale behind architectural decisions. Click on the "Fundamental Constructs" page.
https://framer.com/projects/Eusaybia-Design-Framework--oevUQ8SkUW1pecQ2lhXA-e0Fek