# QuizzyBrowser: Revolutionizing Quiz and Interview Preparation

## Inspiration

The inspiration behind *QuizzyBrowser* came from the need for a more interactive and engaging way to prepare for interviews and quizzes. Traditional methods often lack the dynamic feedback and personalized learning experience that modern learners crave. We wanted to create a tool that not only tests knowledge but also provides immediate explanations, translations, and the ability to bookmark important questions for future reference. This project was driven by the desire to make learning more accessible, interactive, and effective.

---

## What It Does

QuizzyBrowser is a Chrome extension that transforms the way users prepare for interviews and quizzes. Its key features include:

- *Contextual Quizzes*: Dynamically fetched questions based on the content of the current browser tab using Gemini Nano. For objective quizzes, no internet access is required after the page is loaded.
- *Interactive Question Tiles*: Users can write or record their responses and receive immediate feedback.
- *Reveal Explanations*: A "Reveal Answer" button provides detailed explanations for each question, promoting deeper understanding.
- *Translate Feature*: Allows users to translate questions and explanations into multiple languages, enhancing accessibility.
- *Bookmarking*: Enables users to save important questions for future reference.
- *Quiz Completion Summary*: Provides a summary of performance, including scores and feedback on each question.

---

## How We Built It

QuizzyBrowser was built using modern web technologies:

- *React*: To develop a dynamic and responsive front-end interface.
- *Gemini Nano*: For generating context-aware quiz questions based on the content of the current tab.
- *Tailwind CSS*: For clean and consistent styling.
- *Chrome Extension API*: For seamless integration with the browser.
- *Media Recording API*: To enable audio recording for verbal responses.
- *Local Storage*: To persist user data, such as bookmarked questions and selected languages.

---

## Challenges We Ran Into

- *Media Integration*: Integrating the Media Recording API with the Chrome Extension API was challenging, requiring careful handling of permissions and media streams.
- *Page Visibility*: Hiding the browser tab's content while conducting the quiz was another complex aspect.
- *Client-side AI*: Managing DOM access and handling client-side AI functionalities.
- *Extension Deployment*: Although the extension was fully functional, deployment could not be completed by the project submission deadline.

---

## Accomplishments That We're Proud Of

- Created a tool that not only tests knowledge but also provides immediate feedback and explanations.
- Successfully implemented the *Translate Feature*, significantly enhancing accessibility for a global audience.
- Achieved seamless integration with the Chrome browser and built an intuitive, user-friendly interface.

---

## What We Learned

- Gained experience in building Chrome extensions.
- Improved our understanding of media APIs and their integration.
- Learned to create accessible and user-friendly interfaces.

---

## What's Next for QuizzyBrowser

- *Refining the Experience*: Continuously improving the user interface and performance for a smoother experience.
- *Expanding Webpage Compatibility*: Ensuring broader functionality across more types of webpages.
- *Enhanced Interview Preparation*: Adding mock interview simulations and real-time feedback.
- *Cross-Questioning Feature*: Allowing follow-up questions based on user responses for a dynamic experience.
- *Advanced Analytics*: Offering insights into user performance, identifying areas for improvement, and tracking progress.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DeenankSharma/b27_project_again
   ```
2. Navigate to the project directory::
   ```bash
    cd b27_project_again
   ```
3. Build the frontend
   ```bash
   cd extension_frontend
   npm i
   npm run build
   ```
4. Load the extension in Chrome:

- Open chrome://extensions/ in your browser.
- Enable Developer mode.
- Click Load unpacked and select the build folder.
- Navigate to GFG articles, run the extension by clicking it
- Enjoy the Interview!
