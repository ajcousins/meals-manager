# Meal Planner App

Live app can be visited [here](https://powerful-depths-88188.herokuapp.com/).

### Brief

This app was created as a way to exercise what I had learned about Node, Express, MongoDB/ Mongoose and the back-end in general. I also used it as my submission for the Odin Project Inventory Application project (https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs/lessons/inventory-application).

Whilst this project does not follow the original brief (Odin Project wanted an Inventory management app for an imaginary store), I wanted to create something that could be useful to me as an everyday tool, but was the same in spirit to the original brief, which was to create a basic CRUD application for items grouped into categories.

My own brief was to create something that is able to manage food items in various locations (fridge and freezer) and keep track of what items are nearing their use by date, and highlight which items should be eaten sooner rather than later.

### Features

#### Update 27/05/21

- By default, users have shared access to a demo account which can be manipulated when not signed in.
- Users can register to access an empty account, where they can set up items and locations from scratch.

#### 21/05/21

- The user can create new locations and add food items, with a 'use by date', 'number of portions' and 'notes'.
- The app colour codes items which should be eaten today in green. Items which have passed this date are coloured grey.
- The food items can be read/ viewed according to its location or meal. Items can also be sorted by 'eat by date' or 'date added'.
- Items can be updated by clicking the pencil icon on the top-right of each item.
- Items can be 'consumed' each portion at a time. Once the number of portions reaches 0, the item is deleted from the database.

### Execution

- The application uses an MVC architecture.
- Item and location controllers were created to manage API routes, which I was able to use to test access to the database before implementing views.
- Views are rendered using pug templates.
- A default/ demo account is accessible to every user before signing up. This is achieved by adding a specific demo user id to the request object, which each view controller then checks for.

```js
// Adds currentUser variable to res object so that currentUser is available in all views.
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  // Add demo user to res object in case there is no currentUser.
  res.locals.demoUser = { _id: "60ae7aca35a25e14184ffc3c" };
  next();
});
```
