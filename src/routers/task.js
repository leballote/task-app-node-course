const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const { user } = req;
  const { completed, limit, skip, sortBy } = req.query;
  const match = {};
  const sort = {};

  if (completed) {
    match.completed = completed === "true";
  }

  if (sortBy) {
    let [sortField, sortDirection] = sortBy.split(":");
    if (
      sortDirection == "asc" ||
      sortDirection == undefined ||
      sortDirection == ""
    ) {
      sort[sortField] = 1;
    } else if (sortDirection == "desc") {
      sort[sortField] = -1;
    }
    console.log(sort);
  }

  try {
    await user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(limit),
        skip: parseInt(skip),
        sort,
      },
    });

    res.send(user.tasks);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  const task = await Task.findOne({ _id, owner: req.user._id });
  try {
    if (!task) {
      return res.status(404).send({});
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send({});
    }

    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send({});
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
