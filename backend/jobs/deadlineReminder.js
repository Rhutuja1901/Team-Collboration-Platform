const cron = require("node-cron");
const prisma = require("../utils/prisma");

const startDeadlineReminder = () => {
  // Runs every hour
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("Checking task deadlines...");

      const next24Hours = new Date();
      next24Hours.setHours(next24Hours.getHours() + 24);

      const tasks = await prisma.task.findMany({
        where: {
          deadline: {
            lte: next24Hours,
          },
          status: {
            not: "DONE",
          },
          assignedToId: {
            not: null,
          },
        },
      });

      for (const task of tasks) {
        await prisma.notification.create({
          data: {
            userId: task.assignedToId,
            message: `Reminder: Task "${task.title}" is due soon.`,
          },
        });

        console.log(`Reminder created for task: ${task.title}`);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = startDeadlineReminder;