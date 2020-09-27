module.exports = {
  runGulp: taskName => new Promise((resolve, reject) => {
    require('../../bin/gulpfile');
    const { gulp } = require('@saurabhdeep/cli-test-common/singleton');
    if (gulp._registry.get(taskName)) {
      gulp.once('error', (err) => {
        reject(err);
      });
      gulp.series(taskName, () => {
        resolve();
      })();
    } else {
      const err = `Command '${taskName}' not found!`;
      reject(err);
    }
  }),
};
