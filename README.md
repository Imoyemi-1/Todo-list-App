# Frontend Mentor - Todo app solution

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW)

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Useful resources](#useful-resources)
- [Author](#author)

**Note: Delete this note and update the table of contents based on what sections you keep.**

## Overview

This is a todo app project from frontend mentor. I'm doing this project to build a good fundamental and have confident in my vanilla javascript skills

### The challenge

Users will be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Add new todos to the list
- Mark todos as complete
- Delete todos from the list
- Filter by all/active/complete todos
- Clear all completed todos
- Toggle light and dark mode
- Drag and drop to reorder items on the list

### Screenshot

[project screenshot](./images/todolist-screenshot.png)

### Links

- Solution URL: [Source code](https://github.com/Imoyemi-1/Todo-list-App.git)
- Live Site URL: [Todo List App](https://todo-list-app-111.netlify.app/)

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- Vanilla javascript

### What I learned

i learnt more about hold to handle drag and drop element in a web page and i learnt how to customise checkbox with css

code snippets for checkbox :

```css
input[type="checkbox"]:checked::after {
  content: url(../images/icon-check.svg);
  font-weight: var(--font-wgt-lg);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

code snippets for drag and drop :

```js
const todoDragStart = (e) => {
  draggedItem = e.target;
  draggedItem.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
};
```

### Useful resources

- [resource](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) - This helped me for drag and drop. I really liked this pattern and will use it going forward.

## Author

- Frontend Mentor - [@Imoyemi](https://www.frontendmentor.io/profile/Imoyemi-1)
