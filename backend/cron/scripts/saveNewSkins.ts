const ddragon = require("./utils/ddragon");

(async () => {
  const code = await ddragon.saveNewSkins();
  process.exit(code === 1 ? 1 : 0);
})();

