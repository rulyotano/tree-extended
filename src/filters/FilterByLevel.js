const Filter = require("./Filter");

module.exports = class FilterByLevel extends Filter {
  constructor(configurationItems = []) {
    super();
    this.configurationByLevel = FilterByLevel.getConfigurationByLevels(configurationItems);
  }

  static getConfigurationByLevels(configurationItems) {
    const configurationByLevel = {};
    configurationItems.forEach((configurationItem) => {
      if (!configurationByLevel[configurationItem.deep]) {
        configurationByLevel[configurationItem.deep] = [];
      }
      configurationByLevel[configurationItem.deep].push(configurationItem);
    });
    return configurationByLevel;
  }
};
